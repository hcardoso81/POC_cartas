import { Text, View, StyleSheet } from "react-native";
import type { Card } from "../../core/domain/Card";
import { suitLabels } from "../../core/domain/Card";
import type { CardFaceDesignId } from "../card-designs/cardFaceDesigns";
import { colors, radii, shadow } from "../theme/tokens";
import { SuitMark } from "./SuitMark";

type Props = {
  card: Card;
  faceDesign?: CardFaceDesignId;
};

const pipLayouts: Record<number, { x: number; y: number; rotation?: number }[]> = {
  1: [{ x: 50, y: 50, rotation: -24 }],
  2: [
    { x: 50, y: 31, rotation: -12 },
    { x: 50, y: 69, rotation: 168 }
  ],
  3: [
    { x: 50, y: 25, rotation: -24 },
    { x: 50, y: 50, rotation: -24 },
    { x: 50, y: 75, rotation: 156 }
  ],
  4: [
    { x: 35, y: 31, rotation: -28 },
    { x: 65, y: 31, rotation: 28 },
    { x: 35, y: 69, rotation: 152 },
    { x: 65, y: 69, rotation: -152 }
  ],
  5: [
    { x: 34, y: 28, rotation: -30 },
    { x: 66, y: 28, rotation: 30 },
    { x: 50, y: 50, rotation: 90 },
    { x: 34, y: 72, rotation: 150 },
    { x: 66, y: 72, rotation: -150 }
  ],
  6: [
    { x: 34, y: 25, rotation: -18 },
    { x: 66, y: 25, rotation: 18 },
    { x: 34, y: 50, rotation: -18 },
    { x: 66, y: 50, rotation: 18 },
    { x: 34, y: 75, rotation: 162 },
    { x: 66, y: 75, rotation: -162 }
  ],
  7: [
    { x: 34, y: 24, rotation: -18 },
    { x: 66, y: 24, rotation: 18 },
    { x: 50, y: 41, rotation: 90 },
    { x: 34, y: 58, rotation: -18 },
    { x: 66, y: 58, rotation: 18 },
    { x: 34, y: 78, rotation: 162 },
    { x: 66, y: 78, rotation: -162 }
  ]
};

const faceLabels: Record<number, string> = {
  10: "Sota",
  11: "Caballo",
  12: "Rey"
};

export function PlayingCard({ card, faceDesign = "modern" }: Props) {
  if (card.kind === "joker") {
    return (
      <View style={[styles.card, faceDesign === "traditional" && styles.traditionalCard]}>
        <Text style={[styles.corner, card.variant === "red" ? styles.red : styles.blue]}>J</Text>
        <View style={styles.jokerCenter}>
          <Text style={[styles.joker, card.variant === "red" ? styles.red : styles.blue]}>Comodin</Text>
          <Text style={styles.jokerSub}>{card.variant === "red" ? "Rojo" : "Azul"}</Text>
        </View>
      </View>
    );
  }

  if (faceDesign === "traditional") {
    const pips = pipLayouts[card.rank];

    return (
      <View style={[styles.card, styles.traditionalCard]}>
        <Corner rank={card.rank} suitName={suitLabels[card.suit]} />

        {pips ? (
          <View style={styles.pipField}>
            {pips.map((pip, index) => (
              <View key={`${card.id}-${index}`} style={[styles.pip, { left: `${pip.x}%`, top: `${pip.y}%` }]}>
                <SuitMark suit={card.suit} size={card.rank === 1 ? 98 : 52} design="traditional" rotation={pip.rotation} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.figureField}>
            <Text style={styles.figureLabel}>{faceLabels[card.rank] ?? card.rank}</Text>
            <SuitMark suit={card.suit} size={118} design="traditional" />
            <Text style={styles.figureSuit}>{suitLabels[card.suit]}</Text>
          </View>
        )}

        <Corner rank={card.rank} suitName={suitLabels[card.suit]} inverted />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Corner rank={card.rank} suitName={suitLabels[card.suit]} />
      <SuitMark suit={card.suit} size={108} />
      <Corner rank={card.rank} suitName={suitLabels[card.suit]} inverted />
    </View>
  );
}

function Corner({ rank, suitName, inverted }: { rank: number; suitName: string; inverted?: boolean }) {
  return (
    <View style={[styles.cornerBlock, inverted && styles.inverted]}>
      <Text style={styles.corner}>{rank}</Text>
      <Text style={styles.suitName}>{suitName}</Text>
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
  traditionalCard: {
    borderColor: "#AEB4BA",
    borderWidth: 1,
    backgroundColor: "#FFFDF7"
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
  pipField: {
    ...StyleSheet.absoluteFillObject,
    margin: 22,
    borderWidth: 1,
    borderColor: "#CDD2D8"
  },
  pip: {
    position: "absolute",
    width: 58,
    height: 58,
    marginLeft: -29,
    marginTop: -29,
    alignItems: "center",
    justifyContent: "center"
  },
  figureField: {
    width: 112,
    height: 156,
    borderWidth: 1,
    borderColor: "#CDD2D8",
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  figureLabel: {
    color: colors.ink,
    fontFamily: "Inter_700Bold",
    fontSize: 15
  },
  figureSuit: {
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
