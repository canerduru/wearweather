import { buildPlan } from "../domain/engine";
import type { DemoWeather, Garment, Preferences } from "../domain/types";
import {
  garmentName,
  translate,
  translateText,
  type Locale,
} from "../i18n/core";
export const OWN_PREFIX = "wearweather.morning.";
export const REMINDER_STORAGE_KEY = "wearweather.reminders.v1";
export type ReminderSettings = {
  enabled: boolean;
  time: string;
  weekdays: number[];
};
export type ReminderContent = { title: string; body: string };
export type ReminderRecord = {
  version: 1;
  settings: ReminderSettings;
  content: ReminderContent | null;
};
export type Permission = "granted" | "denied" | "undetermined" | "unsupported";
export type ReminderErrorCode =
  | "unsupported"
  | "invalid"
  | "permission_denied"
  | "empty"
  | "schedule_failed"
  | "cancel_failed"
  | "storage_failed"
  | "read_failed";
export class ReminderError extends Error {
  constructor(public readonly code: ReminderErrorCode) {
    super(code);
  }
}
export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  time: "07:30",
  weekdays: [2, 3, 4, 5, 6],
};
export const DEFAULT_RECORD: ReminderRecord = {
  version: 1,
  settings: DEFAULT_REMINDERS,
  content: null,
};
export interface ReminderAdapter {
  supported: boolean;
  getPermission: () => Promise<Permission>;
  requestPermission: () => Promise<Permission>;
  list: () => Promise<string[]>;
  cancel: (id: string) => Promise<void>;
  scheduleWeekly: (
    weekday: number,
    hour: number,
    minute: number,
    content: ReminderContent,
  ) => Promise<string>;
  scheduleTest: (content: ReminderContent) => Promise<string>;
}
export interface ReminderRepository {
  write: (record: ReminderRecord) => Promise<void>;
}
export function validateReminderSettings(
  value: unknown,
): value is ReminderSettings {
  if (!value || typeof value !== "object") return false;
  const s = value as ReminderSettings;
  return (
    typeof s.enabled === "boolean" &&
    typeof s.time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(s.time) &&
    Array.isArray(s.weekdays) &&
    s.weekdays.every((d) => Number.isInteger(d) && d >= 1 && d <= 7) &&
    new Set(s.weekdays).size === s.weekdays.length &&
    (!s.enabled || s.weekdays.length > 0)
  );
}
export function decodeReminderRecord(raw: string | null): ReminderRecord {
  if (!raw)
    return {
      ...DEFAULT_RECORD,
      settings: {
        ...DEFAULT_REMINDERS,
        weekdays: [...DEFAULT_REMINDERS.weekdays],
      },
    };
  try {
    const v = JSON.parse(raw);
    if (
      v?.version !== 1 ||
      !validateReminderSettings(v.settings) ||
      !(
        v.content === null ||
        (typeof v.content?.title === "string" &&
          typeof v.content?.body === "string")
      ) ||
      (v.settings.enabled && !v.content)
    )
      throw Error();
    return { version: 1, settings: v.settings, content: v.content };
  } catch {
    throw new ReminderError("read_failed");
  }
}
export function makeMorningContent(
  wardrobe: Garment[],
  preferences: Preferences,
  weather: DemoWeather,
  locale: Locale,
): ReminderContent {
  const plan = buildPlan(
    wardrobe,
    { ...preferences, sensitivity: "neutral", minutes: 25 },
    weather,
    0,
  );
  if (!plan.morning.items.length) throw new ReminderError("empty");
  const reason = plan.morning.missing
    .map((s) => translateText(locale, s))
    .join(" ");
  return {
    title: translate(locale, "notify_message_title"),
    body:
      translate(locale, "notify_message_body", {
        city: translateText(locale, preferences.city),
        temp: weather.morning.temp,
        items: plan.morning.items
          .map((g) => garmentName(g, locale))
          .join(" + "),
        rain: translate(
          locale,
          plan.umbrella ? "notify_message_rain" : "notify_message_dry",
        ),
      }) + (reason ? " " + reason : ""),
  };
}
export function isMorningNotification(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).kind === "wearweather-morning-demo" &&
    (data as Record<string, unknown>).url === "/"
  );
}
export async function cancelOwned(adapter: ReminderAdapter): Promise<void> {
  const ids = (await adapter.list()).filter((id) => id.startsWith(OWN_PREFIX));
  const results = await Promise.allSettled(ids.map((id) => adapter.cancel(id)));
  if (results.some((r) => r.status === "rejected"))
    throw new ReminderError("cancel_failed");
}
export async function saveReminders(
  adapter: ReminderAdapter,
  repository: ReminderRepository,
  settings: ReminderSettings,
  content: ReminderContent | null,
): Promise<ReminderRecord> {
  if (!validateReminderSettings(settings)) throw new ReminderError("invalid");
  if (settings.enabled) {
    if (!adapter.supported) throw new ReminderError("unsupported");
    if (!content) throw new ReminderError("empty");
    if ((await adapter.requestPermission()) !== "granted")
      throw new ReminderError("permission_denied");
  }
  const disabled: ReminderRecord = {
    version: 1,
    settings: { ...settings, enabled: false },
    content: null,
  };
  if (!settings.enabled) {
    await cancelOwned(adapter);
    try {
      await repository.write(disabled);
    } catch {
      throw new ReminderError("storage_failed");
    }
    return disabled;
  }
  try {
    await repository.write(disabled);
  } catch {
    throw new ReminderError("storage_failed");
  }
  try {
    await cancelOwned(adapter);
    if (!settings.enabled) return disabled;
    const [hour, minute] = settings.time.split(":").map(Number);
    for (const day of settings.weekdays)
      await adapter.scheduleWeekly(day, hour, minute, content!);
    const record: ReminderRecord = {
      version: 1,
      settings: { ...settings, weekdays: [...settings.weekdays] },
      content,
    };
    try {
      await repository.write(record);
    } catch {
      throw new ReminderError("storage_failed");
    }
    return record;
  } catch (error) {
    try {
      await cancelOwned(adapter);
    } catch {
      throw new ReminderError("cancel_failed");
    }
    throw error instanceof ReminderError
      ? error
      : new ReminderError("schedule_failed");
  }
}
export async function sendReminderTest(
  adapter: ReminderAdapter,
  content: ReminderContent,
): Promise<void> {
  if (!adapter.supported) throw new ReminderError("unsupported");
  if ((await adapter.requestPermission()) !== "granted")
    throw new ReminderError("permission_denied");
  try {
    await adapter.scheduleTest(content);
  } catch {
    throw new ReminderError("schedule_failed");
  }
}
