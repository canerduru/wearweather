import { useEffect, useState } from "react";
import {
  AppState,
  Linking,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Card, Button, Chip, Icon, Notice } from "../components/ui";
import { C, s } from "../components/theme";
import { useTranslation } from "../i18n/useTranslation";
import type { TranslationKey } from "../i18n/core";
import { useStore } from "../store/useStore";
import { scenarioFor } from "../domain/catalog";
import { reminderAdapter } from "./adapter";
import {
  makeMorningContent,
  validateReminderSettings,
  type ReminderContent,
  type ReminderErrorCode,
} from "./core";
import { useReminders } from "./useReminders";
const DAYS = [2, 3, 4, 5, 6, 7, 1];
const ERRORS: Record<ReminderErrorCode, TranslationKey> = {
  unsupported: "notify_web_note",
  invalid: "notify_invalid",
  permission_denied: "notify_permission_denied",
  empty: "notify_empty",
  schedule_failed: "notify_schedule_failed",
  cancel_failed: "notify_cancel_failed",
  storage_failed: "notify_storage_failed",
  read_failed: "notify_read_failed",
};
export function MorningReminderCard() {
  const { t } = useTranslation();
  const hydrated = useReminders((s) => s.hydrated);
  const hydrate = useReminders((s) => s.hydrate);
  const refresh = useReminders((s) => s.refresh);
  useEffect(() => {
    void hydrate();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => sub.remove();
  }, [hydrate, refresh]);
  if (!hydrated)
    return (
      <Card>
        <Text style={s.small}>{t("notify_loading")}</Text>
      </Card>
    );
  return <ReminderForm />;
}
function ReminderForm() {
  const { t, locale } = useTranslation();
  const record = useReminders((s) => s.record);
  const permission = useReminders((s) => s.permission);
  const scheduledCount = useReminders((s) => s.scheduledCount);
  const busy = useReminders((s) => s.busy);
  const error = useReminders((s) => s.error);
  const success = useReminders((s) => s.success);
  const save = useReminders((s) => s.save);
  const test = useReminders((s) => s.test);
  const [draft, setDraft] = useState(() => ({
    ...record.settings,
    weekdays: [...record.settings.weekdays],
  }));
  const [settingsError, setSettingsError] = useState(false);
  const wardrobe = useStore((s) => s.wardrobe);
  const preferences = useStore((s) => s.preferences);
  const scenario = useStore((s) => s.scenario);
  let preview: ReminderContent | null = null;
  try {
    preview = makeMorningContent(
      wardrobe,
      preferences,
      scenarioFor(scenario),
      locale,
    );
  } catch {}
  const valid = validateReminderSettings(draft);
  const dirty = JSON.stringify(draft) !== JSON.stringify(record.settings);
  const stale =
    record.settings.enabled &&
    JSON.stringify(preview) !== JSON.stringify(record.content);
  const active =
    record.settings.enabled &&
    permission === "granted" &&
    scheduledCount === record.settings.weekdays.length;
  const dayNames = record.settings.weekdays
    .map((d) => t(`notify_short_${d}` as TranslationKey))
    .join(", ");
  function changeDay(day: number) {
    setDraft((old) => ({
      ...old,
      weekdays: old.weekdays.includes(day)
        ? old.weekdays.filter((d) => d !== day)
        : [...old.weekdays, day].sort((a, b) => a - b),
    }));
  }
  async function disable() {
    const off = { ...record.settings, enabled: false };
    setDraft(off);
    await save(off, null);
  }
  return (
    <Card style={{ gap: 17 }}>
      <View style={s.row}>
        <Icon name="bell" size={20} />
        <Text style={[s.eyebrow, { color: C.green }]}>
          {t("notify_heading")}
        </Text>
      </View>
      <Text style={s.heading}>{t("notify_title")}</Text>
      <Text style={s.small}>{t("notify_intro")}</Text>
      <View style={s.between}>
        <Text style={[s.body, { flex: 1 }]}>{t("notify_enabled_label")}</Text>
        <Switch
          accessibilityLabel={t("notify_enabled_label")}
          value={draft.enabled}
          disabled={busy}
          onValueChange={(enabled) => setDraft((old) => ({ ...old, enabled }))}
          trackColor={{ false: C.line, true: C.green }}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={s.small}>{t("notify_time")}</Text>
        <TextInput
          accessibilityLabel={t("notify_time")}
          value={draft.time}
          onChangeText={(time) => setDraft((old) => ({ ...old, time }))}
          maxLength={5}
          placeholder="07:30"
          editable={!busy}
          selectTextOnFocus
          style={[s.input, !valid && { borderColor: C.warning }]}
        />
      </View>
      <Text style={s.eyebrow}>{t("notify_days")}</Text>
      <View style={s.wrap}>
        {DAYS.map((day) => (
          <Chip
            key={day}
            label={t(`notify_short_${day}` as TranslationKey)}
            selected={draft.weekdays.includes(day)}
            onPress={busy ? undefined : () => changeDay(day)}
          />
        ))}
      </View>
      {!valid ? <Notice>{t("notify_invalid")}</Notice> : null}
      <Text style={s.small}>{t("notify_unsaved")}</Text>
      <Notice>{t("notify_snapshot_note")}</Notice>
      {!reminderAdapter.supported ? (
        <Notice>{t("notify_web_note")}</Notice>
      ) : null}
      <View
        style={{
          backgroundColor: C.stone,
          borderRadius: 15,
          padding: 15,
          gap: 9,
        }}
      >
        <Text style={s.eyebrow}>{t("notify_preview")}</Text>
        {preview ? (
          <>
            <Text style={[s.body, { fontWeight: "600" }]}>{preview.title}</Text>
            <Text style={s.small}>{preview.body}</Text>
          </>
        ) : (
          <Text style={s.small}>{t("notify_empty")}</Text>
        )}
      </View>
      <Text style={s.small}>{t("notify_best_effort")}</Text>
      {active ? (
        <Text style={[s.small, { color: C.green }]}>
          {t("notify_status_active", {
            time: record.settings.time,
            days: dayNames,
          })}
        </Text>
      ) : (
        <Text style={s.small}>
          {t(
            record.settings.enabled
              ? "notify_status_inactive"
              : "notify_status_off",
          )}
        </Text>
      )}
      {!record.settings.enabled && scheduledCount > 0 ? (
        <Notice>{t("notify_remaining")}</Notice>
      ) : null}
      {stale ? <Notice>{t("notify_stale")}</Notice> : null}
      {error ? <Notice>{t(ERRORS[error])}</Notice> : null}
      {permission === "denied" && error !== "permission_denied" ? (
        <Notice>{t("notify_permission_denied")}</Notice>
      ) : null}
      {success && (success === "test" || !dirty) ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[s.small, { color: C.green }]}
        >
          {t(success === "saved" ? "notify_saved" : "notify_test_sent")}
        </Text>
      ) : null}
      <Button
        disabled={
          busy ||
          !valid ||
          !reminderAdapter.supported ||
          (draft.enabled && !preview)
        }
        icon="check"
        onPress={() => {
          void save(draft, preview);
        }}
      >
        {t(busy ? "notify_saving" : "notify_save")}
      </Button>
      <Button
        secondary
        disabled={busy || !reminderAdapter.supported || !preview}
        onPress={() => {
          if (preview) void test(preview);
        }}
      >
        {t("notify_test")}
      </Button>
      {reminderAdapter.supported ? (
        <Button
          secondary
          disabled={busy}
          onPress={() => {
            void disable();
          }}
        >
          {t("notify_disable")}
        </Button>
      ) : null}
      {permission === "denied" ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSettingsError(false);
            void Linking.openSettings().catch(() => setSettingsError(true));
          }}
          style={{ paddingVertical: 12 }}
        >
          <Text style={[s.small, { color: C.green }]}>
            {t("notify_settings")}
          </Text>
        </Pressable>
      ) : null}
      {settingsError ? <Notice>{t("notify_error_settings")}</Notice> : null}
      <Text style={s.small}>{t("notify_permission_prompt")}</Text>
    </Card>
  );
}
