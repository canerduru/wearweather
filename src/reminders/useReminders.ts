import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reminderAdapter } from "./adapter";
import {
  DEFAULT_RECORD,
  OWN_PREFIX,
  REMINDER_STORAGE_KEY,
  ReminderError,
  decodeReminderRecord,
  saveReminders,
  sendReminderTest,
  type ReminderRecord,
  type ReminderSettings,
  type ReminderContent,
  type ReminderErrorCode,
  type Permission,
} from "./core";
type State = {
  record: ReminderRecord;
  hydrated: boolean;
  busy: boolean;
  permission: Permission;
  scheduledCount: number;
  error: ReminderErrorCode | null;
  success: "saved" | "test" | null;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  save: (
    settings: ReminderSettings,
    content: ReminderContent | null,
  ) => Promise<void>;
  test: (content: ReminderContent) => Promise<void>;
};
const repository = {
  async write(record: ReminderRecord) {
    await AsyncStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(record));
  },
};
async function readState() {
  const [raw, permission, ids] = await Promise.all([
    AsyncStorage.getItem(REMINDER_STORAGE_KEY),
    reminderAdapter.getPermission(),
    reminderAdapter.list(),
  ]);
  return {
    record: decodeReminderRecord(raw),
    permission,
    scheduledCount: ids.filter((id) => id.startsWith(OWN_PREFIX + "weekly."))
      .length,
  };
}
const errorCode = (error: unknown): ReminderErrorCode =>
  error instanceof ReminderError ? error.code : "schedule_failed";
export const useReminders = create<State>((set, get) => ({
  record: DEFAULT_RECORD,
  hydrated: false,
  busy: false,
  permission: reminderAdapter.supported ? "undetermined" : "unsupported",
  scheduledCount: 0,
  error: null,
  success: null,
  async hydrate() {
    if (get().hydrated || get().busy) return;
    set({ busy: true });
    try {
      set({ ...(await readState()), hydrated: true, error: null });
    } catch {
      set({ hydrated: true, error: "read_failed" });
    } finally {
      set({ busy: false });
    }
  },
  async refresh() {
    if (get().busy || !get().hydrated) return;
    set({ busy: true });
    try {
      set({ ...(await readState()) });
    } catch {
      set({ error: "read_failed" });
    } finally {
      set({ busy: false });
    }
  },
  async save(settings, content) {
    if (get().busy) return;
    set({ busy: true, error: null, success: null });
    try {
      const record = await saveReminders(
        reminderAdapter,
        repository,
        settings,
        content,
      );
      set({ record, success: "saved" });
    } catch (error) {
      set({ error: errorCode(error) });
    } finally {
      try {
        set({ ...(await readState()) });
      } catch {
        set({ error: get().error ?? "read_failed" });
      }
      set({ busy: false });
    }
  },
  async test(content) {
    if (get().busy) return;
    set({ busy: true, error: null, success: null });
    try {
      await sendReminderTest(reminderAdapter, content);
      set({ success: "test" });
    } catch (error) {
      set({ error: errorCode(error) });
    } finally {
      try {
        set({ permission: await reminderAdapter.getPermission() });
      } catch {
        set({ error: get().error ?? "read_failed" });
      }
      set({ busy: false });
    }
  },
}));
