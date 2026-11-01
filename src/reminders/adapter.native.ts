import { IosAuthorizationStatus, AndroidImportance } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  OWN_PREFIX,
  isMorningNotification,
  type Permission,
  type ReminderAdapter,
  type ReminderContent,
} from "./core";
const CHANNEL = "wearweather-morning-demo";
let sequence = 0;
const identifier = (kind: string) =>
  `${OWN_PREFIX}${kind}.${Date.now().toString(36)}.${++sequence}`;
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
function permissionValue(
  value: Notifications.NotificationPermissionsStatus,
): Permission {
  if (Platform.OS === "ios" && value.ios) {
    const status = value.ios.status;
    if (
      [
        IosAuthorizationStatus.AUTHORIZED,
        IosAuthorizationStatus.PROVISIONAL,
        IosAuthorizationStatus.EPHEMERAL,
      ].includes(status)
    )
      return "granted";
    return status === IosAuthorizationStatus.DENIED ? "denied" : "undetermined";
  }
  return value.granted
    ? "granted"
    : value.status === "denied"
      ? "denied"
      : "undetermined";
}
async function requestPermission(): Promise<Permission> {
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: "WearWeather",
      importance: AndroidImportance.DEFAULT,
      sound: null,
    });
  const existing = await Notifications.getPermissionsAsync();
  if (permissionValue(existing) === "granted") return "granted";
  if (!existing.canAskAgain) return "denied";
  return permissionValue(
    await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: false },
    }),
  );
}
const notificationContent = (content: ReminderContent) => ({
  ...content,
  sound: false as const,
  data: { kind: "wearweather-morning-demo", url: "/" },
});
export const reminderAdapter: ReminderAdapter = {
  supported: true,
  async getPermission() {
    return permissionValue(await Notifications.getPermissionsAsync());
  },
  requestPermission,
  async list() {
    return (await Notifications.getAllScheduledNotificationsAsync()).map(
      (r) => r.identifier,
    );
  },
  async cancel(id) {
    await Notifications.cancelScheduledNotificationAsync(id);
  },
  async scheduleWeekly(weekday, hour, minute, content) {
    return Notifications.scheduleNotificationAsync({
      identifier: identifier(`weekly.${weekday}`),
      content: notificationContent(content),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
        channelId: CHANNEL,
        delivery: "bestEffort",
      },
    });
  },
  async scheduleTest(content) {
    return Notifications.scheduleNotificationAsync({
      identifier: identifier("test"),
      content: notificationContent(content),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
        channelId: CHANNEL,
      },
    });
  },
};
export function subscribeToReminderOpen(listener: () => void): () => void {
  const handle = (response: Notifications.NotificationResponse) => {
    if (isMorningNotification(response.notification.request.content.data)) {
      listener();
      Notifications.clearLastNotificationResponse();
    }
  };
  const subscription =
    Notifications.addNotificationResponseReceivedListener(handle);
  const last = Notifications.getLastNotificationResponse();
  if (last) handle(last);
  return () => subscription.remove();
}
