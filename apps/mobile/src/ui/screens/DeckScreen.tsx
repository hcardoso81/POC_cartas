import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Card } from "../../core/domain/Card";
import type { Deck } from "../../core/domain/Deck";
import { drawTopCard } from "../../core/use-cases/drawTopCard";
import { createDeckRepository } from "../../infrastructure/repositories/createDeckRepository";
import { AnimatedDrawnCard } from "../components/AnimatedDrawnCard";
import { DeckStack } from "../components/DeckStack";
import { colors } from "../theme/tokens";

export function DeckScreen() {
  const repository = useMemo(() => createDeckRepository(), []);
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
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

  function handleDraw() {
    const result = drawTopCard(deck);

    if (!result.drawnCard) {
      return;
    }

    setDeck(result.deck);
    setDrawnCards((current) => [result.drawnCard as Card, ...current]);
  }

  const latestCard = drawnCards[0];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Mazo espanol</Text>
          <Text style={styles.title}>POC Cartas</Text>
          <Text style={styles.subtitle}>Toca el mazo para desapilar, mover y revelar la carta superior.</Text>
        </View>

        <View style={styles.table}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <View style={styles.playArea}>
              <View style={styles.slot}>
                <DeckStack remaining={deck.cards.length} disabled={loading} onDraw={handleDraw} />
                <Text style={styles.counter}>{deck.cards.length} en mazo</Text>
              </View>

              <View style={styles.slot}>
                {latestCard ? (
                  <AnimatedDrawnCard card={latestCard} />
                ) : (
                  <View style={styles.emptyDiscard}>
                    <Text style={styles.emptyText}>Carta revelada</Text>
                  </View>
                )}
                <Text style={styles.counter}>{drawnCards.length} reveladas</Text>
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
    width: "100%",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10
  },
  slot: {
    minWidth: 160,
    alignItems: "center",
    gap: 14
  },
  counter: {
    color: "#EAF8F4",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14
  },
  emptyDiscard: {
    width: 156,
    height: 224,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14
  }
});
