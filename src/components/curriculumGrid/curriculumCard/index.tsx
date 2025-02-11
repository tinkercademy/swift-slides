"use client";

import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CurriculumCard({
    title, subtitle, description, imgURL, pageURL, color
}: {
    title: string,
    subtitle?: string,
    description?: string,
    imgURL?: string,
    pageURL?: string
    color: "blue" | "green" | "pink" | "red",
}) {

    const pathname = usePathname()

    return (
        <Link href={pageURL?.startsWith("http") || pageURL?.startsWith("/") ? pageURL : `${pathname}/${pageURL}`} className={`${styles.card} ${styles[color]}`}>
            <div className={styles.entryImg}>
                <Image src={imgURL ?? "/covers/placeholder"} fill={true} alt={`Cover image for "${subtitle ?? title}"`} />
            </div>
            <div className={styles.contentWrapper}>
                <h3>{subtitle}</h3>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </Link>
    )
}