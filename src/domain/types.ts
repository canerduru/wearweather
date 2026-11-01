export type Category =
  | "tee"
  | "longsleeve"
  | "knit"
  | "heavyknit"
  | "hoodie"
  | "jacket"
  | "raincoat"
  | "coat";
export type Garment = {
  id: string;
  category: Category;
  name: string;
  nameSource?: "catalog" | "custom";
  color: string;
};
export type Preferences = {
  city: string;
  sensitivity: "cold" | "neutral" | "warm";
  departure: string;
  returnTime: string;
  minutes: number;
};
export type Feedback = { date: string; value: "cold" | "comfortable" | "hot" };
export type WeatherPoint = {
  temp: number;
  feelsLike?: number;
  wind: number;
  rain: boolean;
};
export type DemoWeather = {
  id: string;
  name: string;
  nameSource?: "catalog" | "custom";
  morning: WeatherPoint;
  evening: WeatherPoint;
};
export type Outfit = {
  items: Garment[];
  missing: string[];
  reason: string;
  effectiveTemp: number;
};
export type DayPlan = {
  morning: Outfit;
  evening: Outfit;
  pack: Garment[];
  umbrella: boolean;
};
export type PersistedState = {
  version: 1;
  onboarded: boolean;
  wardrobe: Garment[];
  preferences: Preferences;
  feedback: Feedback[];
  premiumDemo: boolean;
  scenario: string;
};
