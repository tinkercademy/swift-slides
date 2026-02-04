import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { tracks } from "../public/curriculum";

const trackRouteRegex = /^\/tracks\/([^/]+)\/?$/;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const match = pathname.match(trackRouteRegex);

  if (!match) {
    return NextResponse.next();
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
