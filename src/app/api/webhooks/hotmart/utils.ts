import { timingSafeEqual } from 'crypto';

/** Compara dois strings em tempo constante para evitar timing attacks. */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export type PlanInterval = 'mensal' | 'trimestral' | 'anual';

export function detectPlanInterval(planName?: string): PlanInterval {
  if (!planName) return 'mensal';
  const name = planName.toLowerCase();
  if (name.includes('anual') || name.includes('annual') || name.includes('12')) return 'anual';
  if (name.includes('trimestral') || name.includes('quarterly') || name.includes('3 mes') || name.includes('3mes')) return 'trimestral';
  return 'mensal';
}

export function calcExpiresAt(interval: PlanInterval): string {
  const DAYS: Record<PlanInterval, number> = {
    mensal: 35,
    trimestral: 95,
    anual: 370,
  };
  return new Date(Date.now() + DAYS[interval] * 24 * 60 * 60 * 1000).toISOString();
}
