import { Text, View } from "react-native";
import { Chip, Notice } from "./ui";
import { s } from "./theme";
import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
export function LanguagePicker() {
  const { t, locale } = useTranslation();
  const choice = useLanguage((s) => s.choice);
  const set = useLanguage((s) => s.setChoice);
  const error = useLanguage((s) => s.saveError);
  return (
    <View style={{ gap: 11 }}>
      <Text style={s.eyebrow}>{t("language_title")}</Text>
      <View style={s.wrap}>
        <Chip
          label={t("language_system")}
          selected={choice === "system"}
          onPress={() => set("system")}
        />
        <Chip
          label="Türkçe"
          selected={choice === "tr"}
          onPress={() => set("tr")}
        />
        <Chip
          label="English"
          selected={choice === "en"}
          onPress={() => set("en")}
        />
      </View>
      <Text style={s.small}>
        {t("language_current", {
          language: locale === "tr" ? "Türkçe" : "English",
        })}
      </Text>
      <Text style={s.small}>{t("language_help")}</Text>
      {error ? <Notice>{t("language_save_error")}</Notice> : null}
    </View>
  );
}
