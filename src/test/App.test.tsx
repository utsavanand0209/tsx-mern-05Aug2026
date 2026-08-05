import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const mockPeople = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.info/api/planets/1',
    films: ['https://swapi.info/api/films/1', 'https://swapi.info/api/films/2'],
    species: [],
    vehicles: [],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.info/api/people/1',
  },
  {
    name: 'C-3PO',
    height: '167',
    mass: '75',
    hair_color: 'n/a',
    skin_color: 'gold',
    eye_color: 'yellow',
    birth_year: '112BBY',
    gender: 'n/a',
    homeworld: 'https://swapi.info/api/planets/1',
    films: ['https://swapi.info/api/films/1'],
    species: ['https://swapi.info/api/species/2'],
    vehicles: [],
    starships: [],
    created: '2014-12-10T15:10:51.048000Z',
    edited: '2014-12-20T21:17:50.309000Z',
    url: 'https://swapi.info/api/people/2',
  },
];

const mockPlanet = {
  name: 'Tatooine',
  climate: 'arid',
  terrain: 'desert',
  population: '200000',
  url: 'https://swapi.info/api/planets/1',
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (url.includes('/people')) {
        return { ok: true, json: async () => mockPeople } as Response;
      }
      if (url.includes('/planets/1')) {
        return { ok: true, json: async () => mockPlanet } as Response;
      }
      if (url.includes('/species/2')) {
        return { ok: true, json: async () => ({ name: 'Droid', url }) } as Response;
      }
      return { ok: false, status: 404, json: async () => ({}) } as Response;
    })
  );
});

describe('Character modal', () => {
  it('opens with the correct person information when a card is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const lukeCard = await screen.findByRole('button', { name: /luke skywalker/i });
    await user.click(lukeCard);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();

    // height 172cm -> 1.72 m
    expect(within(dialog).getByText('1.72 m')).toBeInTheDocument();
    // mass 77 -> "77 kg"
    expect(within(dialog).getByText('77 kg')).toBeInTheDocument();
    // birth year
    expect(within(dialog).getByText('19BBY')).toBeInTheDocument();
    // films count
    expect(within(dialog).getByText('2')).toBeInTheDocument();
    // created date formatted dd-MM-yyyy
    expect(within(dialog).getByText('09-12-2014')).toBeInTheDocument();

    // homeworld resolves and renders
    expect(await within(dialog).findByText('Tatooine')).toBeInTheDocument();
    expect(within(dialog).getByText('arid')).toBeInTheDocument();
  });

  it('opens a different character with its own details, not a stale previous one', async () => {
    const user = userEvent.setup();
    render(<App />);

    const c3po = await screen.findByRole('button', { name: /c-3po/i });
    await user.click(c3po);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'C-3PO' })).toBeInTheDocument();
    expect(within(dialog).getByText('1.67 m')).toBeInTheDocument();
    expect(within(dialog).getByText('Droid')).toBeInTheDocument();
  });
});
