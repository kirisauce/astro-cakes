export type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = 'light' | 'dark' | 'system';

export type PreferenceKey = 'color-scheme'

declare global {
  interface Window {
    setPreference(key: 'color-scheme', value: ColorSchemePreference);
  }
}