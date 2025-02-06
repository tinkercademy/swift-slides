import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

import styles from "./layout.module.scss";
import "./reset.scss";
import "./globals.scss";

const interFont = Inter({
  variable: "--font-inter", // use this CSS variable as var(--font-inter)
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swift Explorers Curriculum",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interFont.variable}>
      <body>
        <main>
          <div className={styles.explorersLogo}>
            <Image src="/logos/logo_yellow_540h.png" fill={true} alt="The Swift Explorers Logo" />
          </div>
          {children}
        </main>
        <footer className={styles.footer}>
          <img className={styles.tinkerLogo} src="/footer/tinkercademy-long.png" />
          <br />
          <div className={styles.appleBadges}>
            <Image src="/footer/apple-badges.svg" fill={true} alt="Apple badges for Certified Trainer (App Development with Swift), Consultants Network and Professional Learning Specialist." />
          </div>
          <br />
          <p>
            Find out more:{" "}
            <a href="https://swiftexplorers.sg">Swift Explorers Challenge</a>{" • "}
            <a href="https://swiftinsg.org">Swift Accelerator</a>{" • "}
            <a href="https://tinkercademy.com">Tinkercademy</a>
            <br />
            Open-sourced on <a href="https://github.com/tinkercademy/swift-slides">GitHub</a>.{" "}
            <a href="https://github.com/tinkercademy/swift-slides/issues/new">Report issues</a>.
            <br />
            Copyright © 2025 <a href="https://tinkertanker.com">Tinkertanker Pte Ltd</a>. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
