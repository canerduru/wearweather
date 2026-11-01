import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import {
  decodeLanguageChoice,
  LANGUAGE_STORAGE_KEY,
  resolveLocale,
  type LanguageChoice,
  type Locale,
} from "./core";
function deviceLanguages(): string[] {
  return getLocales().map((l) => l.languageTag);
}
type State = {
  choice: LanguageChoice;
  locale: Locale;
  hydrated: boolean;
  saveError: boolean;
  hydrate: () => Promise<void>;
  setChoice: (choice: LanguageChoice) => void;
  refreshSystem: () => void;
};
let writes = Promise.resolve();
export const useLanguage = create<State>((set, get) => ({
  choice: "system",
  locale: resolveLocale("system", deviceLanguages()),
  hydrated: false,
  saveError: false,
  async hydrate() {
    try {
      const raw = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const choice = decodeLanguageChoice(raw);
      set({
        choice,
        locale: resolveLocale(choice, deviceLanguages()),
        hydrated: true,
      });
    } catch {
      set({ hydrated: true, saveError: true });
    }
  },
  setChoice(choice) {
    set({
      choice,
      locale: resolveLocale(choice, deviceLanguages()),
      saveError: false,
    });
    writes = writes
      .then(() =>
        AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(choice)),
      )
      .catch(() => {
        set({ saveError: true });
      });
  },
  refreshSystem() {
    set({ locale: resolveLocale(get().choice, deviceLanguages()) });
  },
}));
