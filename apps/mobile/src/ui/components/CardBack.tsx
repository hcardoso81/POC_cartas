import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Line, Pattern, Rect } from "react-native-svg";
import { colors, radii } from "../theme/tokens";

export type CardBackColor = "blue" | "red";

type Props = {
  color?: CardBackColor;
};

const inkByColor: Record<CardBackColor, string> = {
  blue: "#163E73",
  red: "#A72E39"
};

export function CardBack({ color = "blue" }: Props) {
  const ink = inkByColor[color];
  const patternId = `card-back-pattern-${color}`;

  return (
    <View style={styles.back}>
      <Svg width="100%" height="100%" viewBox="0 0 156 224">
        <Defs>
          <Pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
            <Rect width="12" height="12" fill="#FFFDF8" />
            <Line x1="6" y1="0" x2="12" y2="6" stroke={ink} strokeWidth="1.25" />
            <Line x1="12" y1="6" x2="6" y2="12" stroke={ink} strokeWidth="1.25" />
            <Line x1="6" y1="12" x2="0" y2="6" stroke={ink} strokeWidth="1.25" />
            <Line x1="0" y1="6" x2="6" y2="0" stroke={ink} strokeWidth="1.25" />
            <Circle cx="6" cy="6" r="1.75" fill={ink} />
            <Circle cx="0" cy="0" r="1.15" fill={ink} />
            <Circle cx="12" cy="0" r="1.15" fill={ink} />
            <Circle cx="0" cy="12" r="1.15" fill={ink} />
            <Circle cx="12" cy="12" r="1.15" fill={ink} />
          </Pattern>
        </Defs>

        <Rect x="0" y="0" width="156" height="224" rx="12" fill="#FFFDF8" />
        <Rect x="10" y="10" width="136" height="204" rx="4" fill={`url(#${patternId})`} />
        <Rect x="9" y="9" width="138" height="206" rx="5" fill="none" stroke={ink} strokeWidth="3" />
        <Rect x="15" y="15" width="126" height="194" rx="2" fill="none" stroke="#FFFDF8" strokeWidth="2" />
        <Rect x="19" y="19" width="118" height="186" rx="1" fill="none" stroke={ink} strokeWidth="1.5" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    borderRadius: radii.card,
    backgroundColor: "#FFFDF8",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line
  }
});
