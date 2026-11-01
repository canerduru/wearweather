import { LanguagePicker } from "../components/LanguagePicker";
import { useTranslation } from "../i18n/useTranslation";
import { useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATALOG, CITIES, garmentFor } from "../domain/catalog";
import type { Category } from "../domain/types";
import { useStore } from "../store/useStore";
import { C, s } from "../components/theme";
import { Button, Chip, Icon } from "../components/ui";
import { GarmentArt } from "../components/GarmentArt";
import { PreferencesForm } from "./PreferencesForm";
export function Onboarding() {
  const { t, text } = useTranslation();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Category[]>([]);
  const prefs = useStore((x) => x.preferences);
  const setPrefs = useStore((x) => x.setPreferences);
  const setWardrobe = useStore((x) => x.setWardrobe);
  const complete = useStore((x) => x.completeOnboarding);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EEEEE6", alignItems: "center" }}
    >
      <ScrollView
        style={{ width: "100%", maxWidth: 480, backgroundColor: C.bg }}
        contentContainerStyle={{
          padding: 26,
          paddingTop: 38,
          gap: 24,
          paddingBottom: 50,
        }}
      >
        <View style={s.between}>
          <Text
            style={{
              fontSize: 24,
              letterSpacing: 0.5,
              fontWeight: "600",
              color: C.ink,
            }}
          >
            WearWeather
          </Text>
          <Text style={s.small}>{step + 1} / 3</Text>
        </View>
        <View style={s.row}>
          {[0, 1, 2].map((n) => (
            <View
              key={n}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: n <= step ? C.green : C.line,
              }}
            />
          ))}
        </View>
        <LanguagePicker />
        {step === 0 ? (
          <>
            <Text style={[s.eyebrow, { marginTop: 20 }]}>
              {t("start_a_more_comfortable_day")}
            </Text>
            <Text style={[s.title, { fontSize: 44, lineHeight: 49 }]}>
              {t("headline_brand")}
            </Text>
            <View
              style={{
                backgroundColor: C.stone,
                borderRadius: 160,
                flexDirection: "row",
                justifyContent: "center",
                paddingVertical: 30,
              }}
            >
              <GarmentArt
                category="longsleeve"
                color="#E5DFD2"
                width={105}
                height={175}
              />
              <View style={{ marginLeft: -27 }}>
                <GarmentArt
                  category="knit"
                  color="#67715B"
                  width={110}
                  height={175}
                />
              </View>
              <View style={{ marginLeft: -27 }}>
                <GarmentArt
                  category="jacket"
                  color="#BF9E76"
                  width={110}
                  height={175}
                />
              </View>
            </View>
            <Text style={s.body}>
              {t(
                "let_s_plan_what_to_wear_and_what_to_bring_using_the_pieces_you_own",
              )}
            </Text>
            <View style={s.row}>
              <Icon name="camera-off" size={16} />
              <Text style={s.small}>
                {t("no_photos_no_account_no_lengthy_setup")}
              </Text>
            </View>
            <Text style={s.eyebrow}>{t("which_city_are_you_in")}</Text>
            <View style={s.wrap}>
              {CITIES.map((city) => (
                <Chip
                  key={city}
                  label={text(city)}
                  selected={prefs.city === city}
                  onPress={() => setPrefs({ city })}
                />
              ))}
            </View>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Text style={s.eyebrow}>{t("your_wardrobe_your_plan")}</Text>
            <Text style={s.title}>{t("what_do_you_own")}</Text>
            <Text style={s.body}>
              {t(
                "choose_the_basics_you_own_you_can_edit_names_and_colors_later",
              )}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {CATALOG.map((c) => {
                const on = selected.includes(c.category);
                return (
                  <Pressable
                    key={c.category}
                    accessibilityRole="checkbox"
                    accessibilityLabel={text(c.label)}
                    accessibilityState={{ checked: on }}
                    onPress={() =>
                      setSelected((old) =>
                        on
                          ? old.filter((v) => v !== c.category)
                          : [...old, c.category],
                      )
                    }
                    style={[
                      styles.tile,
                      {
                        borderColor: on ? C.green : C.line,
                        backgroundColor: on ? C.sage : C.paper,
                      },
                    ]}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 11,
                        right: 11,
                        zIndex: 1,
                      }}
                    >
                      <Icon
                        name={on ? "check-circle" : "plus-circle"}
                        size={17}
                        color={on ? C.green : "#A7AA9F"}
                      />
                    </View>
                    <GarmentArt
                      category={c.category}
                      color={c.color}
                      width={110}
                      height={125}
                    />
                    <Text
                      style={[s.small, { color: C.ink, fontWeight: "600" }]}
                    >
                      {text(c.label)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={s.small}>
              {t(
                selected.length === 1 ? "selected_count_one" : "selected_count",
                { count: selected.length },
              )}
            </Text>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Text style={s.eyebrow}>
              {t("the_same_weather_feels_different_to_everyone")}
            </Text>
            <Text style={s.title}>{t("let_s_get_to_know_your_day")}</Text>
            <Text style={s.body}>
              {t(
                "these_preferences_are_a_starting_point_you_can_change_them_anytime",
              )}
            </Text>
            <PreferencesForm />
            <View
              style={{
                backgroundColor: C.sage,
                padding: 16,
                borderRadius: 16,
                gap: 6,
              }}
            >
              <Text style={[s.body, { fontWeight: "600" }]}>
                {t("your_data_stays_on_your_device")}
              </Text>
              <Text style={s.small}>
                {t(
                  "this_version_uses_sample_weather_personal_data_is_not_sent_and_no_payment_i",
                )}
              </Text>
            </View>
          </>
        ) : null}
        <Button
          icon="arrow-right"
          onPress={() => {
            if (step < 2) setStep(step + 1);
            else {
              setWardrobe(selected.map(garmentFor));
              complete();
            }
          }}
        >
          {step === 2
            ? t("show_my_daily_recommendation")
            : step === 0
              ? t("choose_your_wardrobe")
              : t("continue")}
        </Button>
        {step > 0 ? (
          <Button secondary onPress={() => setStep(step - 1)}>
            {t("back")}
          </Button>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  tile: {
    width: "48%",
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    padding: 12,
    gap: 4,
  },
});
