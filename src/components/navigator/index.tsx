import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";

export function Navigator() {
  return (
    <nav>
      <div className={styles.explorersLogo}>
        <Link href="/tracks">
          <Image src="/assets/logo_yellow_540h.png" fill={true} alt="The Swift Explorers Logo" />
        </Link>
      </div>
    </nav>
  )
}