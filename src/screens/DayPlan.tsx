import { useTranslation } from "../i18n/useTranslation";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Button, Card, Icon, Notice } from "../components/ui";
import { OutfitView } from "../components/OutfitView";
import { usePlan } from "../store/usePlan";
import { useState } from "react";
export function DayPlan() {
  const { t, text } = useTranslation();

  const { plan, preferences, weather, premium } = usePlan();
  const [saved, setSaved] = useState(false);
  if (!premium)
    return (
      <Screen back title={t("your_day_s_plan")}>
        <Text style={s.title}>{t("plan_for_your_return_too")}</Text>
        <Text style={s.body}>
          {t(
            "journey_plans_and_personal_settings_are_in_premium_try_them_in_demo_mode_wi",
          )}
        </Text>
        <Button onPress={() => router.push("/premium")}>
          {t("explore_premium")}
        </Button>
      </Screen>
    );
  const phases = [
    {
      label: t("heading_to_work"),
      time: preferences.departure,
      weather: weather.morning,
      outfit: plan.morning,
    },
    {
      label: t("heading_home"),
      time: preferences.returnTime,
      weather: weather.evening,
      outfit: plan.evening,
    },
  ];
  return (
    <Screen back>
      <Text style={s.eyebrow}>{t("two_forecasts_one_day")}</Text>
      <Text style={s.title}>
        {weather.morning.temp < weather.evening.temp
          ? t("cool_morning_warmer_return")
          : t("one_day_flexible_layers")}
      </Text>
      {phases.map((p, i) => (
        <View
          key={p.label}
          style={{
            gap: 12,
            borderLeftWidth: 1,
            borderColor: C.line,
            paddingLeft: 17,
          }}
        >
          <View style={s.between}>
            <View style={s.row}>
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: i ? C.camel : C.green,
                  marginLeft: -22,
                }}
              />
              <Text style={[s.body, { fontWeight: "600" }]}>
                {p.time} · {p.label}
              </Text>
            </View>
            <Text style={s.small}>
              {p.weather.temp}° · {p.weather.rain ? t("rainy") : t("clear")}
            </Text>
          </View>
          <Text style={s.small}>
            {t("elapsed_weather", {
              minutes: preferences.minutes,
              temp: p.weather.feelsLike ?? p.weather.temp,
            })}
          </Text>
          <Card style={{ backgroundColor: C.stone, borderWidth: 0 }}>
            <OutfitView items={p.outfit.items} compact />
          </Card>
          <Text style={s.small}>{text(p.outfit.reason)}</Text>
          {p.outfit.missing.map((m) => (
            <Notice key={m}>{text(m)}</Notice>
          ))}
        </View>
      ))}
      <Card style={{ backgroundColor: C.sage }}>
        <View style={s.row}>
          <Icon name="sliders" size={17} />
          <Text style={[s.body, { fontWeight: "600" }]}>
            {t("adjusted_for_you")}
          </Text>
        </View>
        <Text style={s.small}>
          {preferences.sensitivity === "cold"
            ? t("i_get_cold_easily")
            : preferences.sensitivity === "warm"
              ? t("i_get_warm_easily")
              : t("average_sensitivity")}{" "}
          · {preferences.minutes} {t("min_outdoors")}
        </Text>
        <Text style={s.small}>
          {t(
            "times_label_sample_journey_conditions_live_hourly_forecasts_are_not_connect",
          )}
        </Text>
      </Card>
      <Button
        icon={saved ? "check" : "arrow-right"}
        onPress={() => setSaved(true)}
      >
        {saved ? t("plan_marked_on_this_screen") : t("mark_this_plan")}
      </Button>
      <Text style={s.small}>
        {t("no_notification_or_calendar_event_is_created")}
      </Text>
    </Screen>
  );
}
