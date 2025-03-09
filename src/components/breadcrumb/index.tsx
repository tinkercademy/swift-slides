'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from "./styles.module.scss";

export function Breadcrumb() {
    // TODO: use parallel routes to refactor breadcrumbs: https://github.com/vercel/next.js/issues/43704#issuecomment-2090798307
    const pathname = usePathname();
    const pathSegments = pathname?.split('/').filter(Boolean) ?? [];

    return (
        <h2 className={styles.breadcrumb}>
            {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const text = segment.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                return (
                    <span key={index} className={isLast ? styles.active : ''}>
                        <span className={styles.segment}>
                            {!isLast ? (
                                <Link href={href} className={styles.link}>
                                    {text}
                                </Link>
                            ) : (
                                text
                            )}
                        </span>
                        <span className={styles.separator}>{!isLast && ' / '}</span>
                    </span>
                );
            })}
        </h2>
    );
}