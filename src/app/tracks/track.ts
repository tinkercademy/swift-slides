export interface CurriculumEntry {
    id: string; // track_XX or unitZXX
    title: string;
    subtitle: string;
    description: string;
    imgURL: string;
    pageURL: string;
}

export interface TrackCurriculumEntry extends CurriculumEntry {
    units: UnitCurriculumEntry[];
}

export interface UnitCurriculumEntry extends CurriculumEntry {
    markdownId: string;
}