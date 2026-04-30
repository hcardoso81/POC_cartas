import { Text, View, StyleSheet } from "react-native";
import type { Card } from "../../core/domain/Card";
import { suitLabels } from "../../core/domain/Card";
import { colors, radii, shadow } from "../theme/tokens";
import { SuitMark } from "./SuitMark";

type Props = {
  card: Card;
};

export function PlayingCard({ card }: Props) {
  if (card.kind === "joker") {
    return (
      <View style={styles.card}>
        <Text style={[styles.corner, card.variant === "red" ? styles.red : styles.blue]}>J</Text>
        <View style={styles.jokerCenter}>
          <Text style={[styles.joker, card.variant === "red" ? styles.red : styles.blue]}>Comodin</Text>
          <Text style={styles.jokerSub}>{card.variant === "red" ? "Rojo" : "Azul"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cornerBlock}>
        <Text style={styles.corner}>{card.rank}</Text>
        <Text style={styles.suitName}>{suitLabels[card.suit]}</Text>
      </View>
      <SuitMark suit={card.suit} size={108} />
      <View style={[styles.cornerBlock, styles.inverted]}>
        <Text style={styles.corner}>{card.rank}</Text>
        <Text style={styles.suitName}>{suitLabels[card.suit]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 156,
    height: 224,
    borderRadius: radii.card,
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    ...shadow
  },
  cornerBlock: {
    position: "absolute",
    top: 12,
    left: 12,
    alignItems: "flex-start"
  },
  inverted: {
    top: undefined,
    left: undefined,
    right: 12,
    bottom: 12,
    transform: [{ rotate: "180deg" }]
  },
  corner: {
    color: colors.ink,
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 30
  },
  suitName: {
    color: colors.muted,
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase"
  },
  jokerCenter: {
    alignItems: "center",
    gap: 4
  },
  joker: {
    fontFamily: "Inter_700Bold",
    fontSize: 26
  },
  jokerSub: {
    color: colors.muted,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14
  },
  red: {
    color: colors.red
  },
  blue: {
    color: colors.blue
  }
});
