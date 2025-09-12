import { Metadata } from "next";
import { notFound } from "next/navigation";

import { tracks } from "../../../../../public/curriculum";
import { TrackEntry, UnitEntry } from "../../track";

import { Breadcrumb } from "@/components/breadcrumb";
import { SlidesQRCode } from "@/components/slidesQrCode";
import { RevealjsClientWrapper } from "@/components/revealjsWrapper/revealjsClientWrapper";
import { ResponsiveImage } from "@/components/responsiveImage";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "./reveal-theme.scss";
import "./xcode-dark.scss";
import styles from "./page.module.scss";
import Link from "next/link";

async function resolveParams(
  params: Promise<{ trackId: string; unitId: string }>
): Promise<{ track: TrackEntry; unit: UnitEntry; unitIndex: number; }> {
  const { trackId, unitId } = await params;
  const track = tracks.find((e) => e.id === trackId);
  const unitIndex = track?.units.findIndex((e: UnitEntry) => e.id === unitId);
  if (!track || unitIndex === undefined || unitIndex === -1) {
    notFound();
  }
  const unit = track.units[unitIndex]
  return { track, unit, unitIndex };
}

export default async function SlidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ trackId: string; unitId: string }>;
  searchParams: Promise<{ "print-pdf"?: boolean }>;
}) {
  const { track, unit, unitIndex } = await resolveParams(params);

  const isPrint = (await searchParams)["print-pdf"] !== undefined;

  // TODO: update to use Suspense when using a proper database that fetches from elsewhere
  // TODO: refactor out any use of `track` or `unit` out of RevealjsClientWrapper, all track/unit logic should be handled here.

  return (
    <div>
      <div
        className={styles.printCover}
        style={!isPrint ? { display: "none" } : {}}
      >
        <div className={styles.loader} />
      </div>
      <div className={styles.headers}>
        <Breadcrumb />
        <h1>{track?.title}</h1>
      </div>
      <RevealjsClientWrapper isPrint={isPrint} track={track} unit={unit}>
        <div className="slides">
          <section>
            <div>
              <div style={{ textAlign: "left" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/logos/tinkercademy.webp"
                  alt="Tinkercademy Logo"
                  height="128px"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png"
                  alt="Swiftinsg Logo"
                  height="128px"
                  style={{ marginLeft: 64 }}
                />
              </div>
              <h4 style={{ fontSize: 45, textAlign: "left" }}>
                {track.idDisplay}: {unit.idDisplay}
              </h4>
              <h2>{track.title}</h2>
              <h1>{unit.title}</h1>
              <p style={{ maxWidth: "40em" }}>{unit.subtitle}</p>
            </div>
          </section>
          <section
            id="slide-view"
            data-markdown={`/markdown/${track?.id}/${unit?.markdownId}.md`}
            data-separator-vertical="^\n---vertical---"
            data-separator-notes="^Note:"
          />
          <section>
            <div style={{ display: "flex" }}>
              <div>
                <h1>Get the Slides</h1>
                <h2>Scan the QR code to access the slide deck.</h2>
              </div>
              <SlidesQRCode />
            </div>
          </section>
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <ResponsiveImage
                className={styles.tinkerLogo}
                src="/assets/logos/tinkercademy_long_light.webp"
                darkSrc="/assets/logos/tinkercademy_long_dark.webp"
                width={3680 / 7}
                height={576 / 7}
                alt="Tinkercademy Logo"
              />
              <p>Swift Coding Club • Track {track.id.slice(-1).toUpperCase()}</p>
            </div>
          </section>
        </div>
        <div className={styles.copyright}>
          <small>
            Copyright © {new Date().getFullYear()} Tinkertanker Pte Ltd. All
            Rights Reserved.
          </small>
        </div>
      </RevealjsClientWrapper>
      <div className={styles.details}>
        <p>{unit.description}</p>
        <div className={styles.navigation}>
          {unitIndex > 0 && (
            <Link
              href={`/tracks/${track.id}/${track.units[unitIndex - 1].id}`}>
              <div>
                <p>Back</p>
                <h2>{track.units[unitIndex - 1].title}</h2>
              </div>
            </Link>
          )}
          {unitIndex < track.units.length - 1 && (
            <Link href={`/tracks/${track.id}/${track.units[unitIndex + 1].id}`}>
              <div>
                <p>Next</p>
                <h2>{track.units[unitIndex + 1].title}</h2>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return tracks
    .map((track) =>
      track.units.map((unit: UnitEntry) => ({
        trackId: track.id,
        unitId: unit.id,
      }))
    )
    .flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string; unitId: string }>;
}): Promise<Metadata> {
  const { unit } = await resolveParams(params);

  return {
    title: unit.title,
  };
}
