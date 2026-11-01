import {
  CATALOG,
  CITIES,
  DEFAULT_PREFERENCES,
  SCENARIOS,
} from "../domain/catalog";
import type {
  Feedback,
  Garment,
  PersistedState,
  Preferences,
} from "../domain/types";
export const STORAGE_KEY = "wearweather.local.v1";
export const INITIAL_STATE: PersistedState = {
  version: 1,
  onboarded: false,
  wardrobe: [],
  preferences: DEFAULT_PREFERENCES,
  feedback: [],
  premiumDemo: false,
  scenario: "changeable",
};
const isObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;
const time = (x: unknown) =>
  typeof x === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(x);
export function decodeState(raw: string | null): {
  state: PersistedState;
  warning: string | null;
  readOnly: boolean;
} {
  if (!raw)
    return { state: { ...INITIAL_STATE }, warning: null, readOnly: false };
  try {
    const x: unknown = JSON.parse(raw);
    if (!isObj(x)) throw Error("format");
    if (x.version !== 1)
      return {
        state: { ...INITIAL_STATE },
        warning:
          "Bu kayıt başka bir sürüme ait. Kaydın korunuyor; bu oturum geçici.",
        readOnly: true,
      };
    const p = x.preferences;
    if (
      !isObj(p) ||
      !CITIES.includes(String(p.city)) ||
      !["cold", "neutral", "warm"].includes(String(p.sensitivity)) ||
      !time(p.departure) ||
      !time(p.returnTime) ||
      typeof p.minutes !== "number" ||
      p.minutes < 5 ||
      p.minutes > 120
    )
      throw Error("preferences");
    if (
      !Array.isArray(x.wardrobe) ||
      !Array.isArray(x.feedback) ||
      typeof x.onboarded !== "boolean" ||
      typeof x.premiumDemo !== "boolean" ||
      !SCENARIOS.some((s) => s.id === x.scenario)
    )
      throw Error("state");
    const ids = new Set<string>();
    for (const g of x.wardrobe) {
      if (
        !isObj(g) ||
        typeof g.id !== "string" ||
        ids.has(g.id) ||
        !CATALOG.some((c) => c.category === g.category) ||
        typeof g.name !== "string" ||
        !g.name.trim() ||
        (g.nameSource !== undefined &&
          g.nameSource !== "catalog" &&
          g.nameSource !== "custom") ||
        g.name.length > 60 ||
        typeof g.color !== "string" ||
        !/^#[a-f0-9]{6}$/i.test(g.color)
      )
        throw Error("garment");
      ids.add(g.id);
    }
    for (const f of x.feedback) {
      if (
        !isObj(f) ||
        typeof f.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(f.date) ||
        !["cold", "comfortable", "hot"].includes(String(f.value))
      )
        throw Error("feedback");
    }
    return {
      state: {
        version: 1,
        onboarded: x.onboarded,
        wardrobe: x.wardrobe as Garment[],
        preferences: p as Preferences,
        feedback: (x.feedback as Feedback[]).slice(-60),
        premiumDemo: x.premiumDemo,
        scenario: x.scenario as string,
      },
      warning: null,
      readOnly: false,
    };
  } catch {
    return {
      state: { ...INITIAL_STATE },
      warning:
        "Yerel kayıt okunamadı. Önceki kayıt korunuyor; bu oturum geçici.",
      readOnly: true,
    };
  }
}
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function recordFeedback(
  history: Feedback[],
  value: Feedback["value"],
  date = localDate(),
): Feedback[] {
  return [...history.filter((f) => f.date !== date), { date, value }].slice(
    -60,
  );
}
