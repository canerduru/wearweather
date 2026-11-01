import { useTranslation } from "../i18n/useTranslation";
import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Button, Card, Icon, Notice } from "../components/ui";
import { useStore } from "../store/useStore";
import { demoBilling, PLANS, type BillingPlan } from "../services/billing";
export function Premium() {
  const { t, text, price } = useTranslation();

  const [selected, setSelected] = useState<BillingPlan>("annual");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const active = useStore((s) => s.premiumDemo);
  const set = useStore((s) => s.setPremiumDemo);
  async function activate() {
    setBusy(true);
    await demoBilling.activate(selected);
    set(true);
    setBusy(false);
    router.replace("/plan");
  }
  return (
    <Screen back title="WearWeather Premium">
      <Text style={[s.eyebrow, { color: C.green }]}>
        {t("more_personal_more_prepared")}
      </Text>
      <Text style={s.title}>{t("headline_premium")}</Text>
      <Text style={s.body}>
        {t(
          "a_personal_plan_that_brings_together_your_wardrobe_your_day_and_how_you_fee",
        )}
      </Text>
      <Card style={{ backgroundColor: C.sage, borderWidth: 0 }}>
        {[
          {
            icon: "sliders" as const,
            title: t("layers_that_suit_you"),
            body: t("adjusted_to_how_easily_you_feel_cold_or_warm"),
          },
          {
            icon: "clock" as const,
            title: t("both_journeys_one_plan"),
            body: t("see_which_layers_to_take_off_and_which_to_bring"),
          },
          {
            icon: "smile" as const,
            title: t("learns_from_your_feedback"),
            body: t("uses_recent_check_ins_to_make_a_small_comfort_adjustment"),
          },
        ].map((f) => (
          <View
            key={f.title}
            style={[s.row, { alignItems: "flex-start", paddingVertical: 8 }]}
          >
            <View
              style={{
                padding: 9,
                borderRadius: 12,
                backgroundColor: "#F8FAF5",
              }}
            >
              <Icon name={f.icon} size={18} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[s.body, { fontWeight: "600" }]}>{f.title}</Text>
              <Text style={s.small}>{f.body}</Text>
            </View>
          </View>
        ))}
      </Card>
      <Notice>
        {t(
          "this_is_a_demo_paywall_no_payment_is_taken_and_no_subscription_starts_price",
        )}
      </Notice>
      <View style={{ gap: 10 }}>
        {(["annual", "monthly"] as const).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="radio"
            accessibilityLabel={`${text(PLANS[key].label)} ${price(PLANS[key].amount)}`}
            accessibilityState={{ checked: selected === key }}
            onPress={() => setSelected(key)}
            style={[
              s.card,
              {
                borderColor: selected === key ? C.green : C.line,
                backgroundColor: selected === key ? C.sage : C.paper,
              },
            ]}
          >
            <View style={s.between}>
              <View style={s.row}>
                <Icon
                  name={selected === key ? "check-circle" : "circle"}
                  size={20}
                />
                <View>
                  <Text style={[s.body, { fontWeight: "600" }]}>
                    {text(PLANS[key].label)}
                  </Text>
                  {key === "annual" ? (
                    <Text style={s.small}>
                      {t("annual_equivalent", {
                        price: price(PLANS.annual.amount / 12),
                      })}
                    </Text>
                  ) : null}
                </View>
              </View>
              <Text style={[s.heading, { fontSize: 22 }]}>
                {price(PLANS[key].amount)}
                <Text style={s.small}> {text(PLANS[key].period)}</Text>
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Button disabled={busy} icon="arrow-right" onPress={activate}>
        {active
          ? t("continue_to_premium_demo")
          : t("try_premium_demo_for_free")}
      </Button>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          setMessage(
            active
              ? t("premium_demo_is_already_active_on_this_device")
              : t(
                  "no_premium_demo_is_active_on_this_device_real_purchases_are_not_connected",
                ),
          )
        }
        style={{ padding: 12, alignItems: "center" }}
      >
        <Text style={s.small}>{t("check_demo_status")}</Text>
      </Pressable>
      {message ? (
        <Text accessibilityLiveRegion="polite" style={s.small}>
          {message}
        </Text>
      ) : null}
      <Text style={[s.small, { textAlign: "center" }]}>
        {t("real_payments_will_be_connected_later")}
        {"\n"}
        {t("wardrobe_editing_and_feedback_are_always_free")}
      </Text>
    </Screen>
  );
}
