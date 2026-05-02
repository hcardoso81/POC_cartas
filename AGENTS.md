# POC_CARTAS - Agents Context

## Project Goal

Build a simple Expo + React Native proof of concept for animating a configurable Spanish deck.

Initial behavior:
- The deck starts stacked face down.
- Dragging from the deck takes the top card, removes it from the stack, and lets the user drop it anywhere on the table face down.
- Drawn cards stay where the user drops them, can be dragged again to reposition them on the table, and can be flipped by double clicking/tapping them.
- Table stacking order is interaction-driven: touching or dragging any table card brings it to the front so any card can cover any other card.
- The deck defaults to 40 cards: suits Oro, Copa, Basto, Espada with ranks 1 through 7, 10, 11, and 12.
- The app can switch to a 50-card deck: ranks 1 through 12 for each suit, plus 2 jokers.
- Changing between 40 and 50 cards must warn that table changes will be lost; confirming recreates the deck and clears the table.
- Card backs should feel traditional, using the same pattern in blue or red. Blue is the default.
- Settings live in the top-right menu and currently control card back color, face design, and deck size.
- The UI should feel fresh, modern, and mobile-first.

## Architecture

Use TypeScript and keep a hexagonal structure:

- `src/core/domain`: entities, value objects, domain rules.
- `src/core/mappers`: mapping between domain models and DTOs/view models.
- `src/core/use-cases`: application behavior, independent from UI and transport.
- `src/infrastructure`: REST clients, repositories, external services.
- `src/ui`: screens, components, hooks, theme, presentation logic.

Backend:
- `apps/server` is a small Node + Express REST backend.
- The mobile app calls REST through infrastructure adapters.
- The app may fall back to local use cases during development when the backend is unavailable.

Mobile:
- `apps/mobile` is an Expo app using React Native and TypeScript.
- Use `react-native-svg` for drawing custom Spanish-suit card faces.
- Use React Native animation primitives for the first prototype unless a stronger animation need appears.
- UI settings are screen-level state in `src/ui/screens/DeckScreen.tsx`; keep domain/use cases independent from presentation state.

## Product Notes

Spanish suits:
- Oro: gold coin / medallion.
- Copa: goblet shape.
- Basto: wooden club.
- Espada: sword blade.

Deck:
- Cards are ordered and shuffled by the backend/use case.
- `DeckSize` is `40 | 50` in both mobile and server deck creation use cases.
- 40-card decks exclude ranks 8 and 9 and exclude jokers.
- 50-card decks include ranks 8 and 9 and include `joker-red` and `joker-blue`.
- Jokers are represented as `joker-red` and `joker-blue`.
- A drawn card should remain visible face down at its table position until the user explicitly flips it; there is no fixed discard area for newly drawn cards.

Card visuals:
- Card faces are design-driven. Current face designs are registered in `apps/mobile/src/ui/card-designs/cardFaceDesigns.ts`.
- `modern` is the simpler proof-of-concept face.
- `traditional` tries to resemble a classic Spanish deck.
- In the traditional design, ranks 1 through 9 render the actual count of suit symbols.
- Rank 10 is Sota, rank 11 is Caballo, and rank 12 is Rey. These figures should keep the same base character composition while changing the carried suit symbol.
- Future themed decks, such as traditional image references or Star Wars-style cards, should plug in as another face design while preserving the same domain suits and ranks.

Card backs:
- Card backs are rendered in `apps/mobile/src/ui/components/CardBack.tsx` with `react-native-svg`.
- The current supported back colors are `blue` and `red`; both use the same pattern.

Generated files:
- Runtime logs (`*.log`) should be ignored by Git and should not be committed.

## Development Preferences

- Prefer small, typed domain objects and pure use cases.
- Keep UI state orchestration in hooks or screens, not inside domain code.
- Keep infrastructure replaceable: REST today, another transport later if needed.
- Avoid unrelated refactors.
- Use readable names in Spanish-facing concepts when it helps product clarity, but keep code APIs consistent in English.

## Suggested Commands

From the repo root:

```powershell
npm install
npm run mobile
npm run server
```

The mobile app expects the REST API at:

```text
EXPO_PUBLIC_API_URL=http://localhost:4000
```

On a physical device, replace `localhost` with the LAN IP of the development machine.
