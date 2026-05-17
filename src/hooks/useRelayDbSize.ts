import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface RelayStats {
  db_bytes: number;
  event_count: number;
  updated: number;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

const QUERY_KEY = ['relay-stats'];

export function useRelayStats() {
  const queryClient = useQueryClient();

  const query = useQuery<RelayStats>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('https://relay.fizx.uk/relay-stats.json');
      if (!res.ok) throw new Error('failed');
      return res.json();
    },
    refetchInterval: 60 * 1000,
    staleTime: 50 * 1000,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  return { ...query, refetch };
}
