'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import Link from "next/link";
import { ActionsBar } from "../../actionsBar";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useDarkMode } from "usehooks-ts";
import { ResponsiveImage } from "@/components/imagePlus";

export function Navigator() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggle: toggleDarkMode, isDarkMode } = useDarkMode()

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
            src="/assets/swift_explorers_yellow.png"
            darkSrc="/assets/swift_explorers_purple.png"
            fill={true}
            alt="The Swift Explorers Logo" />
        </Link>
      </div>
      <ActionsBar actions={[
        {
          name: "theme",
          onClick: () => { toggleDarkMode() },
          icon: (isDarkMode ? <FaSun /> : <FaMoon />)
        }
      ]} />
    </nav>
  );
}