import { useMemo, useState } from 'react';
import { useCharacters, type EnrichedPerson } from './hooks/useCharacters';
import CharacterCard from './components/CharacterCard';
import CharacterModal from './components/CharacterModal';
import Loader from './components/Loader';
import ErrorState from './components/ErrorState';
import Pagination from './components/Pagination';
import SearchFilter from './components/SearchFilter';
import LoginPage from './components/LoginPage';
import { useAuth } from './auth/AuthContext';

const PAGE_SIZE = 12;

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const { characters, loading, error, refetch } = useCharacters();
  const [selected, setSelected] = useState<EnrichedPerson | null>(null);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [page, setPage] = useState(1);

  // All hooks must be called unconditionally — guard lives in the JSX below.
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

  // Show login gate when not authenticated (after all hooks).
  if (!isAuthenticated) return <LoginPage />;

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e5e7eb]">
      <header className="border-b border-[#22262f] bg-[#0d0f14]/95 px-6 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E0B84B]">Archive Terminal // People</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Star Wars Character Directory</h1>
          </div>
          {/* Auth badge + logout */}
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-[#8b93a7] sm:block">
              {user?.username}
              {user?.role === 'admin' && (
                <span className="ml-1.5 rounded-full border border-[#E0B84B55] bg-[#E0B84B22] px-1.5 py-0.5 text-[10px] text-[#E0B84B]">
                  admin
                </span>
              )}
            </span>
            <button
              id="logout-btn"
              onClick={logout}
              className="rounded-lg border border-[#22262f] bg-[#12151c] px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-[#8b93a7] transition hover:border-[#CE6262] hover:text-[#CE6262]"
            >
              Sign out
            </button>
          </div>
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
