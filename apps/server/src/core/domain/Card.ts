export type SpanishSuit = "oro" | "copa" | "basto" | "espada";

export type Card =
  | {
      id: string;
      kind: "spanish";
      suit: SpanishSuit;
      rank: number;
    }
  | {
      id: string;
      kind: "joker";
      variant: "red" | "blue";
    };

export type Deck = {
  cards: Card[];
};
