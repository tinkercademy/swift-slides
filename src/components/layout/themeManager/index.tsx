'use client';

import { ReactNode } from "react";
import { useDarkMode } from "usehooks-ts";

export function ThemeManager({ children }: { children: ReactNode }) {
    const { isDarkMode } = useDarkMode()

    return (
        <div className={`wrapper ${isDarkMode ? "dark" : "light"}`}>
            {children}
        </div>
    )
}