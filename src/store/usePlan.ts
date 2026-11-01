import { useMemo } from "react";
import { buildPlan, calibrationFrom } from "../domain/engine";
import { demoWeather } from "../services/weather";
import { useStore } from "./useStore";
export function usePlan() {
  const wardrobe = useStore((s) => s.wardrobe);
  const preferences = useStore((s) => s.preferences);
  const scenario = useStore((s) => s.scenario);
  const feedback = useStore((s) => s.feedback);
  const premium = useStore((s) => s.premiumDemo);
  const weather = demoWeather.getForecast(preferences, scenario);
  const calibration = premium ? calibrationFrom(feedback) : 0;
  const personal = useMemo(
    () =>
      premium
        ? preferences
        : { ...preferences, sensitivity: "neutral" as const, minutes: 25 },
    [premium, preferences],
  );
  const plan = useMemo(
    () => buildPlan(wardrobe, personal, weather, calibration),
    [wardrobe, personal, weather, calibration],
  );
  return { plan, weather, preferences, premium, calibration };
}
