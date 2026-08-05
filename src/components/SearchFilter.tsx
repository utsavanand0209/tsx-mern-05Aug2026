interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  speciesOptions: string[];
  species: string;
  onSpeciesChange: (value: string) => void;
}

export default function SearchFilter({
  search,
  onSearchChange,
  speciesOptions,
  species,
  onSpeciesChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">
          Search characters by name
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name…"
          className="w-full rounded-md border border-[#2a2f3a] bg-[#12151c] px-4 py-2.5 text-[#e5e7eb] placeholder:text-[#5c6270] focus:border-[#E0B84B] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="species-filter" className="sr-only">
          Filter by species
        </label>
        <select
          id="species-filter"
          value={species}
          onChange={(e) => onSpeciesChange(e.target.value)}
          className="w-full rounded-md border border-[#2a2f3a] bg-[#12151c] px-4 py-2.5 text-[#e5e7eb] focus:border-[#E0B84B] focus:outline-none sm:w-56"
        >
          <option value="">All species</option>
          {speciesOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
