import { useTranslation } from "../i18n/useTranslation";
import { useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { Screen } from "../components/Screen";
import { C, s } from "../components/theme";
import { Button, Chip, Icon, Card } from "../components/ui";
import { CATALOG, COLORS, garmentFor } from "../domain/catalog";
import type { Garment, Category } from "../domain/types";
import { useStore } from "../store/useStore";
import { GarmentArt } from "../components/GarmentArt";
function Editor({
  garment,
  onSave,
  onCancel,
  onRemove,
}: {
  garment: Garment;
  onSave: (g: Garment) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const { t, garmentName } = useTranslation();

  const [name, setName] = useState(garmentName(garment));
  const [color, setColor] = useState(garment.color);
  return (
    <Card style={{ borderColor: C.green, backgroundColor: "#F3F5EE" }}>
      <View style={s.row}>
        <GarmentArt
          category={garment.category}
          color={color}
          width={75}
          height={100}
        />
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={s.eyebrow}>{t("edit_item")}</Text>
          <TextInput
            accessibilityLabel={t("item_name")}
            style={s.input}
            value={name}
            onChangeText={setName}
            maxLength={60}
          />
        </View>
      </View>
      <View style={s.wrap}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="radio"
            accessibilityLabel={t("color_label", { color: c })}
            accessibilityState={{ checked: c === color }}
            onPress={() => setColor(c)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 20,
              backgroundColor: c,
              borderWidth: 2,
              borderColor: c === color ? C.green : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {c === color ? (
              <Icon
                name="check"
                size={16}
                color={
                  ["#343D38", "#394D55", "#67715B"].includes(c) ? "#fff" : C.ink
                }
              />
            ) : null}
          </Pressable>
        ))}
      </View>
      <Button
        disabled={!name.trim()}
        onPress={() =>
          onSave({
            ...garment,
            name:
              name.trim() === garmentName(garment) ? garment.name : name.trim(),
            nameSource:
              name.trim() === garmentName(garment)
                ? garment.nameSource
                : "custom",
            color,
          })
        }
      >
        {t("save_changes")}
      </Button>
      <View style={s.between}>
        <Pressable
          accessibilityRole="button"
          onPress={onRemove}
          style={{ padding: 10 }}
        >
          <Text style={{ fontSize: 13, color: C.warning }}>
            {t("remove_from_wardrobe")}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          style={{ padding: 10 }}
        >
          <Text style={s.small}>{t("cancel")}</Text>
        </Pressable>
      </View>
    </Card>
  );
}
export function Wardrobe() {
  const { t, text, garmentName } = useTranslation();

  const wardrobe = useStore((x) => x.wardrobe);
  const setWardrobe = useStore((x) => x.setWardrobe);
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const chosen = wardrobe.find((g) => g.id === editing);
  const available = CATALOG.filter(
    (c) => !wardrobe.some((g) => g.category === c.category),
  );
  const shown = wardrobe.filter(
    (g) =>
      filter === "all" ||
      CATALOG.find((c) => c.category === g.category)?.layer === filter,
  );
  function add(category: Category) {
    const g = garmentFor(category);
    setWardrobe([...wardrobe, g]);
    setEditing(g.id);
  }
  return (
    <Screen>
      <Text style={s.eyebrow}>{t("fewer_pieces_more_possibilities")}</Text>
      <View style={s.between}>
        <Text style={s.title}>{t("your_pieces")}</Text>
        <Text style={s.small}>
          {t(wardrobe.length === 1 ? "item_count_one" : "item_count", {
            count: wardrobe.length,
          })}
        </Text>
      </View>
      <Text style={s.body}>
        {t(
          "build_your_wardrobe_without_uploading_photos_recommendations_only_use_the_i",
        )}
      </Text>
      <View style={s.wrap}>
        {[
          { key: "all", name: t("all") },
          { key: "base", name: t("base_layer") },
          { key: "mid", name: t("mid_layer") },
          { key: "shell", name: t("outer_layer") },
        ].map((f) => (
          <Chip
            key={f.key}
            label={f.name}
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>
      {chosen ? (
        <Editor
          key={chosen.id}
          garment={chosen}
          onSave={(g) => {
            setWardrobe(wardrobe.map((x) => (x.id === g.id ? g : x)));
            setEditing(null);
          }}
          onRemove={() => {
            setWardrobe(wardrobe.filter((x) => x.id !== chosen.id));
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      ) : null}
      {shown.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {shown.map((g) => (
            <Pressable
              key={g.id}
              accessibilityRole="button"
              accessibilityLabel={t("edit_item_label", {
                name: garmentName(g),
              })}
              onPress={() => setEditing(g.id)}
              style={{
                width: "48%",
                flexGrow: 1,
                backgroundColor: C.stone,
                borderRadius: 19,
                padding: 13,
                alignItems: "center",
                gap: 5,
              }}
            >
              <View style={{ alignSelf: "flex-end" }}>
                <Icon name="edit-2" size={13} color={C.muted} />
              </View>
              <GarmentArt
                category={g.category}
                color={g.color}
                width={110}
                height={137}
              />
              <Text
                style={[
                  s.body,
                  { fontSize: 13, fontWeight: "600", textAlign: "center" },
                ]}
              >
                {garmentName(g)}
              </Text>
              <Text style={[s.small, { fontSize: 10 }]}>
                {t("in_your_wardrobe")}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Card>
          <Icon name="layers" size={30} color={C.camel} />
          <Text style={s.heading}>
            {wardrobe.length
              ? t("no_items_in_this_category_yet")
              : t("add_your_first_item")}
          </Text>
          <Text style={s.small}>
            {t("choose_a_category_below_for_something_you_own")}
          </Text>
        </Card>
      )}
      {available.length ? (
        <View style={{ gap: 14 }}>
          <Text style={s.eyebrow}>{t("add_to_your_wardrobe")}</Text>
          {available.map((c) => (
            <Pressable
              key={c.category}
              accessibilityRole="button"
              accessibilityLabel={t("add_item_label", { name: text(c.label) })}
              onPress={() => add(c.category)}
              style={[
                s.between,
                {
                  paddingVertical: 11,
                  borderBottomWidth: 1,
                  borderColor: C.line,
                },
              ]}
            >
              <View style={s.row}>
                <View
                  style={{
                    width: 42,
                    height: 48,
                    backgroundColor: C.stone,
                    borderRadius: 9,
                    alignItems: "center",
                  }}
                >
                  <GarmentArt
                    category={c.category}
                    color={c.color}
                    width={40}
                    height={48}
                  />
                </View>
                <Text style={s.body}>{text(c.label)}</Text>
              </View>
              <Icon name="plus" size={19} />
            </Pressable>
          ))}
        </View>
      ) : null}
      <Text style={s.small}>
        {t(
          "this_first_version_supports_one_item_per_category_illustrations_are_represe",
        )}
      </Text>
    </Screen>
  );
}
