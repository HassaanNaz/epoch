// src/supabaseService.ts
import { supabase } from './supabaseClient';
import { HistoricalEvent, GameMode } from './types';
import { LeaderboardEntry } from './types';

type EventRow = {
  id: number;
  event_name: string;
  year: number;
  description: string | null;
  era: string | null;
  fun_fact: string | null;
};

function pickRandomIndices(max: number, count = 1): number[] {
  const indices = new Set<number>();
  while (indices.size < Math.min(count, max)) {
    indices.add(Math.floor(Math.random() * max));
  }
  return Array.from(indices);
}

function mapRowToHistoricalEvent(r: EventRow): HistoricalEvent {
  return {
    id: r.id,
    eventName: r.event_name,
    year: r.year,
    description: r.description ?? '',
    era: r.era ?? '',
    funFact: r.fun_fact ?? '',
  } as HistoricalEvent;
}

/**
 * Fetch candidates for the given mode.
 * Use explicit selects to avoid depending on optional DB columns.
 */
async function fetchCandidatesForMode(mode: GameMode, limit = 200): Promise<EventRow[]> {
  const currentYear = new Date().getFullYear();

  // Helper to run a query and return data or throw
  async function runQuery(query: any) {
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as EventRow[];
  }

  try {
    if (mode === 'modern') {
      return await runQuery(
        supabase
          .from<EventRow>('events')
          .select('id,event_name,year,description,era,fun_fact')
          .gte('year', 1900)
          .lte('year', currentYear)
          .limit(limit)
      );
    }

    if (mode === 'ancient') {
      return await runQuery(
        supabase
          .from<EventRow>('events')
          .select('id,event_name,year,description,era,fun_fact')
          .lte('year', 500)
          .limit(limit)
      );
    }

    // blitz and default: fetch a wide sample without relying on optional columns
    return await runQuery(
      supabase
        .from<EventRow>('events')
        .select('id,event_name,year,description,era,fun_fact')
        .limit(limit)
    );
  } catch (err) {
    console.error('Supabase fetchCandidatesForMode error', err);
    throw err;
  }
}

/**
 * Return two distinct events (pair) for the initial pairing.
 * Attempts to ensure they are at least ~10 years apart when possible.
 */
export async function fetchEventPair(mode: GameMode): Promise<[HistoricalEvent, HistoricalEvent]> {
  const candidates = await fetchCandidatesForMode(mode, 400);

  if (!candidates || candidates.length < 2) {
    throw new Error('Not enough events in DB to generate a pair.');
  }

  // Try a few times to pick a pair with >= 10 years difference; otherwise return any two distinct.
  const maxTries = 50;
  for (let i = 0; i < maxTries; i++) {
    const [i1, i2] = pickRandomIndices(candidates.length, 2);
    if (i1 === i2) continue;
    const a = candidates[i1];
    const b = candidates[i2];
    if (typeof a.year !== 'number' || typeof b.year !== 'number') continue;
    if (Math.abs(a.year - b.year) >= 10) {
      return Math.random() > 0.5 ? [mapRowToHistoricalEvent(a), mapRowToHistoricalEvent(b)] : [mapRowToHistoricalEvent(b), mapRowToHistoricalEvent(a)];
    }
  }

  // fallback: pick any two distinct
  const [idx1, idx2] = pickRandomIndices(candidates.length, 2);
  return [mapRowToHistoricalEvent(candidates[idx1]), mapRowToHistoricalEvent(candidates[idx2])];
}

/**
 * Fetch a single random event for the next round.
 * excludeYears optionally prevents selecting events with those exact years.
 */
export async function fetchRandomEvent(mode: GameMode, score: number, excludeYears: number[] = []): Promise<HistoricalEvent> {
  const candidates = await fetchCandidatesForMode(mode, 400);

  const usable = (candidates ?? []).filter(c => typeof c.year === 'number' && c.event_name);
  if (usable.length === 0) {
    throw new Error('No usable events returned from DB.');
  }

  // filter out excluded years
  const filtered = usable.filter(c => !excludeYears.includes(c.year));

  const pool = filtered.length > 0 ? filtered : usable;
  const index = Math.floor(Math.random() * pool.length);
  return mapRowToHistoricalEvent(pool[index]);
}

/**
 * Leaderboard helpers: load top N and save an entry.
 * Use explicit selects for stability.
 */
export async function loadLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from<LeaderboardEntry>('leaderboard')
    .select('name, mode, score')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase loadLeaderboard error', error);
    return [];
  }
  return (data ?? []).map(d => ({
    name: d.name,
    score: d.score,
    mode: d.mode,
    date: d.date,
  }));
}

export async function saveLeaderboardEntry(entry: LeaderboardEntry): Promise<LeaderboardEntry | null> {
  // If your leaderboard table doesn't have 'date' as a column, remove it here or make it optional
  const insertPayload: any = {
    name: entry.name,
    score: entry.score,
    mode: entry.mode,
  };

  const { data, error } = await supabase.from('leaderboard').insert(insertPayload).select().single();

  if (error) {
    console.error('Supabase saveLeaderboardEntry error', error);
    return null;
  }

  return {
    name: data.name,
    score: data.score,
    mode: data.mode,
    date: data.date,
  } as LeaderboardEntry;
}
