import type { Card, SpanishSuit } from "../domain/Card";
import type { Deck } from "../domain/Deck";

const suits: SpanishSuit[] = ["oro", "copa", "basto", "espada"];

export function createSpanishDeck(): Deck {
  const cards: Card[] = suits.flatMap((suit) =>
    Array.from({ length: 12 }, (_, index) => {
      const rank = index + 1;
      return {
        id: `${suit}-${rank}`,
        kind: "spanish" as const,
        suit,
        rank
      };
    })
  );

  cards.push(
    { id: "joker-red", kind: "joker", variant: "red" },
    { id: "joker-blue", kind: "joker", variant: "blue" }
  );

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
