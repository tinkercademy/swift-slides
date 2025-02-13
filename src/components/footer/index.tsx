import Image from "next/image";
import styles from "./styles.module.scss";

export function Footer() {
    return (
        <footer className={styles.footer}>
          <img className={styles.tinkerLogo} src="/assets/tinkercademy-long.png" />
          <br />
          <div className={styles.appleBadges}>
            <Image src="/assets/apple-badges.svg" fill={true} alt="Apple badges for Certified Trainer (App Development with Swift), Consultants Network and Professional Learning Specialist." />
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
    )
}