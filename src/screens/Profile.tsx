import { MorningReminderCard } from "../reminders/MorningReminderCard";
import { LanguagePicker } from "../components/LanguagePicker";
import { useTranslation } from "../i18n/useTranslation";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Button, Card, Chip, Icon } from "../components/ui";
import { CITIES } from "../domain/catalog";
import { useStore } from "../store/useStore";
import { PreferencesForm } from "./PreferencesForm";
export function Profile() {
  const { t, text } = useTranslation();

  const prefs = useStore((s) => s.preferences);
  const set = useStore((s) => s.setPreferences);
  const premium = useStore((s) => s.premiumDemo);
  const setPremium = useStore((s) => s.setPremiumDemo);
  return (
    <Screen>
      <Text style={s.eyebrow}>{t("your_day_your_settings")}</Text>
      <Text style={s.title}>{t("made_for_you")}</Text>
      <Text style={s.body}>
        {t(
          "preferences_save_automatically_personal_sensitivity_and_duration_settings_a",
        )}
      </Text>
      <LanguagePicker />
      <Text style={s.eyebrow}>{t("city")}</Text>
      <View style={s.wrap}>
        {CITIES.map((city) => (
          <Chip
            key={city}
            label={text(city)}
            selected={prefs.city === city}
            onPress={() => set({ city })}
          />
        ))}
      </View>
      <View style={s.line} />
      <PreferencesForm />
      <MorningReminderCard />
      <Card style={{ backgroundColor: C.sage }}>
        <View style={s.row}>
          <Icon name="shield" size={20} />
          <Text style={[s.body, { fontWeight: "600" }]}>
            {t("only_on_this_device")}
          </Text>
        </View>
        <Text style={s.small}>
          {t(
            "your_wardrobe_and_records_are_not_sent_to_a_server_clearing_browser_or_app_",
          )}
        </Text>
      </Card>
      <Card>
        <Text style={s.eyebrow}>
          {premium ? t("premium_demo_active") : t("free_plan")}
        </Text>
        <Text style={s.heading}>
          {premium
            ? t("you_are_trying_your_personal_plan")
            : t("make_it_more_personal")}
        </Text>
        <Text style={s.small}>{t("no_real_subscription_or_charge")}</Text>
        <Button onPress={() => router.push("/premium")}>
          {premium ? t("view_premium") : t("discover_premium")}
        </Button>
        {premium ? (
          <Button secondary onPress={() => setPremium(false)}>
            {t("turn_off_premium_demo")}
          </Button>
        ) : null}
      </Card>
      <Text style={[s.small, { textAlign: "center" }]}>
        {t("brand_prototype")}
      </Text>
    </Screen>
  );
}
