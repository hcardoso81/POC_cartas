import type { Card, SpanishSuit } from "../domain/Card";
import type { Deck } from "../domain/Deck";

const suits: SpanishSuit[] = ["oro", "copa", "basto", "espada"];
const ranksByDeckSize = {
  40: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
  50: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
} as const;

export type DeckSize = keyof typeof ranksByDeckSize;

export function createSpanishDeck(deckSize: DeckSize = 40): Deck {
  const ranks = ranksByDeckSize[deckSize];
  const cards: Card[] = suits.flatMap((suit) =>
    ranks.map((rank) => {
      return {
        id: `${suit}-${rank}`,
        kind: "spanish" as const,
        suit,
        rank
      };
    })
  );

  if (deckSize === 50) {
    cards.push(
      { id: "joker-red", kind: "joker", variant: "red" },
      { id: "joker-blue", kind: "joker", variant: "blue" }
    );
  }

  return { cards };
}

export function shuffleDeck(deck: Deck): Deck {
  const cards = [...deck.cards];

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return { cards };
}
