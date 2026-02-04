import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { tracks } from "../public/curriculum";

const trackRouteRegex = /^\/tracks\/([^/]+)\/?$/;
const blockedUserAgentPatterns = [
  /GPTBot/i,
  /CCBot/i,
  /ClaudeBot/i,
  /Anthropic/i,
  /Google-Extended/i,
  /Bytespider/i,
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const match = pathname.match(trackRouteRegex);

  if (!match) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (blockedUserAgentPatterns.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const deck = searchParams.get("deck");
  if (!deck) {
    return NextResponse.next();
  }

  const trackId = match[1];
  const track = tracks.find((entry) => entry.id === trackId);
  const unitId = track?.units.find((unit) => unit.markdownId === deck)?.id;

  if (!unitId) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/tracks/${trackId}/${unitId}`;
  redirectUrl.searchParams.delete("deck");

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/tracks/:path*"],
};
