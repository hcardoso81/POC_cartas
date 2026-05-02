import { Text, View, StyleSheet } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import type { Card, SpanishSuit } from "../../core/domain/Card";
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
  ],
  8: [
    { x: 34, y: 22, rotation: -18 },
    { x: 66, y: 22, rotation: 18 },
    { x: 34, y: 42, rotation: -18 },
    { x: 66, y: 42, rotation: 18 },
    { x: 34, y: 62, rotation: -18 },
    { x: 66, y: 62, rotation: 18 },
    { x: 34, y: 82, rotation: 162 },
    { x: 66, y: 82, rotation: -162 }
  ],
  9: [
    { x: 34, y: 21, rotation: -18 },
    { x: 66, y: 21, rotation: 18 },
    { x: 34, y: 39, rotation: -18 },
    { x: 66, y: 39, rotation: 18 },
    { x: 50, y: 51, rotation: 90 },
    { x: 34, y: 63, rotation: -18 },
    { x: 66, y: 63, rotation: 18 },
    { x: 34, y: 82, rotation: 162 },
    { x: 66, y: 82, rotation: -162 }
  ]
};

const faceTitleByRank: Record<number, string> = {
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
            <CourtFigure rank={card.rank} suit={card.suit} />
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

function CourtFigure({ rank, suit }: { rank: number; suit: SpanishSuit }) {
  if (rank === 11) {
    return (
      <View style={styles.courtWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 100 140">
          <Ellipse cx="48" cy="119" rx="38" ry="7" fill="#D9B44F" opacity="0.38" />
          <Path d="M14 88c5-23 21-35 44-31 16 3 26 13 29 26 2 11-3 22-14 26-9 4-20 1-28-7-7-8-17-8-31-4z" fill="#B7834E" stroke="#5E3A24" strokeWidth="3" />
          <Path d="M19 83c2-16 12-25 29-27 16-1 29 7 35 22-20-8-43-7-64 5z" fill="#E7C587" />
          <Path d="M17 91c9 6 17 7 25 3 10-5 18-3 26 6" fill="none" stroke="#754628" strokeWidth="4" strokeLinecap="round" />
          <Path d="M77 82c5 4 7 12 4 18" fill="none" stroke="#5E3A24" strokeWidth="4" strokeLinecap="round" />
          <Circle cx="25" cy="70" r="4" fill="#182333" />
          <Path d="M13 68c6-11 13-16 23-16 7 0 12 3 15 8-8 2-18 5-30 11z" fill="#F0E1C1" stroke="#5E3A24" strokeWidth="3" />
          <Path d="M21 52c-5-5-9-10-9-17 9 2 15 7 19 16z" fill="#F0E1C1" stroke="#5E3A24" strokeWidth="3" />
          <Line x1="32" y1="103" x2="25" y2="128" stroke="#5E3A24" strokeWidth="6" strokeLinecap="round" />
          <Line x1="64" y1="104" x2="72" y2="128" stroke="#5E3A24" strokeWidth="6" strokeLinecap="round" />
          <Line x1="25" y1="128" x2="15" y2="130" stroke="#2E4F2B" strokeWidth="5" strokeLinecap="round" />
          <Line x1="72" y1="128" x2="83" y2="130" stroke="#2E4F2B" strokeWidth="5" strokeLinecap="round" />
          <Path d="M49 44c14 7 21 21 19 43l-32 1c-4-18 0-34 13-44z" fill="#68B7D8" stroke="#234D64" strokeWidth="3" />
          <Path d="M39 61l27 5 2 18H35z" fill="#D64B2F" opacity="0.9" />
          <Path d="M38 47c6-13 21-13 27-1-6 8-18 9-27 1z" fill="#DDA66C" stroke="#6B442C" strokeWidth="3" />
          <Path d="M38 35c10-9 21-6 29 4-6 1-11 0-16-3-3 4-7 5-13 4z" fill="#8B4B29" />
          <Path d="M34 37c8-12 21-15 35-5" fill="none" stroke="#D9AE37" strokeWidth="5" strokeLinecap="round" />
          <Path d="M35 50c-7 7-10 16-9 28" fill="none" stroke="#4B9D54" strokeWidth="7" strokeLinecap="round" />
          <Path d="M70 50c7 10 9 21 6 34" fill="none" stroke="#4B9D54" strokeWidth="7" strokeLinecap="round" />
        </Svg>
        <View style={styles.courtSuitBadge}>
          <SuitMark suit={suit} size={34} design="traditional" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.courtWrap}>
      <Svg width="100%" height="100%" viewBox="0 0 100 140">
        <Ellipse cx="50" cy="124" rx="30" ry="7" fill="#D9B44F" opacity="0.38" />
        <Path d="M35 48c-12 13-17 35-17 67h64c0-32-5-54-17-67z" fill={rank === 12 ? "#C8342E" : "#68B7D8"} stroke="#6B2E23" strokeWidth="3" />
        <Path d="M27 65c10 8 23 11 46 0l7 48H20z" fill="#E6B93E" opacity="0.95" />
        <Path d="M31 60c8 9 14 15 19 16 5-1 12-7 20-16" fill="none" stroke="#78C5E9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M35 92h30M31 104h38" stroke="#8A4E1F" strokeWidth="2" />
        <Path d="M39 42c6-12 17-12 23 0-4 9-18 9-23 0z" fill="#DDA66C" stroke="#6B442C" strokeWidth="3" />
        <Path d="M36 34c7-9 20-10 29-1-3 3-7 5-13 5-6 0-11-1-16-4z" fill={rank === 12 ? "#C8C2B7" : "#A84B24"} />
        {rank === 12 ? (
          <>
            <Path d="M34 31l7-10 8 8 8-10 7 11z" fill="#E7C843" stroke="#7B6715" strokeWidth="2" />
            <Circle cx="41" cy="22" r="2.5" fill="#D94435" />
            <Circle cx="56" cy="21" r="2.5" fill="#D94435" />
            <Path d="M39 50c6 7 14 7 22 0" stroke="#EEE9DE" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <Path d="M32 33c10-10 24-11 36-3" fill="none" stroke="#C9482D" strokeWidth="5" strokeLinecap="round" />
            <Circle cx="69" cy="28" r="5" fill="#78C5E9" />
          </>
        )}
        <Path d="M29 64c-9 10-11 20-10 31" fill="none" stroke="#D9B237" strokeWidth="8" strokeLinecap="round" />
        <Path d="M71 64c9 10 11 20 10 31" fill="none" stroke="#D9B237" strokeWidth="8" strokeLinecap="round" />
        <Rect x="44" y="113" width="7" height="18" rx="3" fill="#B63B27" />
        <Rect x="55" y="113" width="7" height="18" rx="3" fill="#B63B27" />
        <Line x1="44" y1="131" x2="35" y2="132" stroke="#2E7C3A" strokeWidth="5" strokeLinecap="round" />
        <Line x1="62" y1="131" x2="72" y2="132" stroke="#2E7C3A" strokeWidth="5" strokeLinecap="round" />
      </Svg>
      <View style={rank === 12 ? styles.kingSuit : styles.courtSuitBadge}>
        <SuitMark suit={suit} size={rank === 12 ? 42 : 36} design="traditional" />
      </View>
      <Text style={styles.courtTitle}>{faceTitleByRank[rank]}</Text>
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
    overflow: "hidden"
  },
  figureSuit: {
    position: "absolute",
    bottom: 4,
    color: colors.muted,
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase"
  },
  courtWrap: {
    width: 106,
    height: 146,
    alignItems: "center",
    justifyContent: "center"
  },
  courtSuitBadge: {
    position: "absolute",
    top: 6,
    left: 4,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center"
  },
  kingSuit: {
    position: "absolute",
    top: 18,
    left: 4,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  courtTitle: {
    position: "absolute",
    top: 4,
    right: 6,
    color: colors.ink,
    fontFamily: "Inter_700Bold",
    fontSize: 11
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
