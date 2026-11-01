import type { Category, Garment, Preferences, DemoWeather } from "./types";
export const CATALOG: {
  category: Category;
  label: string;
  color: string;
  warmth: number;
  layer: "base" | "mid" | "shell";
  waterproof?: boolean;
}[] = [
  {
    category: "tee",
    label: "Tişört",
    color: "#E5DFD2",
    warmth: 0,
    layer: "base",
  },
  {
    category: "longsleeve",
    label: "Uzun kollu üst",
    color: "#D8D0BD",
    warmth: 1,
    layer: "base",
  },
  {
    category: "knit",
    label: "İnce kazak",
    color: "#67715B",
    warmth: 2,
    layer: "mid",
  },
  {
    category: "heavyknit",
    label: "Kalın kazak",
    color: "#9B7D63",
    warmth: 4,
    layer: "mid",
  },
  {
    category: "hoodie",
    label: "Sweatshirt",
    color: "#979D99",
    warmth: 3,
    layer: "mid",
  },
  {
    category: "jacket",
    label: "Hafif mont",
    color: "#BF9E76",
    warmth: 2,
    layer: "shell",
  },
  {
    category: "raincoat",
    label: "Yağmurluk",
    color: "#394D55",
    warmth: 1,
    layer: "shell",
    waterproof: true,
  },
  {
    category: "coat",
    label: "Kalın mont",
    color: "#343D38",
    warmth: 5,
    layer: "shell",
  },
];
export const COLORS = [
  "#E5DFD2",
  "#67715B",
  "#BF9E76",
  "#394D55",
  "#343D38",
  "#AD6F5F",
];
export const DEFAULT_PREFERENCES: Preferences = {
  city: "Londra",
  sensitivity: "neutral",
  departure: "08:15",
  returnTime: "18:00",
  minutes: 25,
};
export const CITIES = [
  "Londra",
  "İstanbul",
  "Stockholm",
  "Kopenhag",
  "New York",
  "Tokyo",
];
export const SCENARIOS: DemoWeather[] = [
  {
    id: "changeable",
    name: "Serin → ılık",
    morning: { temp: 9, feelsLike: 7, wind: 18, rain: false },
    evening: { temp: 17, feelsLike: 16, wind: 12, rain: true },
  },
  {
    id: "warm",
    name: "Sıcak gün",
    morning: { temp: 24, feelsLike: 25, wind: 8, rain: false },
    evening: { temp: 28, feelsLike: 29, wind: 6, rain: false },
  },
  {
    id: "wet",
    name: "Yağmurlu",
    morning: { temp: 14, feelsLike: 12, wind: 25, rain: true },
    evening: { temp: 11, feelsLike: 8, wind: 28, rain: true },
  },
  {
    id: "cold",
    name: "Soğuk gün",
    morning: { temp: -3, feelsLike: -7, wind: 24, rain: false },
    evening: { temp: 1, feelsLike: -2, wind: 16, rain: false },
  },
];
export function garmentFor(category: Category): Garment {
  const c = CATALOG.find((x) => x.category === category)!;
  return {
    id: category,
    category,
    name: c.label,
    color: c.color,
    nameSource: "catalog",
  };
}
export function scenarioFor(id: string): DemoWeather {
  return SCENARIOS.find((x) => x.id === id) ?? SCENARIOS[0];
}
