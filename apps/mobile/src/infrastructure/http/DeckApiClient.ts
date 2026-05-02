import type { CardDto } from "../../core/mappers/cardMapper";
import type { DeckSize } from "../../core/use-cases/createSpanishDeck";

export type DeckResponseDto = {
  cards: CardDto[];
};

export class DeckApiClient {
  constructor(private readonly baseUrl: string) {}

  async createDeck(deckSize: DeckSize = 40): Promise<DeckResponseDto> {
    const response = await fetch(`${this.baseUrl}/deck?size=${deckSize}`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Deck API returned ${response.status}`);
    }

    return response.json() as Promise<DeckResponseDto>;
  }
}
