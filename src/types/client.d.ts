import type { PreferenceTable } from "../client-scripts/preference";

declare global {
  interface Window {
    __PREFERENCES__: PreferenceTable;
  }
}