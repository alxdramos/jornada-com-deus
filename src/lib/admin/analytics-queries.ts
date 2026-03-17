/**
 * Analytics queries — lê da tabela analytics_events via service role.
 * NUNCA importar em Client Components.
 */
import { supabaseAdmin } from '@/lib/supabase';

export interface TopContentItem {
  id: string;
  title: string;
  count: number;
}

export interface PaywallFunnel {
  shown: number;
  clicked: number;
  conversionRate: number;
}

export interface FeatureEngagement {
  feature: string;
  uniqueUsers: number;
}

// ── Top meditações mais iniciadas (últimos 30 dias) ───────────────────────────
export async function getTopMeditations(limit = 5): Promise<TopContentItem[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseAdmin
    .from('analytics_events')
    .select('properties')
    .eq('event_name', 'meditation_started')
    .gte('created_at', thirtyDaysAgo);

  if (!data || data.length === 0) return [];

  const counts = (data as { properties: { id?: string; title?: string } }[]).reduce(
    (acc, row) => {
      const id = row.properties?.id ?? 'unknown';
      const title = row.properties?.title ?? id;
      if (!acc[id]) acc[id] = { id, title, count: 0 };
      acc[id].count++;
      return acc;
    },
    {} as Record<string, TopContentItem>
  );

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ── Top orações mais iniciadas (últimos 30 dias) ──────────────────────────────
export async function getTopPrayers(limit = 5): Promise<TopContentItem[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseAdmin
    .from('analytics_events')
    .select('properties')
    .eq('event_name', 'prayer_started')
    .gte('created_at', thirtyDaysAgo);

  if (!data || data.length === 0) return [];

  const counts = (data as { properties: { id?: string; title?: string } }[]).reduce(
    (acc, row) => {
      const id = row.properties?.id ?? 'unknown';
      const title = row.properties?.title ?? id;
      if (!acc[id]) acc[id] = { id, title, count: 0 };
      acc[id].count++;
      return acc;
    },
    {} as Record<string, TopContentItem>
  );

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ── Funil do Paywall (últimos 30 dias) ────────────────────────────────────────
export async function getPaywallFunnel(): Promise<PaywallFunnel> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [shownResult, clickedResult] = await Promise.all([
    supabaseAdmin
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'paywall_shown')
      .gte('created_at', thirtyDaysAgo),
    supabaseAdmin
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'purchase_clicked')
      .gte('created_at', thirtyDaysAgo),
  ]);

  const shown = shownResult.count ?? 0;
  const clicked = clickedResult.count ?? 0;
  const conversionRate = shown > 0 ? parseFloat(((clicked / shown) * 100).toFixed(1)) : 0;

  return { shown, clicked, conversionRate };
}

// ── Engajamento por feature (últimos 30 dias, usuários únicos) ────────────────
export async function getFeatureEngagement(): Promise<FeatureEngagement[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const events = ['meditation_started', 'prayer_started', 'paywall_shown'];

  const results = await Promise.all(
    events.map((event_name) =>
      supabaseAdmin
        .from('analytics_events')
        .select('user_id')
        .eq('event_name', event_name)
        .gte('created_at', thirtyDaysAgo)
        .not('user_id', 'is', null)
    )
  );

  const labels: Record<string, string> = {
    meditation_started: 'Meditações',
    prayer_started: 'Orações',
    paywall_shown: 'Paywall',
  };

  return events.map((event_name, i) => {
    const rows = results[i].data ?? [];
    const uniqueUsers = new Set(rows.map((r: { user_id: string }) => r.user_id)).size;
    return { feature: labels[event_name], uniqueUsers };
  });
}
