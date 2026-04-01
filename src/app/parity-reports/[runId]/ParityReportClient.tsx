"use client";

import { useDarkMode } from "@/hooks/useDarkMode";
import { useCallback, useEffect, useState } from "react";
import styles from "./ParityReportClient.module.scss";

type SlideVisual = {
  baselinePath: string | null;
  baselinePathDark: string | null;
  currentPath: string | null;
  currentPathDark: string | null;
};

type SlideComparison = {
  index: number;
  baseline: { heading: string | null } | null;
  current: { heading: string | null } | null;
  visual: SlideVisual | null;
};

type ParityReportUnit = {
  route: string;
  title: string;
  slides: SlideComparison[];
};

type ParityReport = {
  generatedAt: string;
  units: ParityReportUnit[];
};

export function ParityReportClient({ runId }: { runId: string }) {
  const { isDarkMode } = useDarkMode();
  const [report, setReport] = useState<ParityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = `/parity-reports/${runId}`;

  useEffect(() => {
    fetch(`${base}/report.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load report"));
  }, [base]);

  const imgSrc = useCallback(
    (path: string | null, darkPath: string | null) => {
      const p = isDarkMode && darkPath ? darkPath : path ?? darkPath;
      return p ? `${base}/${p}` : null;
    },
    [base, isDarkMode]
  );

  if (error) {
    return (
      <div className={styles.error}>
        Report not found. Run the parity checker first.
      </div>
    );
  }

  if (!report) {
    return <div className={styles.loading}>Loading report…</div>;
  }

  const unitTitle = report.units.map((u) => u.title).join(" · ");

  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>
        Use the theme toggle in the site header to switch light/dark. This view uses the same toggle as the rest of the app.
      </p>
      <h1 className={styles.title}>{unitTitle}</h1>
      {report.units.flatMap((unit) =>
        unit.slides.map((slide) => {
          const v = slide.visual;
          const heading =
            slide.current?.heading ?? slide.baseline?.heading ?? "Untitled";
          const beforeSrc = imgSrc(v?.baselinePath ?? null, v?.baselinePathDark ?? null);
          const afterSrc = imgSrc(v?.currentPath ?? null, v?.currentPathDark ?? null);

          return (
            <section key={`${unit.route}-${slide.index}`} className={styles.slideRow}>
              <h2 className={styles.slideHeading}>
                {slide.index + 1}. {heading}
              </h2>
              <div className={styles.comparison}>
                {beforeSrc ? (
                  <a
                    href={beforeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.panel}
                  >
                    <img src={beforeSrc} alt="Before" />
                  </a>
                ) : (
                  <div className={styles.panelEmpty}>—</div>
                )}
                <span className={styles.divider}>|</span>
                {afterSrc ? (
                  <a
                    href={afterSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.panel}
                  >
                    <img src={afterSrc} alt="After" />
                  </a>
                ) : (
                  <div className={styles.panelEmpty}>—</div>
                )}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

