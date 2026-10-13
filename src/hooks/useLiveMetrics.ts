import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/format';
import type { LivePoint } from '@/types';

interface Options {
  /** Cada cuánto llega un dato nuevo (ms). */
  intervalMs?: number;
  /** Puntos visibles en la ventana deslizante. */
  maxPoints?: number;
  paused?: boolean;
}

const BASELINE = 240;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function nextPoint(prev: LivePoint | undefined, time: number): LivePoint {
  const last = prev?.visitors ?? BASELINE;
  // Paseo aleatorio que tiende a volver a la media (no se dispara ni cae a 0).
  const visitors = Math.round(
    Math.min(420, Math.max(80, last + (BASELINE - last) * 0.15 + rand(-28, 28))),
  );
  return {
    time,
    label: formatTime(time),
    visitors,
    ordersPerMinute: Math.round(visitors * rand(0.025, 0.04) * 10) / 10,
  };
}

function seedHistory(count: number, intervalMs: number): LivePoint[] {
  const now = Date.now();
  const points: LivePoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    points.push(nextPoint(points[points.length - 1], now - i * intervalMs));
  }
  return points;
}

/**
 * Simula métricas en tiempo real: genera un punto nuevo cada `intervalMs`.
 *
 * 🔌 Con un backend real, sustituye el setInterval por una suscripción, por ejemplo:
 *   const ws = new WebSocket(`${import.meta.env.VITE_API_URL}/live`);
 *   ws.onmessage = (e) => setPoints((prev) => [...prev.slice(-(maxPoints - 1)), JSON.parse(e.data)]);
 *   return () => ws.close();
 * (o EventSource para Server-Sent Events).
 */
export function useLiveMetrics({
  intervalMs = 3000,
  maxPoints = 20,
  paused = false,
}: Options = {}) {
  const [points, setPoints] = useState<LivePoint[]>(() => seedHistory(maxPoints, intervalMs));

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setPoints((prev) => [
        ...prev.slice(-(maxPoints - 1)),
        nextPoint(prev[prev.length - 1], Date.now()),
      ]);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, intervalMs, maxPoints]);

  const latest = points[points.length - 1]!;
  const previous = points[points.length - 2] ?? latest;

  return {
    points,
    latest,
    previous,
    /** Diferencia de visitantes respecto al dato anterior. */
    delta: latest.visitors - previous.visitors,
  };
}
