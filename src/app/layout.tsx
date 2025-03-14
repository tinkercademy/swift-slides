import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navigator } from "@/components/layout/navigator";
import { ThemeManager } from "@/components/layout/themeManager";

import "./reset.scss";
import "./globals.scss";
import "./_theme.scss";

const interFont = Inter({
  variable: "--font-inter", // use this CSS variable as var(--font-inter)
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

export const metadata: Metadata = {
  title: {
    default: "Swift Explorers Challenge",
    template: "%s | Swift Explorers Challenge",
  },
  description:
    "Swift Explorers is an app development programme that welcomes students and teachers to explore Swift coding on iPad. Since 2022, we've run the programme for 3500+ students from 110 schools.",
  generator: "Next.js",
  applicationName: "Swift Explorers Challenge",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Swift",
    "Swift Accelerator",
    "Swift Accelerator Programme",
    "Swift Explorers Challenge",
    "App Design Challenge",
    "App Development Challenge",
    "School of Science and Technology, Singapore",
    "SST",
    "Crescent Girls' School",
    "CGS",
    "Coding",
    "Programming",
    "Design",
  ],
  authors: [
    { name: "Ryan The", url: "https://ryanthe.com" },
    { name: "Daksh Thapar" },
    { name: "Yee Jia Chen" },
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Swift Explorers Challenge",
    description:
      "Swift Explorers is an app development programme that welcomes students and teachers to explore Swift coding on iPad. Since 2022, we've run the programme for 3500+ students from 110 schools.",
    type: "website",
    locale: "en_SG",
    // images: "/assets/logos/swift_explorers_yellow.png"
  },
};