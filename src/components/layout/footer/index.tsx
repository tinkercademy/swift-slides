import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";
import { ResponsiveImage } from "@/components/imagePlus";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://tinkercademy.com/" target="_blank">
        <ResponsiveImage
          className={styles.tinkerLogo}
          src="/assets/tinkercademy_long_light.png"
          darkSrc="/assets/tinkercademy_long_dark.png"
          width={3680 / 7}
          height={576 / 7}
          alt="Tinkercademy Logo" />
      </Link>
      <br />
      <div className={styles.appleBadges}>
        <Image src="/assets/apple-badges.svg" fill={true} alt="Apple badges for Certified Trainer (App Development with Swift), Consultants Network and Professional Learning Specialist." />
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