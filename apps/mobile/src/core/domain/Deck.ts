import type { Card } from "./Card";

export type Deck = {
  cards: Card[];
};

export type DrawResult = {
  deck: Deck;
  drawnCard: Card | null;
};
