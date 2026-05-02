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
    </View>
  );
}

function CourtFigure({ rank, suit }: { rank: number; suit: SpanishSuit }) {
  if (rank === 11) {
    return (
      <View style={styles.courtWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 100 140">
          <Ellipse cx="51" cy="124" rx="36" ry="7" fill="#D9B44F" opacity="0.38" />
          <Path d="M20 83c7-19 21-28 41-24 15 3 25 13 29 27 3 12-2 22-14 26-12 4-23-1-31-12-6-8-14-8-25-3z" fill="#E4C248" stroke="#335A28" strokeWidth="3" />
          <Path d="M28 76c13-8 30-9 52-2 3 5 5 10 5 15-20-8-40-8-60 2z" fill="#72B84A" stroke="#335A28" strokeWidth="2" />
          <Path d="M28 88c11 5 20 5 28 1 9-5 17-2 26 7" fill="none" stroke="#C43D32" strokeWidth="4" strokeLinecap="round" />
          <Path d="M77 77c6 4 9 12 8 22" fill="none" stroke="#335A28" strokeWidth="4" strokeLinecap="round" />
          <Path d="M16 68c5-12 13-19 24-19 8 0 15 4 19 12-11 0-24 4-40 12z" fill="#E9C746" stroke="#335A28" strokeWidth="3" />
          <Path d="M22 51c-5-6-7-12-6-20 8 4 13 10 16 18z" fill="#E9C746" stroke="#335A28" strokeWidth="3" />
          <Circle cx="27" cy="65" r="3" fill="#182333" />
          <Path d="M20 75c8 0 14-2 19-7" fill="none" stroke="#335A28" strokeWidth="2" strokeLinecap="round" />
          <Line x1="34" y1="100" x2="25" y2="130" stroke="#335A28" strokeWidth="6" strokeLinecap="round" />
          <Line x1="66" y1="101" x2="75" y2="130" stroke="#335A28" strokeWidth="6" strokeLinecap="round" />
          <Line x1="25" y1="130" x2="15" y2="132" stroke="#182333" strokeWidth="5" strokeLinecap="round" />
          <Line x1="75" y1="130" x2="87" y2="132" stroke="#182333" strokeWidth="5" strokeLinecap="round" />
          <Rect x="31" y="82" width="42" height="17" rx="3" fill="#E7C843" stroke="#7B6715" strokeWidth="2" />
          <Circle cx="39" cy="90" r="3" fill="#D94435" />
          <Circle cx="51" cy="90" r="3" fill="#4B9D54" />
          <Circle cx="63" cy="90" r="3" fill="#D94435" />
          <Path d="M48 43c11 7 16 20 15 40l-28 1c-4-18 0-31 13-41z" fill="#2E8B45" stroke="#1E5130" strokeWidth="3" />
          <Path d="M38 60l25 4 1 17H34z" fill="#D64B2F" opacity="0.95" />
          <Path d="M40 44c6-12 18-12 24 0-5 8-18 8-24 0z" fill="#F0C083" stroke="#6B442C" strokeWidth="3" />
          <Path d="M37 34c8-8 20-8 30 0-6 2-11 2-16 0-4 4-8 5-14 4z" fill="#202C62" />
          <Path d="M33 34c8-8 18-12 29-10" fill="none" stroke="#D94435" strokeWidth="5" strokeLinecap="round" />
          <Path d="M61 26c8 1 12 5 13 12" fill="none" stroke="#E7C843" strokeWidth="5" strokeLinecap="round" />
          <Path d="M37 47c-7 7-9 16-7 27" fill="none" stroke="#2E8B45" strokeWidth="7" strokeLinecap="round" />
          <Path d="M64 47c7 9 9 20 6 32" fill="none" stroke="#2E8B45" strokeWidth="7" strokeLinecap="round" />
          <Path d="M41 82c4 10 8 20 12 32" fill="none" stroke="#C43D32" strokeWidth="6" strokeLinecap="round" />
          <Path d="M60 82c-1 11-2 21-2 33" fill="none" stroke="#C43D32" strokeWidth="6" strokeLinecap="round" />
          <Line x1="53" y1="114" x2="46" y2="120" stroke="#E7C843" strokeWidth="4" strokeLinecap="round" />
        </Svg>
        <View style={styles.horseSuitBadge}>
          <SuitMark suit={suit} size={46} design="traditional" />
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
  horseSuitBadge: {
    position: "absolute",
    top: 15,
    left: 3,
    width: 52,
    height: 52,
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
