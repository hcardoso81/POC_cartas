import { Router } from "express";
import { cardToDto } from "../../core/mappers/cardMapper.js";
import { createSpanishDeck } from "../../core/use-cases/createSpanishDeck.js";

export const deckRoutes = Router();

deckRoutes.get("/deck", (_request, response) => {
  const deck = createSpanishDeck();

  response.json({
    cards: deck.cards.map(cardToDto)
  });
});
