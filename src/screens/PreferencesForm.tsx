import { useTranslation } from "../i18n/useTranslation";
import { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { useStore } from "../store/useStore";
import { C, s } from "../components/theme";
import { Chip } from "../components/ui";
function TimeField({
  label,
  value,
  onValid,
}: {
  label: string;
  value: string;
  onValid: (v: string) => void;
}) {
  const { t } = useTranslation();

  const [draft, setDraft] = useState(value);
  const valid = /^([01]\d|2[0-3]):[0-5]\d$/.test(draft);
  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Text style={s.small}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={draft}
        onChangeText={(v) => {
          setDraft(v);
          if (/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) onValid(v);
        }}
        onBlur={() => {
          if (!valid) setDraft(value);
        }}
        placeholder="08:15"
        maxLength={5}
        style={[s.input, !valid && { borderColor: C.warning }]}
        selectTextOnFocus
      />
      {!valid ? (
        <Text style={[s.small, { color: C.warning }]}>
          {t("use_the_hh_mm_format")}
        </Text>
      ) : null}
    </View>
  );
}
export function PreferencesForm() {
  const { t } = useTranslation();

  const prefs = useStore((x) => x.preferences);
  const set = useStore((x) => x.setPreferences);
  return (
    <View style={{ gap: 20 }}>
      <Text style={s.eyebrow}>{t("how_do_you_feel_the_temperature")}</Text>
      <View style={s.wrap}>
        {(
          [
            { key: "cold", label: t("i_get_cold_easily") },
            { key: "neutral", label: t("average") },
            { key: "warm", label: t("i_get_warm_easily") },
          ] as const
        ).map((x) => (
          <Chip
            key={x.key}
            label={x.label}
            selected={prefs.sensitivity === x.key}
            onPress={() => set({ sensitivity: x.key })}
          />
        ))}
      </View>
      <View style={s.row}>
        <TimeField
          label={t("departure_time")}
          value={prefs.departure}
          onValid={(departure) => set({ departure })}
        />
        <TimeField
          label={t("return_time")}
          value={prefs.returnTime}
          onValid={(returnTime) => set({ returnTime })}
        />
      </View>
      <Text style={s.eyebrow}>{t("time_outdoors_per_journey")}</Text>
      <View style={s.wrap}>
        {[10, 25, 45, 60].map((minutes) => (
          <Chip
            key={minutes}
            label={t("minutes_label", { count: minutes })}
            selected={prefs.minutes === minutes}
            onPress={() => set({ minutes })}
          />
        ))}
      </View>
    </View>
  );
}
