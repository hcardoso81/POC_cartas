# POC_CARTAS - Agents Context

## Project Goal

Build a simple Expo + React Native proof of concept for animating a 50-card Spanish deck.

Initial behavior:
- The deck starts stacked face down.
- Tapping the top card removes it from the stack, moves it to the side, and flips it face up.
- The deck has 50 cards: suits Oro, Copa, Basto, Espada with ranks 1 through 12, plus 2 jokers.
- Card backs should feel traditional, using a blue or red pattern.
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

## Product Notes

Spanish suits:
- Oro: gold coin / medallion.
- Copa: goblet shape.
- Basto: wooden club.
- Espada: sword blade.

Deck:
- Cards are ordered and shuffled by the backend/use case.
- Jokers are represented as `joker-red` and `joker-blue`.
- A drawn card should remain visible in the discard area.

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
