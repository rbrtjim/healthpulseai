import { create } from "zustand";
import type { SymptomEntry } from "@healthpulse/shared";

interface EntriesState {
  entries: SymptomEntry[];
  setEntries: (entries: SymptomEntry[]) => void;
  upsertEntry: (entry: SymptomEntry) => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  upsertEntry: (entry) =>
    set((s) => {
      const i = s.entries.findIndex((e) => e.id === entry.id);
      if (i === -1) return { entries: [entry, ...s.entries] };
      const next = [...s.entries];
      next[i] = entry;
      return { entries: next };
    }),
}));
