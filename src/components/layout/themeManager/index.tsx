'use client';

import { ReactNode } from "react";
import { useDarkMode } from "usehooks-ts";

export function ThemeManager({ children }: { children: ReactNode }) {
    const { isDarkMode } = useDarkMode({ initializeWithValue: false })

    return (
        <div className={isDarkMode ? "dark" : "light"}>
            {children}
        </div>
    )
}