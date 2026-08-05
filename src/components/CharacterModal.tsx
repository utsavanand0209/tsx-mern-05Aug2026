import { useEffect, useRef, useState } from 'react';
import { getPlanet, ApiError } from '../api/swapi';
import { heightToMeters, massToKg, formatDateDMY, colorForSpecies } from '../utils/format';
import type { EnrichedPerson } from '../hooks/useCharacters';
import type { Planet } from '../types';

interface CharacterModalProps {
  person: EnrichedPerson;
  onClose: () => void;
}

export default function CharacterModal({ person, onClose }: CharacterModalProps) {
  const [homeworld, setHomeworld] = useState<Planet | null>(null);
  const [homeworldError, setHomeworldError] = useState<string | null>(null);
  const [homeworldLoading, setHomeworldLoading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const accent = colorForSpecies(person.speciesName);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setHomeworldLoading(true);
    setHomeworldError(null);

    getPlanet(person.homeworld)
      .then((planet) => {
        if (!cancelled) setHomeworld(planet);
      })
      .catch((err) => {
        if (!cancelled) {
          setHomeworldError(err instanceof ApiError ? err.message : 'Could not load homeworld data.');
        }
      })
      .finally(() => {
        if (!cancelled) setHomeworldLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [person.homeworld]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#22262f] bg-[#12151c] shadow-2xl"
        style={{ borderTopColor: accent, borderTopWidth: 3 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#22262f] p-6">
          <h2 id="character-modal-title" className="text-2xl font-bold text-[#f1f2f6]">
            {person.name}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close details"
            className="rounded-md border border-[#2a2f3a] px-2 py-1 font-mono text-sm text-[#8b93a7] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style={{ '--accent': accent } as React.CSSProperties}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 p-6">
          <Field label="Height" value={heightToMeters(person.height)} />
          <Field label="Mass" value={massToKg(person.mass)} />
          <Field label="Birth year" value={person.birth_year} />
          <Field label="Films appeared in" value={String(person.films.length)} />
          <Field label="Added to API" value={formatDateDMY(person.created)} />
          <Field label="Species" value={person.speciesName} />
        </div>

        <div className="border-t border-[#22262f] p-6">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-[#8b93a7]">Homeworld</h3>
          {homeworldLoading && (
            <p className="font-mono text-sm text-[#8b93a7]" role="status">
              Loading homeworld…
            </p>
          )}
          {homeworldError && (
            <p className="text-sm text-[#CE6262]" role="alert">
              {homeworldError}
            </p>
          )}
          {homeworld && !homeworldLoading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <Field label="Name" value={homeworld.name} />
              <Field label="Climate" value={homeworld.climate} />
              <Field label="Terrain" value={homeworld.terrain} />
              <Field label="Residents" value={homeworld.population} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-[#8b93a7]">{label}</dt>
      <dd className="mt-1 text-[#e5e7eb]">{value}</dd>
    </div>
  );
}
