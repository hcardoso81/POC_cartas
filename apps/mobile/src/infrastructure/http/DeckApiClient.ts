import type { CardDto } from "../../core/mappers/cardMapper";

export type DeckResponseDto = {
  cards: CardDto[];
};

export class DeckApiClient {
  constructor(private readonly baseUrl: string) {}

  async createDeck(): Promise<DeckResponseDto> {
    const response = await fetch(`${this.baseUrl}/deck`, {
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
