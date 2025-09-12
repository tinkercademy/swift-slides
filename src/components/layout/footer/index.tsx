import Link from "next/link";
import { ResponsiveImage } from "@/components/responsiveImage";

import styles from "./styles.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logos}>
        <Link href="https://tinkercademy.com/" target="_blank">
          <ResponsiveImage
            className={styles.tinkerLogo}
            src="/assets/logos/tinkercademy_long_light.webp"
            darkSrc="/assets/logos/tinkercademy_long_dark.webp"
            width={3680 / 14}
            height={576 / 14}
            alt="Tinkercademy Logo" />
        </Link>
        <ResponsiveImage
          src="/assets/logos/apple_badges_light.svg"
          darkSrc="/assets/logos/apple_badges_dark.svg"
          width={868 / 1.5}
          height={64 / 1.5}
          alt="Apple badges for Certified Trainer (App Development with Swift), Consultants Network and Professional Learning Specialist." />
      </div>
      <br />
      <p>
        Find out more:{" "}
        <Link href="https://swiftexplorers.sg" target="_blank">Swift Explorers Challenge</Link>{" • "}
        <Link href="https://swiftinsg.org" target="_blank">Swift Accelerator Programme</Link>{" • "}
        <Link href="https://tinkercademy.com" target="_blank">Tinkercademy</Link>
        <br />
        Open-sourced on <Link href="https://github.com/tinkercademy/swift-slides" target="_blank">GitHub</Link>.{" "}
        <Link href="https://github.com/tinkercademy/swift-slides/issues/new" target="_blank">Report issues</Link>.
        <br />
        Copyright © {new Date().getFullYear()} <Link href="https://tinkertanker.com" target="_blank">Tinkertanker Pte Ltd</Link>. All Rights Reserved.
      </p>
    </footer>
  )
}