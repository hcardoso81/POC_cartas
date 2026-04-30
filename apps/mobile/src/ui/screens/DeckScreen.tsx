import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Card } from "../../core/domain/Card";
import type { Deck } from "../../core/domain/Deck";
import { drawTopCard } from "../../core/use-cases/drawTopCard";
import { createDeckRepository } from "../../infrastructure/repositories/createDeckRepository";
import { AnimatedDrawnCard } from "../components/AnimatedDrawnCard";
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
          <Text style={styles.kicker}>Mazo espanol</Text>
          <Text style={styles.title}>POC Cartas</Text>
          <Text style={styles.subtitle}>Arrastra desde el mazo para tomar la carta superior y soltarla en cualquier lugar de la mesa.</Text>
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
                  x={placed.x}
                  y={placed.y}
                  zIndex={index + 1}
                  onFocus={() => handleFocusPlacedCard(placed.card.id)}
                  onMove={(position) => handleMovePlacedCard(placed.card.id, position)}
                />
              ))}

              <View style={styles.deckSlot}>
                <DeckStack remaining={deck.cards.length} disabled={loading} onDrop={handleDeckDrop} />
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
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 18
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
