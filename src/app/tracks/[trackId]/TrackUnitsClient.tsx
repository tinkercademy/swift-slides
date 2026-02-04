"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { TrackEntry } from "../track";
import { getColorFromTrack } from "../track";
import { Breadcrumb } from "@/components/breadcrumb";
import { CurriculumCard } from "@/components/curriculumGrid/curriculumCard";
import { CurriculumGrid } from "@/components/curriculumGrid/curriculumGrid";
import { SearchBar } from "@/components/searchBar";

import styles from "./page.module.scss";

type UnitCard = {
  id: string;
  title: string;
  idDisplay: string;
  subtitle: string;
  description: string;
  imgURL: string;
  disabled?: boolean;
};

export function TrackUnitsClient({
  track,
  unitCards,
}: {
  track: TrackEntry;
  unitCards: UnitCard[];
}) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams?.get("search") ?? "";
  const normalisedSearch = searchTerm.trim().toLowerCase();
  const color = getColorFromTrack(track.id);

  const filteredUnits = useMemo(() => {
    if (!normalisedSearch) {
      return unitCards;
    }

    return unitCards.filter((unit) => {
      const subtitle = unit.subtitle?.toLowerCase() ?? "";
      return (
        unit.title.toLowerCase().includes(normalisedSearch) ||
        unit.idDisplay.toLowerCase().includes(normalisedSearch) ||
        subtitle.includes(normalisedSearch)
      );
    });
  }, [normalisedSearch, unitCards]);

  return (
    <div>
      <div className={styles.flexbox}>
        <div className={styles.headers}>
          <Breadcrumb />
          <h1>{track.title}</h1>
        </div>
        <SearchBar searchTerm={searchTerm} />
      </div>
      <CurriculumGrid>
        {filteredUnits.length > 0 ? (
          filteredUnits.map((unit) => (
            <CurriculumCard
              key={unit.id}
              title={unit.title}
              subtitle={unit.idDisplay}
              description={unit.subtitle}
              imgURL={unit.imgURL}
              pageURL={unit.id}
              color={color}
              disabled={unit.disabled}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <FaMagnifyingGlass />
            <h2>No Results for &quot;{searchTerm}&quot;</h2>
            <p>Check the spelling or try a new search.</p>
          </div>
        )}
      </CurriculumGrid>
    </div>
  );
}
