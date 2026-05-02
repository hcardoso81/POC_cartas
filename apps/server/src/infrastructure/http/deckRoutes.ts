import { Router } from "express";
import { cardToDto } from "../../core/mappers/cardMapper.js";
import { createSpanishDeck, type DeckSize } from "../../core/use-cases/createSpanishDeck.js";

export const deckRoutes = Router();

deckRoutes.get("/deck", (request, response) => {
  const requestedSize = Number(request.query.size);
  const deckSize: DeckSize = requestedSize === 50 ? 50 : 40;
  const deck = createSpanishDeck(deckSize);

  response.json({
    cards: deck.cards.map(cardToDto)
  });
});
