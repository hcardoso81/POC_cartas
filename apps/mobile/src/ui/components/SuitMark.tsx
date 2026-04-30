import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { colors } from "../theme/tokens";
import type { SpanishSuit } from "../../core/domain/Card";

type Props = {
  suit: SpanishSuit;
  size?: number;
};

export function SuitMark({ suit, size = 96 }: Props) {
  if (suit === "oro") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="31" fill={colors.gold} stroke="#8D6515" strokeWidth="5" />
        <Circle cx="50" cy="50" r="18" fill="none" stroke="#FFE39A" strokeWidth="5" />
      </Svg>
    );
  }

  if (suit === "copa") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M30 20h40l-7 35c-2 10-10 17-20 17s-18-7-20-17z" fill={colors.red} stroke="#81242A" strokeWidth="4" />
        <Rect x="45" y="70" width="10" height="15" rx="4" fill="#81242A" />
        <Ellipse cx="50" cy="89" rx="22" ry="6" fill="#81242A" />
      </Svg>
    );
  }

  if (suit === "basto") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G transform="rotate(-34 50 50)">
          <Rect x="43" y="14" width="18" height="72" rx="9" fill={colors.wood} stroke="#5A351F" strokeWidth="4" />
          <Line x1="47" y1="24" x2="57" y2="35" stroke="#C28B5B" strokeWidth="4" strokeLinecap="round" />
          <Line x1="46" y1="50" x2="57" y2="62" stroke="#C28B5B" strokeWidth="4" strokeLinecap="round" />
        </G>
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M50 8l11 58H39z" fill={colors.steel} stroke="#35475F" strokeWidth="4" />
      <Rect x="45" y="63" width="10" height="20" rx="3" fill="#35475F" />
      <Line x1="28" y1="64" x2="72" y2="64" stroke="#35475F" strokeWidth="6" strokeLinecap="round" />
      <Circle cx="50" cy="88" r="6" fill="#35475F" />
    </Svg>
  );
}
