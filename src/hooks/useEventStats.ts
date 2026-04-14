import { useState, useEffect, useRef } from 'react';
import { useNostr } from './useNostr';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

export const KIND_LABELS: Record<number, string> = {
  0: 'Metadata',
  1: 'Short Note',
  2: 'Recommend Relay',
  3: 'Contacts',
  4: 'Encrypted DM',
  5: 'Deletion',
  6: 'Repost',
  7: 'Reaction',
  8: 'Badge Award',
  16: 'Generic Repost',
  40: 'Channel Create',
  41: 'Channel Metadata',
  42: 'Channel Message',
  43: 'Channel Hide',
  44: 'Channel Mute',
  1063: 'File Metadata',
  1984: 'Report',
  9735: 'Zap Receipt',
  9802: 'Highlight',
  10000: 'Mute List',
  10001: 'Pin List',
  10002: 'Relay List',
  10003: 'Bookmark List',
  10050: 'DM Relay List',
  13194: 'Wallet Info',
  22242: 'Client Auth',
  23194: 'Wallet Request',
  23195: 'Wallet Response',
  24133: 'Nostr Connect',
  27235: 'HTTP Auth',
  30000: 'Follow Sets',
  30001: 'Generic Lists',
  30002: 'Relay Sets',
  30003: 'Bookmark Sets',
  30008: 'Profile Badge',
  30009: 'Badge Definition',
  30023: 'Long-form Article',
  30024: 'Draft Long-form',
  30078: 'App-specific Data',
  30311: 'Live Event',
  30315: 'User Status',
  30402: 'Classified Listing',
  34550: 'Community',
};

export interface EventStats {
  /** Events seen since page load (live subscription) */
  liveTotal: number;
  /** Historical events from last hour */
  historicalTotal: number;
  /** Count per kind across both sources */
  byKind: Record<number, number>;
  /** Unique author pubkeys */
  uniqueAuthors: number;
  /** Live event rate (events/min, 60s rolling window) */
  eventsPerMinute: number;
  /** Most recent events for the feed */
  recentEvents: NostrEvent[];
}

const MAX_FEED = 10;
const RATE_WINDOW = 60; // seconds

export function useEventStats() {
  const { nostr } = useNostr();

  const [liveTotal, setLiveTotal] = useState(0);
  const [byKind, setByKind] = useState<Record<number, number>>({});
  const [uniqueAuthors, setUniqueAuthors] = useState(0);
  const [eventsPerMinute, setEventsPerMinute] = useState(0);
  const [recentEvents, setRecentEvents] = useState<NostrEvent[]>([]);

  const authorsRef = useRef(new Set<string>());
  const kindCountsRef = useRef<Record<number, number>>({});
  const rateBucketRef = useRef<number[]>([]);
  const pendingRef = useRef<NostrEvent[]>([]);
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Historical query: last hour sample for kind distribution seed
  const { data: historical } = useQuery<NostrEvent[]>({
    queryKey: ['relay-event-sample'],
    queryFn: ({ signal }) =>
      nostr.query(
        [{ since: Math.floor(Date.now() / 1000) - 3600, limit: 500 }],
        { signal: signal ?? AbortSignal.timeout(15000) }
      ),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Seed kind counts from historical query
  useEffect(() => {
    if (!historical) return;
    const counts: Record<number, number> = { ...kindCountsRef.current };
    const authors = authorsRef.current;
    historical.forEach(ev => {
      counts[ev.kind] = (counts[ev.kind] ?? 0) + 1;
      authors.add(ev.pubkey);
    });
    kindCountsRef.current = counts;
    setByKind({ ...counts });
    setUniqueAuthors(authors.size);
  }, [historical]);

  // Live subscription
  useEffect(() => {
    const ac = new AbortController();
    const since = Math.floor(Date.now() / 1000);
    let localTotal = 0;

    // Flush pending events to state every 400ms to batch renders
    flushRef.current = setInterval(() => {
      if (pendingRef.current.length === 0) return;
      const batch = pendingRef.current.splice(0);

      batch.forEach(ev => {
        kindCountsRef.current[ev.kind] = (kindCountsRef.current[ev.kind] ?? 0) + 1;
        authorsRef.current.add(ev.pubkey);
        const now = Date.now() / 1000;
        rateBucketRef.current.push(now);
        while (rateBucketRef.current.length > 0 && rateBucketRef.current[0] < now - RATE_WINDOW) {
          rateBucketRef.current.shift();
        }
      });

      localTotal += batch.length;
      setLiveTotal(lt => lt + batch.length);
      setByKind({ ...kindCountsRef.current });
      setUniqueAuthors(authorsRef.current.size);
      setEventsPerMinute(rateBucketRef.current.length);
      setRecentEvents(prev => [...batch.reverse(), ...prev].slice(0, MAX_FEED));
    }, 400);

    (async () => {
      try {
        for await (const msg of nostr.req([{ since }], { signal: ac.signal })) {
          if (msg[0] === 'CLOSED') break;
          if (msg[0] !== 'EVENT') continue;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pendingRef.current.push((msg as any)[2] as NostrEvent);
        }
      } catch (e) {
        if (!ac.signal.aborted) console.error('relay sub error', e);
      }
    })();

    return () => {
      ac.abort();
      if (flushRef.current) clearInterval(flushRef.current);
    };
  }, [nostr]);

  return {
    liveTotal,
    historicalTotal: historical?.length ?? 0,
    byKind,
    uniqueAuthors,
    eventsPerMinute,
    recentEvents,
  } as EventStats;
}
