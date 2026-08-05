# Star Wars Character Directory

A React + TypeScript app that browses Star Wars characters from [SWAPI.info](https://swapi.info/api/people), with client-side pagination, species-based card coloring, hover animations, a details modal (with homeworld lookup), search, and species filtering.

**Live demo:** _add your Netlify/Vercel URL here_
**Video walkthrough:** _add your Drive/YouTube link here_

## Features

- **List view** — fetches all characters from `/people` and paginates client-side (12 per page), since the API returns the full collection in one payload rather than paging server-side.
- **Loading & error states** — a loader while fetching/refetching, and a dedicated error state with a Retry button if the API is unreachable.
- **Character cards** — each card shows the character's name and a stable "random" picture from Picsum (seeded per character, so it doesn't change on every re-render), colored by species, with a hover lift/glow animation.
- **Details modal** — clicking a card opens a modal with name, height (converted to meters), mass (kg), date added to the API (`dd-MM-yyyy`), number of films, and birth year. It also fetches and displays the character's homeworld (name, terrain, climate, population).
- **Search & filter (bonus)** — search by name (partial match) and filter by species; both combine together.
- **Integration test (bonus)** — Vitest + React Testing Library test verifying the modal opens with the correct character's data (and that switching characters doesn't leak stale data).

> Note: JWT auth (bonus #2) was left out to keep scope focused and ship a polished, well-tested core experience — happy to add a mocked login/silent-refresh flow if useful for the next round.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest + React Testing Library

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run test      # run the integration test suite
```

## Project structure

```
src/
  api/swapi.ts          # fetch wrapper + typed API calls, central error handling
  hooks/useCharacters.ts # loads people, resolves species names, builds view models
  components/            # CharacterCard, CharacterModal, SearchFilter, Pagination, Loader, ErrorState
  utils/format.ts        # unit conversion, date formatting, species color mapping
  test/                  # Vitest setup + integration test
```

## Design notes

- Dark "archive terminal" aesthetic (monospace labels, amber accent) to fit a Star Wars data-terminal feel without leaning on any licensed art or fonts.
- Each species gets a deterministic accent color (hashed from the species name) so the same species always renders the same color across sessions.
- Accessibility: modal traps focus on open, closes on `Escape` or backdrop click, uses `role="dialog"`/`aria-modal`, and all interactive elements have visible focus states. Reduced-motion is respected.

## Screenshots

### Character Grid
![Character grid — dark archive-terminal aesthetic with species-coloured card borders](public/screenshot-grid.png)

### Hover State
![Card hover — lift + purple glow effect on Luke Skywalker's card](public/screenshot-hover.png)

### Details Modal
![Details modal — Luke Skywalker with height, mass, birth year, films, and Tatooine homeworld data](public/screenshot-modal.png)
