export interface Entry {
    id: string; // track_XX or unit_XX
    title: string;
    subtitle: string;
    description: string;
    disabled?: boolean;
}

export interface TrackEntry extends Entry {
    units: UnitEntry[];
}

export interface UnitEntry extends Entry {
    markdownId: string;
}

export function isTrackCurriculumEntry(entry: Entry): entry is TrackEntry {
    return (entry as TrackEntry).units !== undefined
}

export function getColorFromTrack(trackId: string | undefined): "blue" | "green" | "pink" | "red" {
    switch (trackId) {
      case "track_a": return "blue"
      case "track_b": return "green"
      case "track_c": return "pink"
      case "track_x": return "red"
      default: return "red"
    }
  }  