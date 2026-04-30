import type { Card } from "../domain/Card.js";

export type CardDto = Card;

export function cardToDto(card: Card): CardDto {
  return card;
}
