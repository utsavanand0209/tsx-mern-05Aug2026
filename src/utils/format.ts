/** Converts SWAPI height (cm, string) to meters, e.g. "172" -> "1.72 m" */
export function heightToMeters(heightCm: string): string {
  const n = Number(heightCm);
  if (Number.isNaN(n)) return 'Unknown';
  return `${(n / 100).toFixed(2)} m`;
}

/** Formats mass as kg, e.g. "77" -> "77 kg" */
export function massToKg(mass: string): string {
  const n = Number(mass);
  if (Number.isNaN(n)) return 'Unknown';
  return `${n.toLocaleString()} kg`;
}

/** Formats an ISO date string as dd-MM-yyyy */
export function formatDateDMY(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/** Deterministically picks a "random" but stable picsum image per character id. */
export function picsumUrl(id: string, seedSuffix = ''): string {
  return `https://picsum.photos/seed/swchar-${id}${seedSuffix}/400/400`;
}

/** Deterministic color assigned per species-group so a given species always
 *  renders the same accent color across the app. */
const SPECIES_PALETTE = [
  '#7C9885', // droid/human default - sage
  '#D97757', // terracotta
  '#5B8DBE', // steel blue
  '#C77DA6', // orchid
  '#E0B84B', // amber
  '#8E7CC3', // violet
  '#4FA593', // teal
  '#CE6262', // brick
];

export function colorForSpecies(speciesKey: string): string {
  let hash = 0;
  for (let i = 0; i < speciesKey.length; i++) {
    hash = (hash * 31 + speciesKey.charCodeAt(i)) >>> 0;
  }
  return SPECIES_PALETTE[hash % SPECIES_PALETTE.length];
}
