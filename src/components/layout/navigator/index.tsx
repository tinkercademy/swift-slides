'use client';

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { ActionsBar } from "../../actionsBar";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ResponsiveImage } from "@/components/responsiveImage";

export function Navigator() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleDarkMode, isDarkMode } = useDarkMode()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navigator} ${isScrolled && styles.scrolled}`}>
      <div className={styles.explorersLogo}>
        <Link href="/tracks">
          <ResponsiveImage
            src="/assets/logos/swift_explorers_yellow.png"
            darkSrc="/assets/logos/swift_explorers_purple.png"
            key={isDarkMode ? "dark" : "light"}
            fill={true}
            alt="The Swift Explorers Logo"
          />
        </Link>
      </div>
      <ActionsBar actions={[
        {
          name: "theme",
          onClick: () => { toggleDarkMode() },
          icon: (isDarkMode ? FaSun : FaMoon),
          hoverText: isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
        }
      ]} />
    </nav>
  );
}