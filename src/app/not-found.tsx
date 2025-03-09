import Link from 'next/link'
import styles from "./not-found.module.scss";

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <div className={styles.bear}></div>
      <h1>404</h1>
      <h2>Could not find requested resource.</h2>
      <Link href="/tracks">Return Home</Link>
    </div>
  )
}