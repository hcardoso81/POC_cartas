export type SpanishSuit = "oro" | "copa" | "basto" | "espada";

export type CardKind = "spanish" | "joker";

export type SpanishCard = {
  id: string;
  kind: "spanish";
  suit: SpanishSuit;
  rank: number;
};

export type JokerCard = {
  id: string;
  kind: "joker";
  variant: "red" | "blue";
};

export type Card = SpanishCard | JokerCard;

export const suitLabels: Record<SpanishSuit, string> = {
  oro: "Oro",
  copa: "Copa",
  basto: "Basto",
  espada: "Espada"
};
