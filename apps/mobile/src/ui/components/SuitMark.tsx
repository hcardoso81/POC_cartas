import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { colors } from "../theme/tokens";
import type { SpanishSuit } from "../../core/domain/Card";

type Props = {
  suit: SpanishSuit;
  size?: number;
  design?: "modern" | "traditional";
  rotation?: number;
};

export function SuitMark({ suit, size = 96, design = "modern", rotation = 0 }: Props) {
  const transform = rotation ? `rotate(${rotation} 50 50)` : undefined;

  if (suit === "oro") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform={transform}>
          <Circle cx="50" cy="50" r="31" fill={colors.gold} stroke="#8D6515" strokeWidth="5" />
          <Circle cx="50" cy="50" r={design === "traditional" ? 22 : 18} fill="none" stroke="#FFE39A" strokeWidth="5" />
          {design === "traditional" ? <Circle cx="50" cy="50" r="8" fill="#B67B12" /> : null}
        </G>
      </Svg>
    );
  }

  if (suit === "copa") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform={transform}>
          <Path d="M30 20h40l-7 35c-2 10-10 17-20 17s-18-7-20-17z" fill={colors.red} stroke="#81242A" strokeWidth="4" />
          {design === "traditional" ? <Path d="M37 27h26l-4 20c-1 6-5 10-9 10s-8-4-9-10z" fill="#F6C747" /> : null}
          <Rect x="45" y="70" width="10" height="15" rx="4" fill="#81242A" />
          <Ellipse cx="50" cy="89" rx="22" ry="6" fill="#81242A" />
        </G>
      </Svg>
    );
  }

  if (suit === "basto") {
    if (design === "traditional") {
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <G transform={transform ?? "rotate(-34 50 50)"}>
            <Rect x="40" y="10" width="20" height="80" rx="10" fill="#19834E" stroke="#0D4F31" strokeWidth="4" />
            <Path d="M42 18c9 4 16 11 17 20M41 54c10 4 17 11 18 23" stroke="#F2C441" strokeWidth="5" strokeLinecap="round" />
            <Path d="M58 22c-7 3-15 8-17 17M59 58c-8 3-15 8-17 19" stroke="#D43A2F" strokeWidth="5" strokeLinecap="round" />
            <Circle cx="50" cy="25" r="4" fill="#F2C441" stroke="#0D4F31" strokeWidth="2" />
            <Circle cx="50" cy="50" r="4" fill="#D43A2F" stroke="#0D4F31" strokeWidth="2" />
            <Circle cx="50" cy="75" r="4" fill="#F2C441" stroke="#0D4F31" strokeWidth="2" />
          </G>
        </Svg>
      );
    }

    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform={transform ?? "rotate(-34 50 50)"}>
          <Rect x="43" y="14" width="18" height="72" rx="9" fill={colors.wood} stroke="#5A351F" strokeWidth="4" />
          <Line x1="47" y1="24" x2="57" y2="35" stroke="#C28B5B" strokeWidth="4" strokeLinecap="round" />
          <Line x1="46" y1="50" x2="57" y2="62" stroke="#C28B5B" strokeWidth="4" strokeLinecap="round" />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G transform={transform}>
        <Path d="M50 8l11 58H39z" fill={design === "traditional" ? "#E8EEF5" : colors.steel} stroke="#35475F" strokeWidth="4" />
        <Rect x="45" y="63" width="10" height="20" rx="3" fill="#35475F" />
        <Line x1="28" y1="64" x2="72" y2="64" stroke="#35475F" strokeWidth="6" strokeLinecap="round" />
        <Circle cx="50" cy="88" r="6" fill="#35475F" />
      </G>
    </Svg>
  );
}
