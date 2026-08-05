import type { Person, Planet, Species } from '../types';

const BASE_URL = 'https://swapi.info/api';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError('Network error: unable to reach the server. Please check your connection.');
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('Received an invalid response from the server.');
  }
}

/** SWAPI.info serves the full collection in one payload (no server-side paging),
 *  so pagination is implemented client-side once the list is fetched. */
export function getAllPeople(): Promise<Person[]> {
  return fetchJson<Person[]>(`${BASE_URL}/people`);
}

export function getPlanet(url: string): Promise<Planet> {
  return fetchJson<Planet>(url);
}

export function getSpecies(url: string): Promise<Species> {
  return fetchJson<Species>(url);
}

/** Extracts the numeric id from a SWAPI resource URL, e.g. `.../people/4` -> "4" */
export function idFromUrl(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : url;
}
