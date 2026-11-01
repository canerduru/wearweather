import { useTranslation } from "../i18n/useTranslation";
import { Text, View, useWindowDimensions } from "react-native";
import type { Garment } from "../domain/types";
import { GarmentArt } from "./GarmentArt";
import { C, s } from "./theme";
export function OutfitView({
  items,
  compact = false,
}: {
  items: Garment[];
  compact?: boolean;
}) {
  const { t, garmentName } = useTranslation();
  const { width } = useWindowDimensions();
  const artWidth = Math.min(
    compact ? 90 : 155,
    (Math.min(width, 480) - (compact ? 108 : 84)) / Math.max(items.length, 1) +
      (compact ? 0 : 10),
  );

  if (!items.length)
    return (
      <View
        style={{
          height: compact ? 110 : 210,
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
        }}
      >
        <Text style={{ fontSize: 38, color: C.camel }}>＋</Text>
        <Text style={s.body}>{t("add_a_few_items_first")}</Text>
      </View>
    );
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingTop: compact ? 6 : 22,
        paddingBottom: 10,
      }}
    >
      {items.map((g, i) => (
        <View
          key={g.id}
          style={{
            flex: 1,
            alignItems: "center",
            marginLeft: compact ? 0 : i ? -15 : 0,
          }}
        >
          <GarmentArt
            category={g.category}
            color={g.color}
            width={artWidth}
            height={compact ? 110 : 205}
          />
          {compact ? (
            <Text
              numberOfLines={2}
              style={[s.small, { textAlign: "center", color: C.ink }]}
            >
              {garmentName(g)}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
