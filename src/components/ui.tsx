import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { C, s } from "./theme";
export type IconName = React.ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 20,
  color = C.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
export function Button({
  children,
  onPress,
  secondary = false,
  icon,
  disabled = false,
}: {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  icon?: IconName;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondary : styles.primary,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: secondary ? C.ink : "#fff",
        }}
      >
        {children}
      </Text>
      {icon ? (
        <Icon name={icon} color={secondary ? C.ink : "#fff"} size={17} />
      ) : null}
    </Pressable>
  );
}
export function Chip({
  label,
  selected = false,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
}) {
  const content = (
    <>
      {icon ? (
        <Icon name={icon} size={13} color={selected ? "#fff" : C.ink} />
      ) : null}
      <Text
        style={{
          fontSize: 12,
          color: selected ? "#fff" : C.ink,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: C.green }]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.chip}>{content}</View>
  );
}
export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Notice({ children }: { children: string }) {
  return (
    <View style={styles.notice}>
      <Icon name="info" size={15} color={C.warning} />
      <Text style={[s.small, { color: C.warning, flex: 1 }]}>{children}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 19,
    flexDirection: "row",
    gap: 12,
  },
  primary: { backgroundColor: C.green },
  secondary: { backgroundColor: C.stone, borderWidth: 1, borderColor: C.line },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: C.stone,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  notice: {
    backgroundColor: "#F6EDE1",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
  },
});
