import { ReminderError, type ReminderAdapter } from "./core";
// Web and non-native previews deliberately do not simulate successful delivery.
export const reminderAdapter: ReminderAdapter = {
  supported: false,
  async getPermission() {
    return "unsupported";
  },
  async requestPermission() {
    return "unsupported";
  },
  async list() {
    return [];
  },
  async cancel() {},
  async scheduleWeekly() {
    throw new ReminderError("unsupported");
  },
  async scheduleTest() {
    throw new ReminderError("unsupported");
  },
};
export function subscribeToReminderOpen(_listener: () => void): () => void {
  return () => {};
}
