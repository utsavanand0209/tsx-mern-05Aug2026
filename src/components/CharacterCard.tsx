import { colorForSpecies } from '../utils/format';
import type { EnrichedPerson } from '../hooks/useCharacters';

interface CharacterCardProps {
  person: EnrichedPerson;
  onSelect: (person: EnrichedPerson) => void;
}

export default function CharacterCard({ person, onSelect }: CharacterCardProps) {
  const accent = colorForSpecies(person.speciesName);

  return (
    <button
      onClick={() => onSelect(person)}
      style={{ '--accent': accent } as React.CSSProperties}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#22262f] bg-[#12151c] text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_var(--accent)] focus-visible:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] transition-all duration-300 group-hover:h-[5px]"
        style={{ backgroundColor: accent }}
      />
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={person.imageUrl}
          alt={person.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-transparent opacity-70" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span
          className="w-fit rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: accent, backgroundColor: `${accent}22`, border: `1px solid ${accent}55` }}
        >
          {person.speciesName}
        </span>
        <h3 className="text-lg font-semibold text-[#f1f2f6] transition-colors group-hover:text-[var(--accent)]">
          {person.name}
        </h3>
      </div>
    </button>
  );
}
