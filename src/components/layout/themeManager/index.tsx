'use client';

import { useDarkMode } from "usehooks-ts";

export function ThemeManager({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useDarkMode({ initializeWithValue: false })

    return (
        <div className={isDarkMode ? "dark" : "light"}>
            {children}
        </div>
    )
}