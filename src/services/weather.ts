import { scenarioFor } from "../domain/catalog";
import type { DemoWeather, Preferences } from "../domain/types";
export interface WeatherProvider {
  getForecast(preferences: Preferences, scenario: string): DemoWeather;
  sourceLabel: string;
}
export const demoWeather: WeatherProvider = {
  getForecast: (_preferences, scenario) => scenarioFor(scenario),
  sourceLabel: "Demo hava verisi",
};
