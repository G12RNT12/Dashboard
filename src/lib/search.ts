/** Normaliza para buscar sin distinguir mayúsculas ni tildes ("electronica" encuentra "Electrónica"). */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/** true si la consulta aparece en alguno de los campos. */
export function matchesSearch(query: string, ...fields: Array<string | number>) {
  const q = normalize(query);
  if (!q) return true;
  return fields.some((f) => normalize(String(f)).includes(q));
}
