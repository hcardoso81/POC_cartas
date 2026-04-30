import type { Deck, DrawResult } from "../domain/Deck";

export function drawTopCard(deck: Deck): DrawResult {
  const [drawnCard, ...remainingCards] = deck.cards;

  return {
    deck: { cards: remainingCards },
    drawnCard: drawnCard ?? null
  };
}
