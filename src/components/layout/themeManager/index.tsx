'use client';

import { useDarkMode } from "@/hooks/useDarkMode";

export function ThemeManager({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useDarkMode()

    return (
        <div className={isDarkMode ? "dark" : "light"}>
            {children}
        </div>
    )
}