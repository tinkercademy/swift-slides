export interface CurriculumEntry {
    id: string; // track_XX or unit_XX
    title: string;
    subtitle: string;
    description: string;
    disabled?: boolean;
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

export function getColorFromTrack(trackId: string): "blue" | "green" | "pink" | "red" {
    switch (trackId) {
      case "track_a": return "blue"
      case "track_b": return "green"
      case "track_c": return "pink"
      case "track_x": return "red"
      default: return "red"
    }
  }  