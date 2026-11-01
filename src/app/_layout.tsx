import { ReminderObserver } from "../reminders/ReminderObserver";
import { useLanguage } from "../i18n/useLanguage";
import { useEffect } from "react";
import { Slot } from "expo-router";
import {
  ActivityIndicator,
  AppState,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useStore } from "../store/useStore";
import { Onboarding } from "../screens/Onboarding";
import { C } from "../components/theme";
export default function RootLayout() {
  const languageReady = useLanguage((s) => s.hydrated);
  const locale = useLanguage((s) => s.locale);
  const hydrateLanguage = useLanguage((s) => s.hydrate);
  const refreshSystem = useLanguage((s) => s.refreshSystem);
  const hydrated = useStore((s) => s.hydrated);
  const onboarded = useStore((s) => s.onboarded);
  const hydrate = useStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
    void hydrateLanguage();
  }, [hydrate, hydrateLanguage]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshSystem();
    });
    return () => subscription.remove();
  }, [refreshSystem]);
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined")
      document.documentElement.lang = locale;
  }, [locale]);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {!hydrated || !languageReady ? (
        <View
          style={{
            flex: 1,
            backgroundColor: C.bg,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 27, letterSpacing: 0.5, color: C.ink }}>
            WearWeather
          </Text>
          <ActivityIndicator color={C.green} />
        </View>
      ) : !onboarded ? (
        <Onboarding />
      ) : (
        <>
          <Slot />
          <ReminderObserver />
        </>
      )}
    </SafeAreaProvider>
  );
}
