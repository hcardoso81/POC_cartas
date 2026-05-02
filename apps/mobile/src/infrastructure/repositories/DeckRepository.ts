import type { Deck } from "../../core/domain/Deck";
import { createSpanishDeck, type DeckSize, shuffleDeck } from "../../core/use-cases/createSpanishDeck";
import { cardFromDto } from "../../core/mappers/cardMapper";
import { DeckApiClient } from "../http/DeckApiClient";

export interface DeckRepository {
  createDeck(deckSize?: DeckSize): Promise<Deck>;
}

export class RestDeckRepository implements DeckRepository {
  constructor(private readonly client: DeckApiClient) {}

  async createDeck(deckSize: DeckSize = 40): Promise<Deck> {
    const dto = await this.client.createDeck(deckSize);
    return {
      cards: dto.cards.map(cardFromDto)
    };
  }
}

export class FallbackDeckRepository implements DeckRepository {
  constructor(private readonly primary: DeckRepository) {}

  async createDeck(deckSize: DeckSize = 40): Promise<Deck> {
    try {
      return await this.primary.createDeck(deckSize);
    } catch {
      return shuffleDeck(createSpanishDeck(deckSize));
    }
  }
}
