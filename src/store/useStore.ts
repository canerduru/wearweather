import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  decodeState,
  INITIAL_STATE,
  recordFeedback,
  STORAGE_KEY,
} from "../services/storage";
import type {
  Feedback,
  Garment,
  PersistedState,
  Preferences,
} from "../domain/types";
type Store = PersistedState & {
  hydrated: boolean;
  storageWarning: string | null;
  readOnly: boolean;
  hydrate: () => Promise<void>;
  setPreferences: (p: Partial<Preferences>) => void;
  setWardrobe: (g: Garment[]) => void;
  completeOnboarding: () => void;
  setScenario: (id: string) => void;
  setPremiumDemo: (v: boolean) => void;
  giveFeedback: (v: Feedback["value"]) => void;
};
export const useStore = create<Store>((set, get) => ({
  ...INITIAL_STATE,
  hydrated: false,
  storageWarning: null,
  readOnly: false,
  async hydrate() {
    try {
      const r = decodeState(await AsyncStorage.getItem(STORAGE_KEY));
      set({
        ...r.state,
        storageWarning: r.warning,
        readOnly: r.readOnly,
        hydrated: true,
      });
    } catch {
      set({
        hydrated: true,
        readOnly: true,
        storageWarning:
          "Cihaz kaydına erişilemiyor. Bu oturumdaki değişiklikler saklanmayacak.",
      });
    }
  },
  setPreferences: (p) =>
    set((s) => ({ preferences: { ...s.preferences, ...p } })),
  setWardrobe: (wardrobe) => set({ wardrobe }),
  completeOnboarding: () => set({ onboarded: true }),
  setScenario: (scenario) => set({ scenario }),
  setPremiumDemo: (premiumDemo) => set({ premiumDemo }),
  giveFeedback: (value) =>
    set({ feedback: recordFeedback(get().feedback, value) }),
}));
let writes = Promise.resolve();
useStore.subscribe((s, prev) => {
  if (!s.hydrated || s.readOnly) return;
  if (
    s.wardrobe === prev.wardrobe &&
    s.preferences === prev.preferences &&
    s.feedback === prev.feedback &&
    s.premiumDemo === prev.premiumDemo &&
    s.scenario === prev.scenario &&
    s.onboarded === prev.onboarded
  )
    return;
  const snapshot: PersistedState = {
    version: 1,
    wardrobe: s.wardrobe,
    preferences: s.preferences,
    feedback: s.feedback,
    premiumDemo: s.premiumDemo,
    scenario: s.scenario,
    onboarded: s.onboarded,
  };
  writes = writes
    .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)))
    .catch(() => {
      useStore.setState({
        storageWarning:
          "Değişiklikler cihazına kaydedilemedi. Lütfen depolama izinlerini kontrol et.",
      });
    });
});
