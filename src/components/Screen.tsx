import { useTranslation } from "../i18n/useTranslation";
import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { C, s } from "./theme";
import { Icon, type IconName, Notice } from "./ui";
import { useStore } from "../store/useStore";
export function Screen({
  children,
  title,
  back = false,
}: {
  children: ReactNode;
  title?: string;
  back?: boolean;
}) {
  const { t, text } = useTranslation();

  const path = usePathname();
  const { width } = useWindowDimensions();
  const warning = useStore((x) => x.storageWarning);
  const premium = useStore((x) => x.premiumDemo);
  const tabs: {
    path: "/" | "/wardrobe" | "/feedback" | "/profile";
    label: string;
    icon: IconName;
  }[] = [
    { path: "/", label: t("today"), icon: "sun" },
    { path: "/wardrobe", label: t("wardrobe"), icon: "layers" },
    { path: "/feedback", label: t("check_in"), icon: "smile" },
    { path: "/profile", label: t("profile"), icon: "user" },
  ];
  return (
    <View style={styles.outer}>
      {width > 800 ? (
        <View style={styles.side}>
          <View style={styles.brandLine} />
          <Text style={styles.wordmark}>WearWeather</Text>
          <Text style={styles.tagline}>{t("headline_brand")}</Text>
          <Text
            style={[s.body, { maxWidth: 250, color: C.muted, marginTop: 22 }]}
          >
            {t("a_layering_plan_for_your_day_made_from_the_pieces_you_own")}
          </Text>
          <View style={[s.line, { width: 55, marginVertical: 30 }]} />
          <Text style={s.eyebrow}>{t("think_less_feel_more_comfortable")}</Text>
          <Text style={[s.small, { marginTop: 60 }]}>
            {t("local_prototype_02")}
            {"\n"}
            {t("weather_and_premium_connections_are_demos")}
          </Text>
        </View>
      ) : null}
      <SafeAreaView style={[styles.phone, width > 800 && styles.desktopPhone]}>
        <View style={styles.header}>
          {back ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("back_to_today")}
              onPress={() => router.replace("/")}
              style={styles.back}
            >
              <Icon name="arrow-left" />
              <Text style={s.body}>{title ?? t("your_day_s_plan")}</Text>
            </Pressable>
          ) : (
            <>
              <Text style={styles.logo}>
                WearWeather
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/premium")}
                style={styles.premium}
              >
                <Text style={styles.premiumText}>
                  {premium ? t("premium_demo") : "PREMIUM"}
                </Text>
                <Icon name="arrow-up-right" size={13} color={C.green} />
              </Pressable>
            </>
          )}
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          {warning ? <Notice>{text(warning)}</Notice> : null}
          {children}
          <Text
            style={[
              s.small,
              { fontSize: 10, textAlign: "center", marginTop: 8 },
            ]}
          >
            {t("footer_demo")}
          </Text>
        </ScrollView>
        <View style={styles.nav}>
          {tabs.map((t) => {
            const active = path === t.path;
            return (
              <Pressable
                key={t.path}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => router.replace(t.path)}
                style={styles.navItem}
              >
                <Icon
                  name={t.icon}
                  size={20}
                  color={active ? C.green : "#969B93"}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: active ? C.green : C.muted,
                    fontWeight: active ? "700" : "400",
                  }}
                >
                  {t.label}
                </Text>
                {active ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#EEEEE6",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  phone: { flex: 1, maxWidth: 480, backgroundColor: C.bg, height: "100%" },
  desktopPhone: {
    height: "94%",
    maxHeight: 1000,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D4D7CA",
    boxShadow: "0px 20px 70px rgba(35,52,45,0.08)",
  },
  side: { width: 390, paddingRight: 66 },
  brandLine: {
    width: 34,
    height: 5,
    backgroundColor: C.green,
    marginBottom: 23,
  },
  wordmark: { fontSize: 15, letterSpacing: 0.5, fontWeight: "600", color: C.ink },
  tagline: {
    fontSize: 53,
    lineHeight: 60,
    letterSpacing: -2,
    color: C.ink,
    marginTop: 35,
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "web" ? 22 : 10,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { fontSize: 23, letterSpacing: 0.5, fontWeight: "600", color: C.ink },
  premium: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: C.sage,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  premiumText: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "700",
    color: C.green,
  },
  nav: {
    flexDirection: "row",
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderColor: C.line,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: "center", gap: 6, minHeight: 47 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: C.green },
  back: { flexDirection: "row", gap: 13, alignItems: "center", minHeight: 30 },
});
