import type { Deck } from "../../core/domain/Deck";
import { createSpanishDeck, shuffleDeck } from "../../core/use-cases/createSpanishDeck";
import { cardFromDto } from "../../core/mappers/cardMapper";
import { DeckApiClient } from "../http/DeckApiClient";

export interface DeckRepository {
  createDeck(): Promise<Deck>;
}

export class RestDeckRepository implements DeckRepository {
  constructor(private readonly client: DeckApiClient) {}

  async createDeck(): Promise<Deck> {
    const dto = await this.client.createDeck();
    return {
      cards: dto.cards.map(cardFromDto)
    };
  }
}

export class FallbackDeckRepository implements DeckRepository {
  constructor(private readonly primary: DeckRepository) {}

  async createDeck(): Promise<Deck> {
    try {
      return await this.primary.createDeck();
    } catch {
      return shuffleDeck(createSpanishDeck());
    }
  }
}
