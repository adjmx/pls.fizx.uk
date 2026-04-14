import { useQuery } from '@tanstack/react-query';

export interface RelayInfo {
  name?: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
  limitation?: {
    max_message_length?: number;
    max_subscriptions?: number;
    max_filters?: number;
    max_limit?: number;
    max_subid_length?: number;
    max_event_tags?: number;
    max_content_length?: number;
    min_pow_difficulty?: number;
    auth_required?: boolean;
    payment_required?: boolean;
    restricted_writes?: boolean;
    created_at_lower_limit?: number;
    created_at_upper_limit?: number;
  };
  relay_countries?: string[];
  language_tags?: string[];
  tags?: string[];
  icon?: string;
  payments_url?: string;
}

async function fetchRelayInfo(wsUrl: string): Promise<RelayInfo> {
  const url = wsUrl.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
  const res = await fetch(url, {
    headers: { Accept: 'application/nostr+json' },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function useRelayInfo(wsUrl: string) {
  return useQuery<RelayInfo>({
    queryKey: ['relay-nip11', wsUrl],
    queryFn: () => fetchRelayInfo(wsUrl),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
