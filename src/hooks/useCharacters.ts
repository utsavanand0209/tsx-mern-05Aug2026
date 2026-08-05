import { useEffect, useState } from 'react';
import { getAllPeople, getSpecies, idFromUrl, ApiError } from '../api/swapi';
import { picsumUrl } from '../utils/format';
import type { PersonWithMeta } from '../types';

export interface EnrichedPerson extends PersonWithMeta {
  speciesName: string;
}

interface UseCharactersResult {
  characters: EnrichedPerson[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCharacters(): UseCharactersResult {
  const [characters, setCharacters] = useState<EnrichedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const speciesCache = new Map<string, string>();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const people = await getAllPeople();

        const enriched = await Promise.all(
          people.map(async (person) => {
            const id = idFromUrl(person.url);
            let speciesName = 'Human';

            if (person.species.length > 0) {
              const speciesUrl = person.species[0];
              if (speciesCache.has(speciesUrl)) {
                speciesName = speciesCache.get(speciesUrl)!;
              } else {
                try {
                  const species = await getSpecies(speciesUrl);
                  speciesName = species.name;
                  speciesCache.set(speciesUrl, speciesName);
                } catch {
                  speciesName = 'Unknown';
                }
              }
            }

            const result: EnrichedPerson = {
              ...person,
              id,
              imageUrl: picsumUrl(id),
              speciesName,
            };
            return result;
          })
        );

        if (!cancelled) {
          setCharacters(enriched);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Something went wrong while loading characters.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refetch = () => setVersion((v) => v + 1);

  return { characters, loading, error, refetch };
}
