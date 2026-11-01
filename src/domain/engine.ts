import { CATALOG } from "./catalog";
import type {
  DayPlan,
  DemoWeather,
  Feedback,
  Garment,
  Outfit,
  Preferences,
  WeatherPoint,
} from "./types";
export function calibrationFrom(feedback: Feedback[]): number {
  return Math.max(
    -3,
    Math.min(
      3,
      feedback
        .slice(-14)
        .reduce(
          (v, f) =>
            v + (f.value === "cold" ? 0.5 : f.value === "hot" ? -0.5 : 0),
          0,
        ),
    ),
  );
}
function outfit(
  wardrobe: Garment[],
  preferences: Preferences,
  weather: WeatherPoint,
  calibration: number,
): Outfit {
  const sensitivity =
    preferences.sensitivity === "cold"
      ? 2
      : preferences.sensitivity === "warm"
        ? -2
        : 0;
  const duration =
    preferences.minutes >= 45 ? 1 : preferences.minutes <= 10 ? -1 : 0;
  const effectiveTemp =
    (weather.feelsLike ?? weather.temp) - sensitivity - calibration - duration;
  const items: Garment[] = [];
  const missing: string[] = [];
  const owned = (layer: string) =>
    wardrobe.filter(
      (g) => CATALOG.find((c) => c.category === g.category)?.layer === layer,
    );
  const choose = (layer: string, target: number, waterproof = false) =>
    owned(layer)
      .filter(
        (g) =>
          !waterproof ||
          CATALOG.find((c) => c.category === g.category)?.waterproof,
      )
      .sort(
        (a, b) =>
          Math.abs(
            CATALOG.find((c) => c.category === a.category)!.warmth - target,
          ) -
          Math.abs(
            CATALOG.find((c) => c.category === b.category)!.warmth - target,
          ),
      )[0];
  const base = choose("base", effectiveTemp >= 19 ? 0 : 1);
  if (base) items.push(base);
  else missing.push("Bir tişört veya uzun kollu üst ekle.");
  if (effectiveTemp < 18) {
    const mid = choose("mid", effectiveTemp < 7 ? 4 : 2);
    if (mid) items.push(mid);
    else missing.push("Isıtan bir ara katman eksik.");
  }
  if (effectiveTemp < 12 || weather.rain) {
    const shell =
      choose("shell", effectiveTemp < 3 ? 5 : 2, weather.rain) ??
      choose("shell", effectiveTemp < 3 ? 5 : 2);
    if (shell) items.push(shell);
    else missing.push("Havaya uygun bir dış katman eksik.");
    if (
      weather.rain &&
      !items.some(
        (g) => CATALOG.find((c) => c.category === g.category)?.waterproof,
      )
    )
      missing.push("Su geçirmez yağmur koruması eksik.");
  }
  if (effectiveTemp < 0)
    missing.push(
      "Çok soğuk: eldiven, bere ve uygun alt giyimi ayrıca değerlendir.",
    );
  const reason = weather.rain
    ? "Yağmur için dış koruma; içeride katmanını çıkarabilirsin."
    : effectiveTemp >= 18
      ? "Hafif bir temel katman yeterli; gereksiz katman taşıma."
      : effectiveTemp < 12
        ? "Serin havada çıkarılabilir katmanlar daha esnek."
        : "İnce bir ara katmanla sıcaklığa uyum sağla.";
  return { items, missing, reason, effectiveTemp };
}
export function buildPlan(
  wardrobe: Garment[],
  preferences: Preferences,
  weather: DemoWeather,
  calibration: number,
): DayPlan {
  const morning = outfit(wardrobe, preferences, weather.morning, calibration);
  const evening = outfit(wardrobe, preferences, weather.evening, calibration);
  return {
    morning,
    evening,
    pack: evening.items.filter(
      (g) => !morning.items.some((m) => m.id === g.id),
    ),
    umbrella: weather.morning.rain || weather.evening.rain,
  };
}
