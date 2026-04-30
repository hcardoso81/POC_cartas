import { DeckApiClient } from "../http/DeckApiClient";
import { FallbackDeckRepository, RestDeckRepository } from "./DeckRepository";

const defaultApiUrl = "http://localhost:4000";

export function createDeckRepository() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl;
  return new FallbackDeckRepository(new RestDeckRepository(new DeckApiClient(apiUrl)));
}
