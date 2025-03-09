import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navigator } from "@/components/layout/navigator";

import "./reset.scss";
import "./globals.scss";
import "./_theme.scss";
import { ThemeManager } from "@/components/layout/themeManager";

const interFont = Inter({
  variable: "--font-inter", // use this CSS variable as var(--font-inter)
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swift Explorers Curriculum",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interFont.variable}>
      <body>
        <ThemeManager>
          <main>
            <Navigator />
            {children}
          </main>
          <Footer />
        </ThemeManager>
      </body>
    </html>
  );
}