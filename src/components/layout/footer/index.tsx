import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";
import { ResponsiveImage } from "@/components/responsiveImage";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logos}>
        <Link href="https://tinkercademy.com/" target="_blank">
          <ResponsiveImage
            className={styles.tinkerLogo}
            src="/assets/logos/tinkercademy_long_light.png"
            darkSrc="/assets/logos/tinkercademy_long_dark.png"
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
        <Link href="https://swiftexplorers.sg">Swift Explorers Challenge</Link>{" • "}
        <Link href="https://swiftinsg.org">Swift Accelerator</Link>{" • "}
        <Link href="https://tinkercademy.com">Tinkercademy</Link>
        <br />
        Open-sourced on <Link href="https://github.com/tinkercademy/swift-slides">GitHub</Link>.{" "}
        <Link href="https://github.com/tinkercademy/swift-slides/issues/new">Report issues</Link>.
        <br />
        Copyright © {new Date().getFullYear()} <Link href="https://tinkertanker.com">Tinkertanker Pte Ltd</Link>. All Rights Reserved.
      </p>
    </footer>
  )
}