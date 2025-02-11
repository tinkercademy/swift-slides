export interface CurriculumEntry {
    id: string; // track_XX or unit_XX
    title: string;
    subtitle: string;
    description: string;
}

export interface TrackCurriculumEntry extends CurriculumEntry {
    units: UnitCurriculumEntry[];
}

export interface UnitCurriculumEntry extends CurriculumEntry {
    markdownId: string;
}

export function isTrackCurriculumEntry(entry: CurriculumEntry): entry is TrackCurriculumEntry {
    return (entry as TrackCurriculumEntry).units !== undefined
}