import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://tinkercademy.com/" target="_blank">
        <img className={styles.tinkerLogo} src="/assets/tinkercademy-long.png" />
      </Link>
      <br />
      <div className={styles.appleBadges}>
        <Image src="/assets/apple-badges.svg" fill={true} alt="Apple badges for Certified Trainer (App Development with Swift), Consultants Network and Professional Learning Specialist." />
      </div>
      <br />
      <p>
        Find out more:{" "}
        <Link href="https://swiftexplorers.sg">Swift Explorers Challenge</Link>{" • "}
        <Link href="https://swiftinsg.org">Swift LinkAccelerator</Link>{" • "}
        <Link href="https://tinkercademy.com">Tinkercademy</Link>
        <br />
        Open-sourced on <Link href="https://github.com/tinkercademy/swift-slides">GitHub</Link>.{" "}
        <Link href="https://github.com/tinkercademy/swift-slides/issues/new">Report issues</Link>.
        <br />
        Copyright © 2025 <Link href="https://tinkertanker.com">Tinkertanker Pte Ltd</Link>. All Rights Reserved.
      </p>
    </footer>
  )
}