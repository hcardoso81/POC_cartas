import type { Card, Deck, SpanishSuit } from "../domain/Card.js";

const suits: SpanishSuit[] = ["oro", "copa", "basto", "espada"];

export function createSpanishDeck(): Deck {
  const cards: Card[] = suits.flatMap((suit) =>
    Array.from({ length: 12 }, (_, index) => ({
      id: `${suit}-${index + 1}`,
      kind: "spanish" as const,
      suit,
      rank: index + 1
    }))
  );

  cards.push(
    { id: "joker-red", kind: "joker", variant: "red" },
    { id: "joker-blue", kind: "joker", variant: "blue" }
  );

  return shuffleDeck({ cards });
}

function shuffleDeck(deck: Deck): Deck {
  const cards = [...deck.cards];

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return { cards };
}
