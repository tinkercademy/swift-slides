'use client';
import { TrackCurriculumEntry, UnitCurriculumEntry } from "@/app/tracks/track";
// https://github.com/vercel/next.js/discussions/43631
// The structure of the Revealjs Wrappers is as follows:
// 
// <ServerComponentPage>
//      <RevealjsClientWrapper>
//          <RevealjsNoSSRWrapper>
//              ...
//          </RevealjsNoSSRWrapper>
//      </RevealjsClientWrapper>
// </ServerComponentPage>
//
// Nextjs has several methods of rendering content: (SSR) Server Components, (SSR) Client Components and No-SSR Client Components.
// See https://dev.to/shanu001x/why-do-client-components-render-as-ssr-in-nextjs-marking-components-as-use-client-still-render-its-html-as-ssr-why-1e70.
//
// By default, Nextjs uses Server Components and we try to follow suit for performance reasons. However, Revealjs requires
// access to browser-only DOM properties (eg window, navigator) and thus requires No-SSR Client Components (imported via `ssr: false` with `next/dynamic`).
//
// Nextjs requires that these No-SSR Client Components only exist in other Client Components (SSR Client Component in this case). Subsequently, the SSR Client Component
// can then exist in Server Components as per usual, thus the need for double wrappers.

import dynamic from "next/dynamic";

const RevealjsNoSSRWrapper = dynamic(() =>
    import('@/components/revealjsWrapper/revealjsNoSSRWrapper').then(module => module.RevealjsNoSSRWrapper),
    { ssr: false }
);

export function RevealjsClientWrapper({ children, isPrint, track, unit }: { children: React.ReactNode, isPrint: boolean, track: TrackCurriculumEntry, unit: UnitCurriculumEntry }) {
    return <RevealjsNoSSRWrapper isPrint={isPrint} track={track} unit={unit}>{children}</RevealjsNoSSRWrapper>
}