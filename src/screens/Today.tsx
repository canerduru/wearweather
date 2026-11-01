import { useTranslation } from "../i18n/useTranslation";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Card, Chip, Button, Icon, Notice } from "../components/ui";
import { OutfitView } from "../components/OutfitView";
import { usePlan } from "../store/usePlan";
import { useStore } from "../store/useStore";
import { SCENARIOS } from "../domain/catalog";
export function Today() {
  const { t, text, garmentName } = useTranslation();

  const { plan, weather, preferences, premium } = usePlan();
  const scenario = useStore((x) => x.scenario);
  const setScenario = useStore((x) => x.setScenario);
  const removed = plan.morning.items.filter(
    (x) => !plan.evening.items.some((y) => y.id === x.id),
  );
  return (
    <Screen>
      <View style={s.between}>
        <Text style={s.eyebrow}>{t("daily_layering_plan")}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/profile")}
          style={s.row}
        >
          <Icon name="map-pin" size={13} />
          <Text style={[s.small, { color: C.ink }]}>
            {text(preferences.city)}
          </Text>
          <Icon name="chevron-down" size={13} />
        </Pressable>
      </View>
      <View style={{ gap: 10 }}>
        <Text style={s.title}>{t("headline_today")}</Text>
        <Text style={s.body}>
          {weather.morning.temp < weather.evening.temp
            ? t("a_cool_morning_a_warmer_return_plan_your_layers_around_it")
            : weather.morning.rain
              ? t("be_ready_for_rain_stay_light_and_protected")
              : t("an_answer_to_today_s_weather_from_your_own_wardrobe")}
        </Text>
      </View>
      <View
        style={[
          s.between,
          {
            paddingVertical: 14,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: C.line,
          },
        ]}
      >
        <View style={s.row}>
          <Icon
            name={weather.morning.rain ? "cloud-rain" : "cloud"}
            size={29}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "500",
              letterSpacing: -1,
              color: C.ink,
            }}
          >
            {weather.morning.temp}°
            <Text style={{ fontSize: 17, color: C.muted }}>
              {" "}
              → {weather.evening.temp}°
            </Text>
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <View style={s.row}>
            <Icon name="wind" size={13} />
            <Text style={s.small}>
              {t("wind_speed", { speed: weather.morning.wind })}
            </Text>
          </View>
          <Text style={[s.eyebrow, { fontSize: 8, letterSpacing: 1 }]}>
            {t("demo_weather_data")}
          </Text>
        </View>
      </View>
      <View style={[s.wrap, { gap: 6 }]}>
        <Chip
          label={t("journey_departure", { time: preferences.departure })}
          icon="briefcase"
        />
        <Chip
          label={t("journey_return", { time: preferences.returnTime })}
          icon="home"
        />
        <Chip
          label={t("minutes_outdoors", { count: preferences.minutes })}
          icon="navigation"
        />
      </View>
      <View
        style={{
          backgroundColor: C.stone,
          borderRadius: 24,
          padding: 18,
          gap: 6,
        }}
      >
        <View style={s.between}>
          <Text style={[s.eyebrow, { color: C.green }]}>
            {t("01_wear_this_morning")}
          </Text>
          <Text style={s.small}>
            {t(
              plan.morning.items.length === 1 ? "item_count_one" : "item_count",
              { count: plan.morning.items.length },
            )}
          </Text>
        </View>
        <OutfitView items={plan.morning.items} />
        <Text style={[s.heading, { fontSize: 20 }]}>
          {plan.morning.items.length
            ? plan.morning.items.map((g) => garmentName(g)).join(" + ")
            : t("let_s_start_with_your_wardrobe")}
        </Text>
        <Text style={[s.small, { marginTop: 3 }]}>
          {text(plan.morning.reason)}
        </Text>
      </View>
      {plan.morning.missing.map((message) => (
        <Notice key={message}>{text(message)}</Notice>
      ))}
      {plan.morning.items.length === 0 ? (
        <Button icon="plus" onPress={() => router.push("/wardrobe")}>
          {t("add_my_items")}
        </Button>
      ) : null}
      <Card>
        <View style={s.between}>
          <Text style={s.eyebrow}>{t("02_bring_along")}</Text>
          <Icon name="shopping-bag" size={17} />
        </View>
        {premium ? (
          <>
            {plan.pack.length ? <OutfitView items={plan.pack} compact /> : null}
            <Text style={s.body}>
              {plan.umbrella
                ? t("bring_your_umbrella")
                : plan.pack.length
                  ? t(
                      "it_may_cool_down_on_your_way_home_bring_these_pieces_along",
                    )
                  : t("you_do_not_appear_to_need_an_extra_layer")}
            </Text>
            {removed.length ? (
              <Text style={s.small}>
                {t("return_remove", {
                  items: removed.map((g) => garmentName(g)).join(", "),
                })}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={s.body}>
              {t("find_out_which_layer_to_take_off_on_your_way_home")}
            </Text>
            <Text style={s.small}>
              {t("detailed_plans_for_your_schedule_are_in_premium")}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/premium")}
              style={s.row}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: C.green }}>
                {t("explore_your_personal_plan")}
              </Text>
              <Icon name="arrow-up-right" size={15} />
            </Pressable>
          </>
        )}
      </Card>
      <Button
        icon="arrow-right"
        onPress={() => router.push(premium ? "/plan" : "/premium")}
      >
        {premium ? t("my_plan_for_today") : t("open_my_journey_plan")}
      </Button>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/feedback")}
        style={[s.between, { paddingVertical: 10 }]}
      >
        <View style={{ gap: 5 }}>
          <Text style={[s.body, { fontWeight: "600" }]}>
            {t("how_did_you_feel_today")}
          </Text>
          <Text style={s.small}>{t("leave_a_quick_check_in")}</Text>
        </View>
        <Icon name="arrow-right" size={18} />
      </Pressable>
      <View style={{ gap: 10, paddingTop: 8 }}>
        <Text style={s.eyebrow}>{t("change_the_demo_scenario")}</Text>
        <View style={s.wrap}>
          {SCENARIOS.map((w) => (
            <Chip
              key={w.id}
              label={text(w.name)}
              selected={scenario === w.id}
              onPress={() => setScenario(w.id)}
            />
          ))}
        </View>
        <Text style={s.small}>
          {t(
            "the_sample_weather_is_the_same_in_every_city_live_forecasts_will_be_connect",
          )}
        </Text>
      </View>
    </Screen>
  );
}
