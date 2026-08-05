import { useMemo, useState } from 'react';
import { useCharacters, type EnrichedPerson } from './hooks/useCharacters';
import CharacterCard from './components/CharacterCard';
import CharacterModal from './components/CharacterModal';
import Loader from './components/Loader';
import ErrorState from './components/ErrorState';
import Pagination from './components/Pagination';
import SearchFilter from './components/SearchFilter';

const PAGE_SIZE = 12;

export default function App() {
  const { characters, loading, error, refetch } = useCharacters();
  const [selected, setSelected] = useState<EnrichedPerson | null>(null);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [page, setPage] = useState(1);

  const speciesOptions = useMemo(() => {
    const set = new Set(characters.map((c) => c.speciesName));
    return Array.from(set).sort();
  }, [characters]);

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesSpecies = speciesFilter === '' || c.speciesName === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [characters, search, speciesFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSpeciesChange(value: string) {
    setSpeciesFilter(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e5e7eb]">
      <header className="border-b border-[#22262f] bg-[#0d0f14]/95 px-6 py-6 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E0B84B]">Archive Terminal // People</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Star Wars Character Directory</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!loading && !error && (
          <div className="mb-6">
            <SearchFilter
              search={search}
              onSearchChange={handleSearchChange}
              speciesOptions={speciesOptions}
              species={speciesFilter}
              onSpeciesChange={handleSpeciesChange}
            />
          </div>
        )}

        {loading && <Loader />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <p className="py-24 text-center font-mono text-sm uppercase tracking-widest text-[#8b93a7]">
                No records match your search.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((person) => (
                  <CharacterCard key={person.id} person={person} onSelect={setSelected} />
                ))}
              </div>
            )}

            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      {selected && <CharacterModal person={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
