import { Radio, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { RelayListManager } from '@/components/RelayListManager';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppContext } from '@/hooks/useAppContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ── NIP-07 Nostr login ────────────────────────────────────────────────────────
declare global { interface Window { nostr?: { getPublicKey(): Promise<string> } } }
function useNostrLogin() {
  const [pubkey, setPubkey] = useState<string | null>(() => { try { return localStorage.getItem('nostr_pubkey'); } catch { return null; } });
  const login = async () => { try { const pk = await window.nostr!.getPublicKey(); setPubkey(pk); localStorage.setItem('nostr_pubkey', pk); } catch {} };
  const logout = () => { setPubkey(null); try { localStorage.removeItem('nostr_pubkey'); } catch {} };
  return { pubkey, login, logout };
}
function NostrLogin() {
  const { pubkey, login, logout } = useNostrLogin();
  if (pubkey) return (
    <button onClick={logout} className="font-mono text-[11px] px-2 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span className="hidden sm:inline">{pubkey.slice(0, 8)}…</span>
      <span className="text-muted-foreground/50 ml-0.5">×</span>
    </button>
  );
  return (
    <button onClick={login} className="font-mono text-[11px] px-2 py-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1.5">
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span className="hidden sm:inline">Log in using an extension</span>
    </button>
  );
}

const Settings = () => {
  const { user } = useCurrentUser();
  const { config, setConfig } = useAppContext();

  const toggleTheme = () => {
    setConfig({ ...config, theme: config.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <a href="https://fizx.uk" className="font-bold text-xl tracking-tight bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent shrink-0" aria-label="fizx.uk">
            fizx
          </a>
          {(() => {
            const SUBS = ['blst','glmps','npub','pls','smpl'] as const;
            const cur = SUBS.find((s) => window.location.hostname === `${s}.fizx.uk`);
            return <>
              {cur && <span className="font-mono text-[10px] sm:text-[11px] text-primary whitespace-nowrap shrink-0 cursor-default">{cur}</span>}
              <div className="flex-1 flex justify-center items-center gap-x-3 overflow-x-auto">
                {SUBS.filter((s) => s !== cur).map((sub) => (
                  <a key={sub} href={`https://${sub}.fizx.uk`} className="text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap text-[10px] sm:text-[11px] font-mono">{sub}</a>
                ))}
              </div>
            </>;
          })()}
          <div className="shrink-0 flex items-center gap-3 justify-end min-w-[28px] sm:min-w-[184px]">
            <NostrLogin />
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Dashboard">
              ← back
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent">
              pls.settings
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Relay configuration and preferences</p>
        </div>

        {/* Appearance */}
        <section>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Appearance
          </h2>
          <div className="bg-card border border-border p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-foreground">Theme</p>
              <p className="text-[11px] font-mono text-muted-foreground/60 mt-0.5">
                Current: {config.theme === 'dark' ? 'Dark' : 'Light'} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="font-mono text-xs px-4 py-2 border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2"
            >
              {config.theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {config.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </section>

        {/* Relay Configuration */}
        <section>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Relay Configuration
          </h2>
          <div className="bg-card border border-border p-4">
            {user ? (
              <RelayListManager />
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs font-mono text-muted-foreground/60">
                  Log in with Nostr to manage your relay list
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Active Relays */}
        <section>
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Active Relays
          </h2>
          <div className="bg-card border border-border divide-y divide-border">
            {config.relayMetadata.relays.map((relay) => (
              <div key={relay.url} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="font-mono text-xs text-foreground">{relay.url.replace(/^wss?:\/\//, '')}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground/60">
                  {relay.read  && <span className="border border-border px-1">READ</span>}
                  {relay.write && <span className="border border-accent/30 text-accent/60 px-1">WRITE</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs font-mono text-primary/60">✦ built with claude</p>
      </footer>

    </div>
  );
};

export default Settings;
