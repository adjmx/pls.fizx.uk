import { useQuery } from '@tanstack/react-query';
import { useRelayInfo } from './useRelayInfo';

export interface RelayNip05Result {
  verifiedNames: string[];   // e.g. ["xplbzx@fizx.uk"]
  pubkey: string;
  domain: string;
  contact?: string;
}

export function useRelayNip05(relayWsUrl: string) {
  const { data: info, isLoading: infoLoading } = useRelayInfo(relayWsUrl);
  const domain = relayWsUrl.replace(/^wss?:\/\//, '').replace(/\/.*$/, '');

  const query = useQuery<RelayNip05Result>({
    queryKey: ['relay-nip05', domain, info?.pubkey],
    enabled: !!info?.pubkey,
    queryFn: async () => {
      const pubkey = info!.pubkey!;
      const res = await fetch(`https://${domain}/.well-known/nostr.json`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error('failed');
      const data: { names: Record<string, string> } = await res.json();
      const verifiedNames = Object.entries(data.names)
        .filter(([, pk]) => pk === pubkey)
        .map(([name]) => `${name}@${domain}`);
      return { verifiedNames, pubkey, domain, contact: info?.contact };
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  // In TanStack Query v5, isLoading = isPending && isFetching.
  // A disabled query (enabled:false, no data) has isPending=true but isFetching=false,
  // so isLoading=false — callers would see no data without a loading signal.
  // Expose a combined flag so the UI can show a spinner until both NIP-11 and
  // NIP-05 have resolved.
  return { ...query, isLoading: infoLoading || query.isPending };
}
