import { useTranslation } from "../i18n/useTranslation";
import { CATALOG } from "../domain/catalog";
import { useId } from "react";
import Svg, {
  Path,
  Rect,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from "react-native-svg";
import type { Category } from "../domain/types";
export function GarmentArt({
  category,
  color,
  width = 120,
  height = 145,
}: {
  category: Category;
  color: string;
  width?: number;
  height?: number;
}) {
  const { text } = useTranslation();
  const id = useId().replace(/:/g, "");
  const outer = ["jacket", "raincoat", "coat"].includes(category);
  const short = category === "tee";
  const hoodie = category === "hoodie";
  const path = short
    ? "M43 27 L20 37 7 66 27 76 36 59 33 139 Q75 146 117 139 L114 59 123 76 143 66 130 37 107 27 Q76 39 43 27Z"
    : "M43 27 L23 36 Q18 39 16 54 L4 124 24 130 37 77 33 139 Q75 146 117 139 L113 77 126 130 146 124 134 54 Q131 39 127 36 L107 27 Q76 39 43 27Z";
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 150 160"
      accessibilityLabel={text(
        CATALOG.find((c) => c.category === category)!.label,
      )}
    >
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} />
          <Stop offset="0.55" stopColor={color} />
          <Stop offset="1" stopColor="#18241E" stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      <Path d={path} transform="translate(0 3)" fill="#28372D" opacity="0.08" />
      <Path
        d={path}
        fill={`url(#${id})`}
        stroke="#26332B"
        strokeOpacity="0.18"
        strokeWidth="1.1"
      />
      {outer ? (
        <>
          <Path
            d="M43 27 60 50 75 36 90 50 107 27 91 20 75 28 59 20Z"
            fill={color}
            stroke="#23342D"
            strokeOpacity="0.3"
          />
          <Line
            x1="75"
            y1="37"
            x2="75"
            y2="140"
            stroke="#273329"
            strokeOpacity="0.35"
          />
          {[65, 85, 105, 125].map((y) => (
            <Circle
              key={y}
              cx="79"
              cy={y}
              r="1.5"
              fill="#28382F"
              opacity="0.6"
            />
          ))}
          <Path
            d="M43 91 63 91 62 110 44 110Z M88 91 108 91 106 110 88 110Z"
            fill="none"
            stroke="#26332B"
            strokeOpacity="0.22"
          />
          {category === "raincoat" ? (
            <Path
              d="M52 27 Q52 0 75 5 Q98 0 98 27"
              fill={color}
              stroke="#26332B"
              strokeOpacity="0.25"
            />
          ) : null}
        </>
      ) : (
        <>
          <Path
            d="M54 29 Q75 53 96 29"
            fill="none"
            stroke="#26332B"
            strokeOpacity="0.25"
            strokeWidth="4"
          />
          {hoodie ? (
            <>
              <Path
                d="M52 28 Q51 3 75 7 Q99 3 98 28 L86 43 64 43Z"
                fill={color}
                stroke="#26332B"
                strokeOpacity="0.25"
              />
              <Path
                d="M53 108 96 108 103 127 47 127Z"
                fill="none"
                stroke="#26332B"
                strokeOpacity="0.2"
              />
            </>
          ) : null}
          <Path
            d="M35 135 Q75 141 115 135"
            fill="none"
            stroke="#26332B"
            strokeOpacity="0.18"
            strokeWidth="3"
          />
        </>
      )}
      <Path
        d="M39 66 Q43 91 40 125 M110 64 Q105 97 110 126"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.15"
        strokeWidth="2"
      />
      {category === "knit" || category === "heavyknit"
        ? Array.from({ length: 13 }, (_, i) => (
            <Line
              key={i}
              x1={43 + i * 5}
              y1="52"
              x2={43 + i * 5}
              y2="132"
              stroke="#FFFFFF"
              strokeOpacity="0.09"
            />
          ))
        : null}
      <Rect
        x="68"
        y="34"
        width="14"
        height="4"
        rx="1"
        fill="#FFFFFF"
        opacity="0.2"
      />
    </Svg>
  );
}
