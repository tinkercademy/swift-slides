"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./styles.module.scss";
import { ResponsiveImage } from "@/components/responsiveImage";

export function CurriculumCard({
    title, subtitle, description, imgURL, pageURL, color, disabled
}: {
    title: string,
    subtitle?: string,
    description?: string,
    imgURL?: string,
    pageURL?: string
    color: "blue" | "green" | "pink" | "red",
    disabled?: boolean
}) {

    const pathname = usePathname()

    return (
        <Link href={pageURL?.startsWith("http") || pageURL?.startsWith("/") ? pageURL : `${pathname}/${pageURL}`} className={`${styles.card} ${styles[color]} ${(disabled ?? false) ? styles.disabled : ""}`}>
            <div className={styles.entryImg}>
                <ResponsiveImage
                    src={imgURL || "/covers/placeholder.png"}
                    fallbackSrc="/covers/placeholder.png"
                    placeholder="blur" blurDataURL="/covers/placeholder.png"
                    fill={true}
                    alt={`Cover image for "${subtitle ?? title}"`} />
            </div>
            <div className={styles.contentWrapper}>
                <h3>{subtitle}</h3>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </Link>
    )
}