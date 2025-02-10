"use client";

import Image from "next/image";
import styles from "./styles.module.scss";
import { CurriculumEntry } from "@/app/tracks/track";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CurriculumCard({ color, entry }: { color: string, entry: CurriculumEntry }) {
    
    const current_path = usePathname();

    return (
        <Link href={`${current_path}/${entry.id}`} className={`${styles.card} ${styles[color]}`}>
            <div className={styles.entryImg}>
                <Image src={entry.imgURL} fill={true} alt={`Cover image for "${entry.subtitle}"`} />
            </div>
            <div className={styles.contentWrapper}>
                <h3>{entry.subtitle}</h3>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
            </div>
        </Link>
    )
}