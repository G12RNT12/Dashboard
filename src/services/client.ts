/**
 * Cliente HTTP de la app.
 *
 * - `simulateRequest` imita una API: espera 400–900 ms y, opcionalmente, falla
 *   (VITE_MOCK_ERROR_RATE) para poder ver los estados de error.
 * - `apiGet` es el cliente real que se usará cuando exista backend.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? '';
const ERROR_RATE = Number(import.meta.env.VITE_MOCK_ERROR_RATE ?? 0) || 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Envuelve un generador síncrono en una "petición" con latencia aleatoria. */
export async function simulateRequest<T>(producer: () => T): Promise<T> {
  await sleep(400 + Math.random() * 500);
  if (Math.random() < ERROR_RATE) {
    throw new ApiError('El servidor no respondió a tiempo.', 503);
  }
  return producer();
}

/**
 * Petición GET a la API real.
 * Ejemplo: apiGet<Kpi[]>('/kpis', { range: '30d' }) → GET {VITE_API_URL}/kpis?range=30d
 */
export async function apiGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(path, API_URL || window.location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    // credentials: 'include', // ← si la API usa cookies de sesión
  });
  if (!res.ok) {
    throw new ApiError(`La API respondió ${res.status} en ${path}.`, res.status);
  }
  return (await res.json()) as T;
}
