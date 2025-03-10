'use client';

import QRCode from "react-qr-code";

import styles from "./styles.module.scss"
import { useEffect, useState } from "react";

// TODO: figure out of old method of resolveCurrentURL may still work in production, then removing the need for this Client Component wrapper
// (previous implementation using purely Server Components did not work on production, only worked on development)
//
// async function resolveCurrentURL() {
//     const heads = await headers()
//     if (heads.get("x-forwarded-host") && heads.get("x-forwarded-proto") && heads.get("x-original-uri")) {
//         return `${heads.get("x-forwarded-proto")}://${heads.get("x-forwarded-host")}${heads.get("x-original-uri")}`
//     }
// }

export function SlidesQRCode() {
    const [currentURL, setCurrentURL] = useState("");

    useEffect(() => {
        if (process) {
            setCurrentURL(window.location.href);
        }
    }, []);

    return (
        <div className={styles.border}>
            <QRCode
                className={styles.qrCode}
                size={256}
                value={currentURL}
                viewBox={`0 0 256 256`}
            />
        </div>
    )
}