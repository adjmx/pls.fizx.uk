import { useRelayInfo } from '@/hooks/useRelayInfo';
import { useEventStats, KIND_LABELS } from '@/hooks/useEventStats';
import { DISPLAY_RELAYS, STREAMING_RELAYS } from '@/config/relays';
import type { NostrEvent } from '@nostrify/nostrify';
import { formatDistanceToNowStrict } from 'date-fns';
import { Activity, Radio, Users, Layers, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ── 21-bar ────────────────────────────────────────────────────────────────────
const SQUARE_COUNT = 21;
const SQUARE_DIM = '#161e2e';
const EMERALD: [number, number, number] = [52, 211, 153];
const PURPLE:  [number, number, number] = [167, 139, 250];
function lerpHex(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
}
const SQUARE_COLORS = Array.from({ length: SQUARE_COUNT }, (_, i) => {
  const t = i < 10 ? i / 10 : (SQUARE_COUNT - 1 - i) / 10;
  return lerpHex(EMERALD, PURPLE, t);
});

// ── fizx 4×4 favicon block ────────────────────────────────────────────────────
const FizxLogo = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg" className={className ?? 'shrink-0'}>
    <rect x="0" y="0" width="1" height="1" fill="#34d399"/>
    <rect x="1" y="0" width="1" height="1" fill="#a78bfa"/>
    <rect x="2" y="0" width="1" height="1" fill="#34d399"/>
    <rect x="3" y="0" width="1" height="1" fill="#a78bfa"/>
    <rect x="0" y="1" width="1" height="1" fill="#a78bfa"/>
    <rect x="1" y="1" width="1" height="1" fill="#34d399"/>
    <rect x="2" y="1" width="1" height="1" fill="#a78bfa"/>
    <rect x="3" y="1" width="1" height="1" fill="#34d399"/>
    <rect x="0" y="2" width="1" height="1" fill="#34d399"/>
    <rect x="1" y="2" width="1" height="1" fill="#a78bfa"/>
    <rect x="2" y="2" width="1" height="1" fill="#34d399"/>
    <rect x="3" y="2" width="1" height="1" fill="#a78bfa"/>
    <rect x="0" y="3" width="1" height="1" fill="#a78bfa"/>
    <rect x="1" y="3" width="1" height="1" fill="#34d399"/>
    <rect x="2" y="3" width="1" height="1" fill="#a78bfa"/>
    <rect x="3" y="3" width="1" height="1" fill="#34d399"/>
  </svg>
);

// ── Relay comparison card ─────────────────────────────────────────────────────
// Each column is its own component so hooks are called unconditionally.

function RelayColumn({ url }: { url: string }) {
  const { data: info, isLoading, isError } = useRelayInfo(url);
  const domain = url.replace(/^wss?:\/\//, '');

  return (
    <div className="flex flex-col gap-2 p-4 min-w-0">
      {/* Status + domain */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isError ? 'bg-red-500' : isLoading ? 'bg-amber-400 animate-pulse' : 'bg-primary'
        }`} />
        <span className="font-mono text-[10px] text-foreground truncate">{domain}</span>
      </div>

      {/* Name */}
      {isLoading && <span className="text-[10px] font-mono text-muted-foreground/40 animate-pulse">querying…</span>}
      {isError  && <span className="text-[10px] font-mono text-red-400/50">NIP-11 unavailable</span>}
      {info?.name && <p className="text-[11px] font-semibold text-primary truncate">{info.name}</p>}

      {info && (
        <>
          {/* Capability badges */}
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-mono px-1 border border-primary/50 text-primary/80">READ</span>
            <span className="text-[9px] font-mono px-1 border border-accent/50 text-accent/80">WRITE</span>
            {info.limitation?.auth_required    && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">AUTH</span>}
            {info.limitation?.payment_required && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">PAID</span>}
            {info.supported_nips && (
              <span className="text-[9px] font-mono px-1 border border-border text-muted-foreground">
                {info.supported_nips.length} NIPs
              </span>
            )}
          </div>

          {/* Limits */}
          <div className="text-[9px] font-mono text-muted-foreground/60 space-y-0.5">
            {info.limitation?.max_message_length != null && (
              <div>msg {(info.limitation.max_message_length / 1024).toFixed(0)} KB max</div>
            )}
            {info.limitation?.max_subscriptions != null && (
              <div>{info.limitation.max_subscriptions} subs max</div>
            )}
            {info.limitation?.max_limit != null && (
              <div>limit {info.limitation.max_limit}</div>
            )}
          </div>

          {/* Software */}
          {info.software && (
            <p className="text-[9px] font-mono text-muted-foreground/30 mt-auto">
              {info.software.split('/').pop()}{info.version ? ` v${info.version}` : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function RelayComparisonCard({ urls }: { urls: string[] }) {
  return (
    <div className="bg-card border border-border divide-x divide-border grid"
         style={{ gridTemplateColumns: `repeat(${urls.length}, minmax(0, 1fr))` }}>
      {urls.map(url => <RelayColumn key={url} url={url} />)}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function kindColor(kind: number): string {
  if (kind === 1)  return 'text-primary border-primary/40';
  if (kind === 7)  return 'text-accent border-accent/40';
  if (kind === 0)  return 'text-amber-400 border-amber-400/40';
  if (kind === 3)  return 'text-sky-400 border-sky-400/40';
  if (kind === 9735) return 'text-yellow-400 border-yellow-400/40';
  if (kind === 6 || kind === 16) return 'text-emerald-300 border-emerald-300/40';
  if (kind >= 30000 && kind < 40000) return 'text-purple-300 border-purple-300/40';
  if (kind >= 10000 && kind < 20000) return 'text-rose-300 border-rose-300/40';
  return 'text-muted-foreground border-border';
}

function kindBarColor(kind: number): string {
  if (kind === 1)  return 'bg-primary';
  if (kind === 7)  return 'bg-accent';
  if (kind === 0)  return 'bg-amber-400';
  if (kind === 9735) return 'bg-yellow-400';
  if (kind === 3)  return 'bg-sky-400';
  return 'bg-muted-foreground/50';
}

function kindLabel(kind: number): string {
  return KIND_LABELS[kind] ?? `Kind ${kind}`;
}

function timeAgo(ts: number): string {
  try { return formatDistanceToNowStrict(new Date(ts * 1000)); }
  catch { return '—'; }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EventRow({ event }: { event: NostrEvent }) {
  const color = kindColor(event.kind);
  const hasContent = event.content && [1, 30023, 42].includes(event.kind);
  return (
    <div className="border-b border-border/40 py-2 px-3 hover:bg-card/60 transition-colors">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[9px] font-mono px-1 border shrink-0 ${color}`}>
          {kindLabel(event.kind)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {event.pubkey.slice(0, 8)}…{event.pubkey.slice(-4)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto shrink-0">
          {timeAgo(event.created_at)}
        </span>
      </div>
      {hasContent && event.content && (
        <p className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-1 leading-relaxed">
          {event.content.slice(0, 140)}
        </p>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-none p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono text-primary">{value}</p>
      {sub && <p className="text-[10px] font-mono text-muted-foreground/60">{sub}</p>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Index() {
  const stats = useEventStats();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t < SQUARE_COUNT ? t + 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const kindEntries = Object.entries(stats.byKind)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 25);
  const maxKindCount = kindEntries[0]?.[1] ?? 1;
  const totalEvents = stats.liveTotal + stats.historicalTotal;
  const activeKinds = Object.keys(stats.byKind).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="https://fizx.uk" className="flex items-center gap-2 font-mono text-sm" aria-label="fizx.uk">
            <FizxLogo />
            <span className="bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent font-bold">fizx</span>
            <span className="text-muted-foreground">.uk</span>
            <span className="text-muted-foreground/40 ml-1">/ pulse</span>
          </a>
          <Link to="/settings" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FizxLogo className="h-9 w-9 shrink-0" />
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent">
                pulse
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-[3px] mb-3">
            {SQUARE_COLORS.map((litColor, i) => (
              <div key={i} className="flex-1 h-[10px] transition-colors duration-300"
                style={{ backgroundColor: i < tick ? litColor : SQUARE_DIM }} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time Nostr relay statistics and event feed
          </p>
        </div>

        {/* Relay comparison card */}
        <section>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Connected Relays
          </h2>
          <RelayComparisonCard urls={DISPLAY_RELAYS} />
        </section>

        {/* Streaming source label */}
        <section>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Streaming From
          </h2>
          <div className="flex flex-wrap gap-2">
            {STREAMING_RELAYS.map(url => (
              <span key={url} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground border border-border px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                {url.replace(/^wss?:\/\//, '')}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Radio}
            label="Events seen"
            value={totalEvents.toLocaleString()}
            sub={`${stats.liveTotal} live · ${stats.historicalTotal} last hr`}
          />
          <StatCard
            icon={Users}
            label="Unique authors"
            value={stats.uniqueAuthors.toLocaleString()}
            sub="distinct pubkeys"
          />
          <StatCard
            icon={Layers}
            label="Active kinds"
            value={activeKinds}
            sub="distinct event kinds"
          />
          <StatCard
            icon={Activity}
            label="Events / min"
            value={stats.eventsPerMinute}
            sub="60 s rolling rate"
          />
        </section>

        {/* Main two-column */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Live feed */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Live Event Feed
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="border border-border rounded-none">
              {stats.recentEvents.length === 0 ? (
                <p className="text-xs font-mono text-muted-foreground/50 p-4 animate-pulse">
                  Connecting to relays…
                </p>
              ) : (
                <div className="overflow-y-auto max-h-[560px]">
                  {stats.recentEvents.map(ev => <EventRow key={ev.id} event={ev} />)}
                </div>
              )}
            </div>
          </section>

          {/* Kind distribution */}
          <section>
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Event Kind Distribution
            </h2>
            <div className="border border-border rounded-none p-4 overflow-y-auto max-h-[560px] space-y-2">
              {kindEntries.length === 0 ? (
                <p className="text-xs font-mono text-muted-foreground/50 animate-pulse">
                  Accumulating data…
                </p>
              ) : (
                kindEntries.map(([kind, count]) => (
                  <div key={kind} className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono w-36 shrink-0 truncate ${kindColor(Number(kind)).split(' ')[0]}`}>
                      {kindLabel(Number(kind))}
                    </span>
                    <div className="flex-1 bg-border/20 h-1.5">
                      <div
                        className={`h-full transition-all duration-700 ${kindBarColor(Number(kind))}`}
                        style={{ width: `${(count / maxKindCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-y-2 text-xs text-muted-foreground font-mono">
          <span>pulse.fizx.uk</span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {([
              ['https://fizx.uk',         'fizx.uk'],
              ['https://glimpse.fizx.uk', 'glimpse'],
              ['https://pulse.fizx.uk',   'pulse'],
              ['https://ln.fizx.uk',      'ln'],
              ['https://stakes.fizx.uk',  'stakes'],
              ['https://sonic.fizx.uk',   'sonic'],
            ] as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} className="hover:text-primary transition-colors">{label}</a>
            ))}
            <span className="text-primary/60 ml-1">✦ built with claude</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
