import type { Card } from "../domain/Card";

export type CardDto =
  | {
      id: string;
      kind: "spanish";
      suit: "oro" | "copa" | "basto" | "espada";
      rank: number;
    }
  | {
      id: string;
      kind: "joker";
      variant: "red" | "blue";
    };

export function cardFromDto(dto: CardDto): Card {
  return dto;
}

export function cardToDto(card: Card): CardDto {
  return card;
}
