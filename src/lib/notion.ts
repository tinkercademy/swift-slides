import { APIErrorCode, Client, isNotionClientError } from '@notionhq/client';
import type {
  BlockObjectResponse,
  BotUserObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
  SearchResponse
} from '@notionhq/client/build/src/api-endpoints';

const NOTION_VERSION = '2022-06-28';
const RECURSIVE_FETCH_DELAY_MS = 100;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface NotionPage {
  title: string;
  lastEdited: string;
}

export interface NotionAuthValidation {
  workspaceName: string;
  botId: string;
  botName: string;
}

export interface ListAccessiblePagesOptions {
  query?: string;
  cursor?: string;
  pageSize?: number;
}

export interface AccessiblePageItem {
  id: string;
  title: string;
  lastEdited: string;
  url: string;
  parentType: string;
  icon?: string;
}

export interface AccessiblePageList {
  items: AccessiblePageItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

type SearchResult = SearchResponse['results'][number];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout(resolve, ms);
  });
}

function normalizePageId(rawPageId: string): string {
  const compact = rawPageId.replace(/-/g, '').trim();
  if (!/^[a-f0-9]{32}$/i.test(compact)) {
    throw new Error('INVALID_URL');
  }

  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20)
  ].join('-');
}

function isBlockObject(
  block: BlockObjectResponse | PartialBlockObjectResponse
): block is BlockObjectResponse {
  return 'type' in block;
}

function richTextToPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((item): string => item.plain_text).join('').trim();
}

function isPageObject(page: SearchResult): page is PageObjectResponse | PartialPageObjectResponse {
  return page.object === 'page';
}

function isFullPageObject(page: PageObjectResponse | PartialPageObjectResponse): page is PageObjectResponse {
  return 'properties' in page;
}

function isSearchPageWithMetadata(
  page: PageObjectResponse | PartialPageObjectResponse
): page is PageObjectResponse {
  return 'properties' in page && 'last_edited_time' in page && 'url' in page;
}

function extractTitle(page: PageObjectResponse): string {
  const titleProperty = Object.values(page.properties).find((property): boolean => property.type === 'title');

  if (!titleProperty || titleProperty.type !== 'title') {
    return 'Untitled';
  }

  const title = richTextToPlainText(titleProperty.title);
  return title.length > 0 ? title : 'Untitled';
}

function extractPageTitleFromSearch(page: PageObjectResponse | PartialPageObjectResponse): string {
  if (!isFullPageObject(page)) {
    return 'Untitled';
  }

  return extractTitle(page);
}

function extractParentType(page: PageObjectResponse | PartialPageObjectResponse): string {
  if (!('parent' in page) || !page.parent) {
    return 'unknown';
  }

  return page.parent.type;
}

function extractPageIcon(page: PageObjectResponse | PartialPageObjectResponse): string | undefined {
  if (!('icon' in page) || !page.icon) {
    return undefined;
  }

  switch (page.icon.type) {
    case 'emoji':
      return page.icon.emoji;
    case 'external':
      return page.icon.external.url;
    case 'file':
      return page.icon.file.url;
    case 'custom_emoji':
      return page.icon.custom_emoji.url;
    default:
      return undefined;
  }
}

function clampPageSize(pageSize?: number): number {
  if (typeof pageSize !== 'number' || Number.isNaN(pageSize)) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(Math.max(Math.floor(pageSize), 1), MAX_PAGE_SIZE);
}

function createClient(token: string): Client {
  return new Client({
    auth: token,
    notionVersion: NOTION_VERSION
  });
}

function extractWorkspaceName(botUser: BotUserObjectResponse): string {
  if (botUser.bot && 'workspace_name' in botUser.bot && botUser.bot.workspace_name) {
    return botUser.bot.workspace_name;
  }

  return 'Notion Workspace';
}

async function fetchBlocksRecursively(
  notion: Client,
  blockId: string
): Promise<BlockObjectResponse[]> {
  const output: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor
    });

    for (const result of response.results) {
      if (!isBlockObject(result)) {
        continue;
      }

      output.push(result);

      if (result.has_children && result.type !== 'child_page') {
        await sleep(RECURSIVE_FETCH_DELAY_MS);
        const children = await fetchBlocksRecursively(notion, result.id);
        output.push(...children);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return output;
}

export function extractPageId(notionUrl: string): string {
  const trimmed = notionUrl.trim();

  if (trimmed.length === 0) {
    throw new Error('INVALID_URL');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new Error('INVALID_URL');
  }

  const paramId = parsedUrl.searchParams.get('p');
  if (paramId) {
    return normalizePageId(paramId);
  }

  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  if (pathParts.length === 0) {
    throw new Error('INVALID_URL');
  }

  const slug = pathParts[pathParts.length - 1] ?? '';
  const compactIdFromSlug = slug.match(/([a-f0-9]{32})$/i)?.[1] ?? null;
  if (compactIdFromSlug) {
    return normalizePageId(compactIdFromSlug);
  }

  const dashedId = slug.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i)?.[0] ?? null;
  if (dashedId) {
    return normalizePageId(dashedId);
  }

  throw new Error('INVALID_URL');
}

export async function validateNotionToken(token: string): Promise<NotionAuthValidation> {
  const notion = createClient(token);
  const me = await notion.users.me({});

  if (me.type !== 'bot') {
    throw new Error('NOTION_UNAUTHORIZED');
  }

  return {
    workspaceName: extractWorkspaceName(me),
    botId: me.id,
    botName: me.name ?? 'Notion Integration'
  };
}

export async function listAccessiblePages(
  token: string,
  options: ListAccessiblePagesOptions
): Promise<AccessiblePageList> {
  const notion = createClient(token);
  const pageSize = clampPageSize(options.pageSize);

  const response = await notion.search({
    query: options.query?.trim() || undefined,
    start_cursor: options.cursor || undefined,
    page_size: pageSize,
    filter: {
      property: 'object',
      value: 'page'
    },
    sort: {
      timestamp: 'last_edited_time',
      direction: 'descending'
    }
  });

  const items: AccessiblePageItem[] = response.results
    .filter((result): result is PageObjectResponse | PartialPageObjectResponse => isPageObject(result))
    .filter((page): page is PageObjectResponse => isSearchPageWithMetadata(page))
    .map((page): AccessiblePageItem => ({
      id: page.id,
      title: extractPageTitleFromSearch(page),
      lastEdited: page.last_edited_time,
      url: page.url,
      parentType: extractParentType(page),
      icon: extractPageIcon(page)
    }));

  return {
    items,
    nextCursor: response.next_cursor,
    hasMore: response.has_more
  };
}

export async function fetchPage(pageId: string, token: string): Promise<NotionPage> {
  const notion = createClient(token);

  const response = await notion.pages.retrieve({ page_id: pageId });
  if (response.object !== 'page') {
    throw new Error('NOTION_NOT_FOUND');
  }

  const page = response as PageObjectResponse;
  return {
    title: extractTitle(page),
    lastEdited: page.last_edited_time
  };
}

export async function fetchBlocks(pageId: string, token: string): Promise<BlockObjectResponse[]> {
  const notion = createClient(token);
  return fetchBlocksRecursively(notion, pageId);
}

export function mapNotionErrorCode(error: unknown): APIErrorCode | null {
  if (isNotionClientError(error)) {
    const apiErrorCodes = Object.values(APIErrorCode) as string[];
    if (apiErrorCodes.includes(error.code)) {
      return error.code as APIErrorCode;
    }
  }

  return null;
}
