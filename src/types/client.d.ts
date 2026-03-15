import { StoredPreference } from "../client/preference";
import type { Computed } from "../utils/reactive";

declare class StoredPreference<T> implements EventTarget {}

export type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = 'light' | 'dark' | 'auto';

export type PreferenceTable = {
  colorScheme: StoredPreference<ColorSchemePreference>;
};

export type CakesTable = {
  colorScheme: Computed<ColorScheme>;
};

declare global {
  interface Window {
    __PREFERENCES__: PreferenceTable;
    __CAKES__: CakesTable;
  }
}