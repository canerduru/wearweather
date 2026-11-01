import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";
import { subscribeToReminderOpen } from "./adapter";
export function ReminderObserver() {
  const navigation = useRootNavigationState();
  useEffect(() => {
    if (!navigation?.key) return;
    return subscribeToReminderOpen(() => router.replace("/"));
  }, [navigation?.key]);
  return null;
}
