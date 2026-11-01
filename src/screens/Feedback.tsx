import { useTranslation } from "../i18n/useTranslation";
import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Button, Card, Icon, type IconName } from "../components/ui";
import { GarmentArt } from "../components/GarmentArt";
import { useStore } from "../store/useStore";
import { calibrationFrom } from "../domain/engine";
import { localDate } from "../services/storage";
import type { Feedback as FeedbackType } from "../domain/types";
const OPTIONS: {
  value: FeedbackType["value"];
  label: string;
  icon: IconName;
}[] = [
  { value: "cold", label: "Üşüdüm", icon: "wind" },
  { value: "comfortable", label: "Rahattım", icon: "smile" },
  { value: "hot", label: "Terledim", icon: "sun" },
];
export function Feedback() {
  const { t, text, date } = useTranslation();

  const history = useStore((s) => s.feedback);
  const premium = useStore((s) => s.premiumDemo);
  const give = useStore((s) => s.giveFeedback);
  const today = localDate();
  const existing = history.find((f) => f.date === today);
  const [value, setValue] = useState<FeedbackType["value"] | null>(
    existing?.value ?? null,
  );
  const [saved, setSaved] = useState(false);
  const adjustment = calibrationFrom(history);
  return (
    <Screen>
      <Text style={s.eyebrow}>{t("evening_check_in")}</Text>
      <Text style={s.title}>{t("headline_feedback")}</Text>
      <Text style={s.body}>{t("record_how_your_day_felt_with_one_tap")}</Text>
      <View
        style={{
          backgroundColor: C.sage,
          borderTopLeftRadius: 140,
          borderTopRightRadius: 140,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          paddingTop: 32,
          paddingBottom: 13,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <GarmentArt
          category="longsleeve"
          color="#E5DFD2"
          width={95}
          height={150}
        />
        <GarmentArt category="knit" color="#67715B" width={95} height={150} />
        <GarmentArt category="jacket" color="#BF9E76" width={95} height={150} />
      </View>
      <View style={{ flexDirection: "row", gap: 9 }}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityLabel={text(o.label)}
            accessibilityState={{ checked: value === o.value }}
            onPress={() => {
              setValue(o.value);
              setSaved(false);
            }}
            style={{
              flex: 1,
              paddingVertical: 25,
              alignItems: "center",
              gap: 15,
              borderRadius: 17,
              borderWidth: 1,
              borderColor: value === o.value ? C.green : C.line,
              backgroundColor: value === o.value ? C.sage : C.bg,
            }}
          >
            <Icon
              name={o.icon}
              size={27}
              color={value === o.value ? C.green : C.muted}
            />
            <Text style={[s.body, { fontSize: 13 }]}>{text(o.label)}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        disabled={!value}
        icon={saved ? "check" : "arrow-right"}
        onPress={() => {
          if (value) {
            give(value);
            setSaved(true);
          }
        }}
      >
        {saved ? t("today_s_feedback_is_saved") : t("save_feedback")}
      </Button>
      <Text accessibilityLiveRegion="polite" style={s.small}>
        {existing
          ? t(
              "you_can_change_today_s_choice_the_same_daily_record_will_be_updated",
            )
          : t("one_record_is_kept_per_day_you_can_change_it_later")}
      </Text>
      <Card style={{ backgroundColor: C.sage }}>
        <View style={s.row}>
          <Icon name="sliders" size={19} />
          <Text style={[s.body, { fontWeight: "600" }]}>
            {premium
              ? t("a_little_more_personal")
              : t("your_feedback_stays_with_you")}
          </Text>
        </View>
        <Text style={s.small}>
          {premium
            ? adjustment > 0
              ? t("your_recent_feedback_suggests_you_prefer_warmer_layers")
              : adjustment < 0
                ? t("your_recent_feedback_suggests_you_prefer_lighter_layers")
                : t("we_are_keeping_your_recommendations_balanced")
            : t(
                "saving_feedback_is_free_try_premium_demo_to_use_these_records_to_tune_your_",
              )}
        </Text>
        {!premium ? (
          <Button secondary onPress={() => router.push("/premium")}>
            {t("explore_personal_settings")}
          </Button>
        ) : null}
      </Card>
      <Text style={s.eyebrow}>
        {t(history.length === 1 ? "recent_count_one" : "recent_count", {
          count: history.length,
        })}
      </Text>
      {history.length ? (
        history
          .slice(-5)
          .reverse()
          .map((f) => (
            <View key={f.date} style={s.between}>
              <Text style={s.small}>{date(f.date)}</Text>
              <Text style={s.body}>
                {text(OPTIONS.find((o) => o.value === f.value)?.label ?? "")}
              </Text>
            </View>
          ))
      ) : (
        <Text style={s.small}>{t("your_first_check_in_will_appear_here")}</Text>
      )}
    </Screen>
  );
}
