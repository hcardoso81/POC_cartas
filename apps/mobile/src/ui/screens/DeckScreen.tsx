import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Card } from "../../core/domain/Card";
import type { Deck } from "../../core/domain/Deck";
import { drawTopCard } from "../../core/use-cases/drawTopCard";
import { createDeckRepository } from "../../infrastructure/repositories/createDeckRepository";
import { AnimatedDrawnCard } from "../components/AnimatedDrawnCard";
import type { CardBackColor } from "../components/CardBack";
import { DeckStack } from "../components/DeckStack";
import { colors } from "../theme/tokens";

const cardSize = {
  width: 156,
  height: 224
};

type PlacedCard = {
  card: Card;
  x: number;
  y: number;
};

export function DeckScreen() {
  const repository = useMemo(() => createDeckRepository(), []);
  const tableRef = useRef<View>(null);
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([]);
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [backColor, setBackColor] = useState<CardBackColor>("blue");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    repository.createDeck().then((createdDeck) => {
      if (mounted) {
        setDeck(createdDeck);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [repository]);

  const clampToTable = useCallback(
    (x: number, y: number) => ({
      x: Math.max(0, Math.min(x, Math.max(0, tableSize.width - cardSize.width))),
      y: Math.max(0, Math.min(y, Math.max(0, tableSize.height - cardSize.height)))
    }),
    [tableSize.height, tableSize.width]
  );

  function handleDeckDrop(point: { pageX: number; pageY: number }) {
    const result = drawTopCard(deck);

    if (!result.drawnCard || !tableRef.current) {
      return;
    }

    tableRef.current.measure((_x, _y, _width, _height, pageX, pageY) => {
      const position = clampToTable(point.pageX - pageX - cardSize.width / 2, point.pageY - pageY - cardSize.height / 2);

      setDeck(result.deck);
      setPlacedCards((current) => [
        ...current,
        {
          card: result.drawnCard as Card,
          ...position
        }
      ]);
    });
  }

  const handleMovePlacedCard = useCallback(
    (cardId: string, position: { x: number; y: number }) => {
      const clamped = clampToTable(position.x, position.y);
      setPlacedCards((current) => current.map((placed) => (placed.card.id === cardId ? { ...placed, ...clamped } : placed)));
    },
    [clampToTable]
  );

  const handleFocusPlacedCard = useCallback((cardId: string) => {
    setPlacedCards((current) => {
      const selectedCard = current.find((placed) => placed.card.id === cardId);

      if (!selectedCard || current[current.length - 1]?.card.id === cardId) {
        return current;
      }

      return [...current.filter((placed) => placed.card.id !== cardId), selectedCard];
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>Mazo espanol</Text>
            <Text style={styles.title}>POC Cartas</Text>
            <Text style={styles.subtitle}>Arrastra desde el mazo para tomar la carta superior y soltarla en cualquier lugar de la mesa.</Text>
          </View>

          <View style={styles.settings}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir ajustes"
              onPress={() => setSettingsOpen((current) => !current)}
              style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
            >
              <Text style={styles.settingsButtonText}>Ajustes</Text>
            </Pressable>

            {settingsOpen ? (
              <View style={styles.settingsMenu}>
                <Text style={styles.settingsLabel}>Lomo</Text>
                <View style={styles.segmented}>
                  {(["blue", "red"] as CardBackColor[]).map((option) => {
                    const selected = option === backColor;

                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setBackColor(option)}
                        style={[styles.segment, selected && styles.segmentSelected]}
                      >
                        <View style={[styles.swatch, option === "blue" ? styles.blueSwatch : styles.redSwatch]} />
                        <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{option === "blue" ? "Azul" : "Rojo"}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <View
          ref={tableRef}
          onLayout={(event) => {
            setTableSize(event.nativeEvent.layout);
          }}
          style={styles.table}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <View style={styles.playArea}>
              {placedCards.map((placed, index) => (
                <AnimatedDrawnCard
                  key={placed.card.id}
                  card={placed.card}
                  backColor={backColor}
                  x={placed.x}
                  y={placed.y}
                  zIndex={index + 1}
                  onFocus={() => handleFocusPlacedCard(placed.card.id)}
                  onMove={(position) => handleMovePlacedCard(placed.card.id, position)}
                />
              ))}

              <View style={styles.deckSlot}>
                <DeckStack remaining={deck.cards.length} backColor={backColor} disabled={loading} onDrop={handleDeckDrop} />
                <Text style={styles.counter}>{deck.cards.length} en mazo</Text>
              </View>

              <View pointerEvents="none" style={styles.tableStatus}>
                <Text style={styles.counter}>{placedCards.length} en mesa</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.tableDark
  },
  screen: {
    flex: 1,
    backgroundColor: colors.tableDark
  },
  header: {
    position: "relative",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 18
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  kicker: {
    color: "#95D7CE",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 34,
    marginTop: 4
  },
  subtitle: {
    color: "#D7ECE8",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 360
  },
  settings: {
    alignItems: "flex-end"
  },
  settingsButton: {
    minHeight: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  settingsButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 13
  },
  pressed: {
    opacity: 0.72
  },
  settingsMenu: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 178,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(7,20,33,0.16)",
    padding: 10,
    gap: 8
  },
  settingsLabel: {
    color: colors.ink,
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    textTransform: "uppercase"
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#E7EDF4",
    padding: 3,
    gap: 3
  },
  segment: {
    flex: 1,
    minHeight: 34,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  segmentSelected: {
    backgroundColor: "#FFFFFF"
  },
  segmentText: {
    color: colors.muted,
    fontFamily: "Inter_600SemiBold",
    fontSize: 12
  },
  segmentTextSelected: {
    color: colors.ink
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  blueSwatch: {
    backgroundColor: colors.blue
  },
  redSwatch: {
    backgroundColor: colors.red
  },
  table: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: colors.table,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center"
  },
  playArea: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden"
  },
  deckSlot: {
    position: "absolute",
    left: 18,
    bottom: 16,
    alignItems: "center",
    gap: 14
  },
  tableStatus: {
    position: "absolute",
    right: 18,
    bottom: 18,
    borderRadius: 8,
    backgroundColor: "rgba(7,20,33,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  counter: {
    color: "#EAF8F4",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14
  }
});
