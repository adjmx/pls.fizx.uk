// ── Animated title ──────────────────────────────────────────────
const TITLE_ANIM_CSS = `@keyframes titleLetterIn{from{transform:translateX(-80px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes titleSuffixIn{from{opacity:0}to{opacity:1}}`;
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}
function AnimatedTitle({ accent, rest = '', from: f, to: t, suffixRgba, fontSize = 'clamp(36px, 7.5vw, 51px)' }: { accent: string; rest?: string; from: string; to: string; suffixRgba: string; fontSize?: string }) {
  const ac = accent.split(''), rc = rest.split('');
  const total = ac.length + rc.length;
  const dur = 350, stagger = total > 1 ? (1200 - dur) / (total - 1) : 0;
  const fromRgb = hexToRgb(f);
  const toRgb = hexToRgb(t);
  const aLen = ac.length;
  return (
    <>
      <style>{TITLE_ANIM_CSS}</style>
      <h1 className="font-bold tracking-tight" style={{ fontSize }}>
        {ac.map((ch, i) => {
          const start = lerpRgb(fromRgb, toRgb, aLen > 0 ? i / aLen : 0);
          const end   = lerpRgb(fromRgb, toRgb, aLen > 0 ? (i + 1) / aLen : 1);
          return (
            <span key={i} className="inline-block"
              style={{ background: `linear-gradient(to right,${start},${end})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: `titleLetterIn ${dur}ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round(i * stagger)}ms` }}
            >{ch === ' ' ? ' ' : ch}</span>
          );
        })}
        {rc.map((ch, i) => (
          <span key={i + ac.length} className="inline-block"
            style={{ color: suffixRgba, animation: `titleSuffixIn 600ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round((ac.length + i) * stagger)}ms` }}
          >{ch === ' ' ? ' ' : ch}</span>
        ))}
      </h1>
    </>
  );
}

const NstartHand = () => (
  <a href="https://nstart.me/en" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity shrink-0">
    <svg className="h-8 w-auto" fill="url(#fizx-shaka)" viewBox="0 0 210 282">
        <defs>
          <linearGradient id="fizx-shaka" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      <path fillRule="evenodd" clipRule="evenodd" d="M57.143 98.9848C58.6367 95.1177 62.1322 93.1733 65.8719 92.1713C74.9767 89.7317 81.3757 95.1838 85.1202 100.138C87.0353 102.672 88.5381 105.402 89.6797 107.666C90.3271 108.95 90.784 109.916 91.1512 110.693C91.5296 111.493 91.8127 112.092 92.1107 112.628L92.3791 113.112L92.5365 113.642C92.9678 115.095 93.7096 117.176 94.4929 118.735C94.6234 118.994 94.7454 119.22 94.8568 119.411C96.2962 119.978 97.4576 121.196 97.8887 122.805C98.6106 125.499 97.0117 128.268 94.3176 128.99C90.8191 129.928 88.423 127.512 87.7439 126.76C86.7757 125.688 86.0213 124.371 85.4685 123.271C84.4243 121.194 83.5514 118.773 83.0054 117.015C82.6598 116.345 82.2327 115.455 81.797 114.546C81.4081 113.735 81.0122 112.91 80.6612 112.214C79.6317 110.173 78.4453 108.058 77.0622 106.228C74.2102 102.455 71.5767 101.099 68.4861 101.928C67.2891 102.248 66.763 102.551 66.5602 102.706C66.5455 102.953 66.5618 103.751 67.1654 105.569C67.7276 107.262 68.5363 109.136 69.5419 111.467C69.899 112.294 70.281 113.18 70.6855 114.135C72.1619 117.62 73.7875 121.713 75.0216 126.318C75.7971 129.213 76.5206 132.737 77.2684 136.379C77.6581 138.278 78.0544 140.208 78.468 142.098C79.7244 147.838 81.2286 153.692 83.4154 159.022C87.7563 169.603 94.3593 177.289 106.433 178.342L106.529 178.351L106.625 178.363C109.419 178.714 112.697 177.918 115.701 177.112C118.395 176.391 121.165 177.989 121.887 180.684C122.608 183.378 121.01 186.147 118.316 186.869L118.166 186.909C115.421 187.645 110.401 188.991 105.464 188.396C88.154 186.849 79.1418 175.217 74.0708 162.856C71.5471 156.704 69.8952 150.17 68.6012 144.257C68.1109 142.017 67.6816 139.921 67.2802 137.961C66.5822 134.553 65.9686 131.557 65.2653 128.932C64.212 125.001 62.7989 121.412 61.3851 118.074C61.0692 117.329 60.7434 116.574 60.4177 115.82C59.3548 113.359 58.2928 110.9 57.5795 108.751C56.6874 106.064 55.8077 102.442 57.143 98.9848ZM66.4502 102.814C66.4467 102.813 66.46 102.792 66.5009 102.755C66.4742 102.797 66.4537 102.815 66.4502 102.814Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M110.765 100.588C105.447 106.291 101.312 115.759 99.3897 122.479C98.6226 125.16 95.8269 126.712 93.1453 125.945C90.4637 125.178 88.9117 122.383 89.6788 119.701C91.8059 112.265 96.5106 101.065 103.377 93.7002C106.832 89.9939 111.303 86.7601 116.731 86.0659C122.387 85.3426 127.938 87.5088 133.082 92.3049L133.115 92.3362L133.148 92.3681C137.351 96.4319 138.339 102.566 138.148 108.032C137.949 113.717 136.446 119.945 134.287 125.595C132.132 131.235 129.187 136.66 125.845 140.636C124.178 142.619 122.255 144.43 120.101 145.672C117.93 146.924 115.206 147.765 112.252 147.16C109.337 146.564 106.744 145.387 104.783 143.392C102.786 141.361 101.852 138.897 101.552 136.487C101 132.048 102.548 127.175 103.955 123.382C106.452 116.654 109.786 109.569 110.805 107.805C112.2 105.389 115.288 104.562 117.704 105.956C120.119 107.351 120.947 110.439 119.552 112.855C118.921 113.948 115.814 120.46 113.425 126.896C111.989 130.765 111.361 133.516 111.576 135.241C111.659 135.914 111.844 136.167 111.986 136.311C112.162 136.491 112.72 136.941 114.239 137.257C114.319 137.249 114.575 137.199 115.057 136.921C115.849 136.465 116.9 135.58 118.113 134.136C120.532 131.258 122.973 126.908 124.852 121.99C126.726 117.084 127.904 111.973 128.054 107.679C128.21 103.204 127.233 100.723 126.154 99.6553C122.606 96.3623 119.932 95.8391 118.012 96.0847C115.858 96.3602 113.401 97.7603 110.765 100.588Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M148.576 99.5765C147.378 97.8131 145.202 95.6384 142.159 94.4817C138.745 93.1841 134.64 93.342 130.601 96.0088C128.274 97.5456 127.633 100.678 129.17 103.006C130.706 105.333 133.839 105.975 136.167 104.438C136.898 103.955 137.405 103.832 137.696 103.801C137.992 103.769 138.272 103.81 138.57 103.923C139.285 104.195 139.945 104.834 140.233 105.27L140.315 105.394L140.404 105.513C141.425 106.878 142.178 109.533 142.032 113.653C141.891 117.623 140.936 122.239 139.41 126.752C137.884 131.261 135.869 135.427 133.77 138.525C132.722 140.073 131.721 141.252 130.838 142.06C129.92 142.9 129.36 143.128 129.206 143.17C128.698 143.306 128.451 143.278 128.388 143.266C128.367 143.248 128.329 143.21 128.274 143.135C127.88 142.603 127.203 140.925 127.411 137.461C127.578 134.677 125.456 132.285 122.672 132.118C119.888 131.951 117.495 134.072 117.329 136.857C117.058 141.364 117.724 145.861 120.157 149.146C121.436 150.873 123.188 152.225 125.367 152.905C127.514 153.575 129.73 153.486 131.82 152.926C134.105 152.314 136.064 150.968 137.656 149.512C139.282 148.024 140.782 146.184 142.133 144.189C144.835 140.2 147.221 135.181 148.977 129.989C150.733 124.799 151.942 119.195 152.126 114.011C152.302 109.023 151.557 103.642 148.576 99.5765Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M186.841 91.1686C185.772 91.5973 185.168 92.2069 184.973 92.544C183.264 95.5056 179.325 100.324 175.48 104.794C171.507 109.414 167.22 114.13 164.478 117.072C162.576 119.112 159.38 119.224 157.34 117.322C155.3 115.42 155.188 112.224 157.09 110.184C159.763 107.317 163.956 102.703 167.822 98.2078C171.818 93.5623 175.079 89.4804 176.226 87.4938C177.817 84.7382 180.464 82.8432 183.083 81.7933C185.71 80.7403 188.941 80.2834 192.028 81.1664C195.357 82.1186 198.189 84.5703 199.383 88.482C200.486 92.0952 200.034 96.4116 198.408 101.218C192.231 119.477 179.621 133.86 174.895 138.051C173.698 139.112 172.27 141.273 170.323 145.956C168.418 150.541 166.292 156.814 163.351 165.509C160.041 175.292 152.771 183.982 144.169 188.607C135.418 193.311 124.606 194.032 115.772 186.268C113.677 184.427 113.471 181.236 115.312 179.141C117.153 177.046 120.344 176.84 122.439 178.681C127.282 182.937 133.283 182.991 139.386 179.71C145.636 176.35 151.258 169.738 153.783 162.273L153.849 162.079C156.711 153.619 158.943 147.019 160.996 142.08C163.023 137.203 165.165 133.179 168.193 130.494C171.917 127.192 183.347 114.22 188.84 97.9817C190.131 94.1642 189.957 92.1976 189.722 91.4309C189.582 90.972 189.465 90.9385 189.263 90.8808L189.25 90.8772C188.798 90.7479 187.902 90.7432 186.841 91.1686Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M87.4391 172.66C90.1332 171.938 92.9024 173.537 93.6243 176.231C94.4031 179.138 94.2478 183.011 93.9724 186.046C93.6772 189.298 93.1456 192.495 92.737 194.492C92.1778 197.225 89.5094 198.987 86.7768 198.427C84.0443 197.868 82.2825 195.2 82.8416 192.467C83.1876 190.777 83.6573 187.954 83.9133 185.133C84.1891 182.095 84.1349 179.841 83.868 178.845C83.1462 176.151 84.745 173.382 87.4391 172.66Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M137.693 185.612C139.544 187.699 139.352 190.891 137.266 192.742C133.64 195.957 128.811 202.842 126.912 207.176C125.793 209.731 122.814 210.895 120.26 209.775C117.705 208.656 116.541 205.678 117.661 203.123C120.087 197.584 125.741 189.462 130.564 185.184C132.651 183.334 135.843 183.525 137.693 185.612Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M143.142 106.629C143.189 103.84 145.487 101.617 148.275 101.663C152.563 101.733 158.532 103.631 162.187 109.36C165.863 115.122 166.352 123.427 162.604 134.507C160.305 141.303 157.71 146.407 154.909 150.066C152.117 153.714 148.909 156.189 145.365 157.139C137.608 159.218 131.981 153.53 130.512 148.048C129.79 145.354 131.389 142.585 134.083 141.863C136.777 141.141 139.546 142.74 140.268 145.434C140.76 147.269 141.972 147.592 142.751 147.383C143.476 147.189 144.96 146.446 146.888 143.927C148.807 141.42 150.959 137.41 153.036 131.27C156.29 121.652 155.029 116.919 153.672 114.793C152.294 112.633 149.948 111.792 148.109 111.762C145.32 111.716 143.096 109.418 143.142 106.629Z"/>
    </svg>
  </a>
);

import { useRelayInfo } from '@/hooks/useRelayInfo';
import { useEventStats, KIND_LABELS } from '@/hooks/useEventStats';
import { STREAMING_RELAYS } from '@/config/relays';
import type { NostrEvent } from '@nostrify/nostrify';
import { formatDistanceToNowStrict } from 'date-fns';
import { Activity, Radio, Users, Layers, Database, Hash, RefreshCw, ShieldCheck, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRelayStats, formatBytes } from '@/hooks/useRelayDbSize';
import { useRelayNip05 } from '@/hooks/useRelayNip05';

// ── NIP-07 Nostr login ────────────────────────────────────────────────────────
declare global { interface Window { nostr?: { getPublicKey(): Promise<string>; signEvent(e: object): Promise<object> } } }
// Module-level pubkey store with subscribers so every useNostrLogin() call
// shares one source of truth. Without this, two components in the same page
// each get an independent useState — login in one wouldn't re-render the other
// until a page refresh re-read localStorage.
let _nostrPubkey: string | null = null;
let _nostrInitialized = false;
const _nostrSubs = new Set<(p: string | null) => void>();
function _readInitialPubkey(): string | null {
  try {
    const p = new URLSearchParams(window.location.search).get('nostr_pk');
    if (p) { localStorage.setItem('nostr_pubkey', p); return p; }
    return localStorage.getItem('nostr_pubkey');
  } catch { return null; }
}
function _setNostrPubkey(p: string | null) {
  _nostrPubkey = p;
  _nostrSubs.forEach(fn => fn(p));
}

function useNostrLogin() {
  const [pubkey, setLocal] = useState<string | null>(() => {
    if (!_nostrInitialized) { _nostrPubkey = _readInitialPubkey(); _nostrInitialized = true; }
    return _nostrPubkey;
  });
  useEffect(() => {
    _nostrSubs.add(setLocal);
    return () => { _nostrSubs.delete(setLocal); };
  }, []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('nostr_pk')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  const login = async () => {
    if (typeof window !== 'undefined' && window.nostr) {
      try {
        const pk = await window.nostr.getPublicKey();
        if (pk) { localStorage.setItem('nostr_pubkey', pk); _setNostrPubkey(pk); }
      } catch {}
      return;
    }
    const cb = `${window.location.origin}${window.location.pathname}?nostr_pk={signature}`;
    window.location.href = `nostrsigner:getpubkey?compressionType=none&returnType=signature&type=get_public_key&callbackUrl=${encodeURIComponent(cb)}`;
  };
  const logout = () => {
    try { localStorage.removeItem('nostr_pubkey'); } catch {} /* */
    _setNostrPubkey(null);
  };
  return { pubkey, login, logout };
}
// Light-weight kind:0 lookup so the nav login button can show the user's
// avatar + NIP-05 / display name. Lazy: only opens a socket once `pubkey` is set.
function useUserProfile(pubkey: string | null) {
  const [profile, setProfile] = useState<{ nip05?: string; name?: string; display_name?: string; picture?: string } | null>(null);
  useEffect(() => {
    if (!pubkey) { setProfile(null); return; }
    setProfile(null);
    const relays = ['wss://relay.fizx.uk', 'wss://nos.lol'];
    const sockets: WebSocket[] = [];
    let latestTs = 0;
    relays.forEach(url => {
      let ws: WebSocket;
      try { ws = new WebSocket(url); } catch { return; }
      sockets.push(ws);
      const subId = `prof-${Math.random().toString(36).slice(2, 8)}`;
      ws.onopen = () => { try { ws.send(JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }])); } catch { /* ignore */ } };
      ws.onmessage = (e) => {
        try {
          const m = JSON.parse(e.data as string);
          if (!Array.isArray(m)) return;
          if (m[0] === 'EVENT' && m[1] === subId) {
            const ev = m[2];
            if (ev?.created_at > latestTs) {
              latestTs = ev.created_at;
              try {
                const p = JSON.parse(ev.content);
                if (p && typeof p === 'object') setProfile(p);
              } catch { /* malformed metadata */ }
            }
          } else if (m[0] === 'EOSE') {
            try { ws.close(); } catch { /* ignore */ }
          }
        } catch { /* malformed frame */ }
      };
    });
    return () => { sockets.forEach(s => { try { s.close(); } catch { /* ignore */ } }); };
  }, [pubkey]);
  return profile;
}

function NostrLogin() {
  const { pubkey, login, logout } = useNostrLogin();
  const profile = useUserProfile(pubkey);
  if (pubkey) {
    const label = profile?.nip05 || profile?.display_name || profile?.name || `${pubkey.slice(0, 8)}…`;
    return (
      <button onClick={logout} title={`Signed in as ${label} — click to log out`} className="font-mono text-[11px] px-1.5 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
        {profile?.picture ? (
          <span className="w-4 h-4 rounded-full shrink-0 bg-muted bg-cover bg-center ring-1 ring-primary/30" style={{ backgroundImage: `url(${JSON.stringify(profile.picture)})` }} aria-hidden />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
        <span className="hidden sm:inline max-w-[11rem] truncate">{label}</span>
        <span className="text-muted-foreground/50 ml-0.5">×</span>
      </button>
    );
  }
  return (
    <button onClick={login} className="font-mono text-[11px] px-2 py-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span className="hidden sm:inline">Log in with Nostr</span>
    </button>
  );
}

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
          isError ? 'bg-amber-400' : isLoading ? 'bg-amber-400 animate-pulse' : 'bg-primary'
        }`} />
        <span className="font-mono text-[10px] text-foreground truncate">{domain}</span>
      </div>

      {/* Name */}
      {isLoading && <span className="text-[10px] font-mono text-muted-foreground/40 animate-pulse">querying…</span>}
      {isError  && <span className="text-[10px] font-mono text-amber-400/60">NIP-11 not served</span>}
      {info?.name && <p className="text-[11px] font-semibold text-primary truncate">{info.name}</p>}

      {info && (
        <>
          {/* Capability badges */}
          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-mono px-1 border border-primary/50 text-primary/80">READ</span>
            <span className="text-[9px] font-mono px-1 border border-accent/50 text-accent/80">WRITE</span>
            {info.limitation?.auth_required    && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">AUTH</span>}
            {info.limitation?.payment_required && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">PAID</span>}
            {info.supported_nips?.includes(34) && (
              <a href="https://github.com/nostr-protocol/nips/blob/master/34.md"
                 target="_blank" rel="noopener noreferrer"
                 title="GRASP — relay accepts NIP-34 git events"
                 className="text-[9px] font-mono px-1 border border-accent text-accent bg-accent/10 hover:bg-accent/20 transition-colors tracking-widest font-bold">
                GRASP
              </a>
            )}
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

// The primary card is user-configurable and defaults to the streaming source.
// The secondary badge is a fixed compact view of an auxiliary relay for quick
// reference (e.g. relay.nostr.band as a generic public relay).
const PRIMARY_RELAY_KEY = 'pulse_primary_relay';
const PRIMARY_RELAY_DEFAULT = 'wss://relay.fizx.uk';
const SECONDARY_RELAY_URL = 'wss://relay.nostr.band';

function PrimaryRelayCard({ extras }: { extras?: React.ReactNode }) {
  const [url, setUrl] = useState<string>(() => {
    try { return localStorage.getItem(PRIMARY_RELAY_KEY) ?? PRIMARY_RELAY_DEFAULT; } catch { return PRIMARY_RELAY_DEFAULT; }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(url);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      setUrl(trimmed);
      try { localStorage.setItem(PRIMARY_RELAY_KEY, trimmed); } catch {}
    }
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border flex flex-col">
      <RelayColumn url={url} />
      {extras && (
        <div className="border-t border-border/40 px-4 py-3">
          {extras}
        </div>
      )}
      <div className="px-4 pb-3 mt-auto">
        {editing ? (
          <div className="flex gap-1">
            <input
              className="flex-1 text-[10px] font-mono bg-background border border-border px-2 py-1 text-foreground focus:outline-none focus:border-primary/50"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
            <button onClick={save} className="text-[10px] font-mono px-2 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors shrink-0">ok</button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(url); setEditing(true); }}
            className="text-[9px] font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
          >edit relay</button>
        )}
      </div>
    </div>
  );
}

/** Compact horizontal strip showing NIP-11 metadata for a fixed relay URL. */
function RelayBadge({ url = SECONDARY_RELAY_URL, bare = false }: { url?: string; bare?: boolean }) {
  const { data: info, isLoading, isError } = useRelayInfo(url);
  const domain = url.replace(/^wss?:\/\//, '');

  return (
    <div className={bare
      ? 'flex flex-wrap items-center gap-x-3 gap-y-1.5'
      : 'bg-card border border-border px-3 py-2 flex flex-wrap items-center gap-x-3 gap-y-1.5'}>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isError ? 'bg-amber-400' : isLoading ? 'bg-amber-400 animate-pulse' : 'bg-primary'
        }`} />
        <span className="font-mono text-[10px] text-foreground">{domain}</span>
      </div>

      {info?.name && info.name !== domain && (
        <span className="text-[10px] font-mono font-semibold text-primary/80 truncate">{info.name}</span>
      )}

      {info?.software && (
        <span className="text-[9px] font-mono text-muted-foreground/40">
          {info.software.split('/').pop()}{info.version ? ` v${info.version}` : ''}
        </span>
      )}

      <div className="flex flex-wrap items-center gap-1 sm:ml-auto">
        <span className="text-[9px] font-mono px-1 border border-primary/50 text-primary/80">READ</span>
        <span className="text-[9px] font-mono px-1 border border-accent/50 text-accent/80">WRITE</span>
        {info?.limitation?.auth_required    && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">AUTH</span>}
        {info?.limitation?.payment_required && <span className="text-[9px] font-mono px-1 border border-amber-500/50 text-amber-500">PAID</span>}
        {info?.supported_nips?.includes(34) && (
          <a href="https://github.com/nostr-protocol/nips/blob/master/34.md"
             target="_blank" rel="noopener noreferrer"
             title="GRASP — relay accepts NIP-34 git events"
             className="text-[9px] font-mono px-1 border border-accent text-accent bg-accent/10 hover:bg-accent/20 transition-colors tracking-widest font-bold">
            GRASP
          </a>
        )}
        {info?.supported_nips && (
          <span className="text-[9px] font-mono px-1 border border-border text-muted-foreground">
            {info.supported_nips.length} NIPs
          </span>
        )}
        {isError && (
          <span className="text-[9px] font-mono text-amber-400/60">NIP-11 not served</span>
        )}
        {isLoading && !info && (
          <span className="text-[9px] font-mono text-muted-foreground/40 animate-pulse">querying…</span>
        )}
      </div>
    </div>
  );
}

function RelayNip05Card() {
  const { data, isLoading, isError } = useRelayNip05('wss://relay.fizx.uk');
  const verified = data && data.verifiedNames.length > 0;

  return (
    <div className="bg-card border border-border px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">

      {/* Verification status + identifiers */}
      <div className="flex items-center gap-2 shrink-0">
        {isLoading ? (
          <span className="text-[10px] font-mono text-muted-foreground/40 animate-pulse">verifying…</span>
        ) : isError ? (
          <>
            <ShieldOff className="h-3.5 w-3.5 text-amber-400/70 shrink-0" />
            <span className="text-[10px] font-mono text-amber-400/70">NIP-05 lookup failed</span>
          </>
        ) : verified ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {data.verifiedNames.map(name => (
                <span key={name} className="text-[11px] font-mono font-semibold text-primary">{name}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <ShieldOff className="h-3.5 w-3.5 text-amber-400/70 shrink-0" />
            <span className="text-[10px] font-mono text-amber-400/70">no NIP-05 match for relay pubkey</span>
          </>
        )}
      </div>

      {/* Pubkey */}
      {data?.pubkey && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">pubkey</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">
            {data.pubkey.slice(0, 8)}…{data.pubkey.slice(-6)}
          </span>
        </div>
      )}

      {/* Contact */}
      {data?.contact && (
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">contact</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{data.contact}</span>
        </div>
      )}

      {/* Source */}
      {data?.domain && (
        <div className="ml-auto shrink-0">
          <span className="text-[9px] font-mono text-muted-foreground/30">
            {data.domain}/.well-known/nostr.json
          </span>
        </div>
      )}
    </div>
  );
}

function RelayComparisonCard({ extras }: { extras?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <PrimaryRelayCard extras={extras} />
      <RelayBadge />
    </div>
  );
}

/** Inline "edit relay" control — toggles between an "edit relay" link and a
 *  text input. Persists to localStorage so the change survives reloads. */
function RelayEdit({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onChange(trimmed);
      try { localStorage.setItem(PRIMARY_RELAY_KEY, trimmed); } catch {}
    }
    setEditing(false);
  };
  return editing ? (
    <div className="flex gap-1">
      <input
        className="flex-1 text-[10px] font-mono bg-background border border-border px-2 py-1 text-foreground focus:outline-none focus:border-primary/50"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
        autoFocus
      />
      <button onClick={save} className="text-[10px] font-mono px-2 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors shrink-0">ok</button>
    </div>
  ) : (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="text-[9px] font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
    >edit relay</button>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Round n to nearest 250 band for approximate display */
function toApprox(n: number): string {
  if (n === 0) return '0';
  const band = Math.max(250, Math.round(n / 250) * 250);
  return `~${band.toLocaleString()}`;
}

function kindColor(kind: number): string {
  if (kind === 1)  return 'text-primary border-primary/40';
  if (kind === 7)  return 'text-accent border-accent/40';
  if (kind === 0)  return 'text-amber-400 border-amber-400/40';
  if (kind === 3)  return 'text-sky-400 border-sky-400/40';
  if (kind === 9735) return 'text-yellow-400 border-yellow-400/40';
  if (kind === 6 || kind === 16) return 'text-emerald-300 border-emerald-300/40';
  if (kind >= 20000 && kind < 30000) return 'text-muted-foreground/40 border-border/30'; // ephemeral — dim
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
  if (kind >= 20000 && kind < 30000) return 'bg-muted-foreground/20'; // ephemeral — dim
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
  icon: Icon, label, value, sub, onRefresh, refreshing,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  onRefresh?: () => void; refreshing?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-none p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-mono uppercase tracking-widest flex-1">{label}</span>
        {onRefresh && (
          <button onClick={onRefresh} disabled={refreshing} className="text-muted-foreground/40 hover:text-primary transition-colors disabled:opacity-30">
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      <p className="text-2xl font-bold font-mono text-primary">{value}</p>
      {sub && <p className="text-[10px] font-mono text-muted-foreground/60">{sub}</p>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Index() {
  const stats = useEventStats();
  const relayStats = useRelayStats();
  const [primaryRelay, setPrimaryRelay] = useState<string>(() => {
    try { return localStorage.getItem(PRIMARY_RELAY_KEY) ?? PRIMARY_RELAY_DEFAULT; } catch { return PRIMARY_RELAY_DEFAULT; }
  });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t < SQUARE_COUNT ? t + 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const kindEntries = Object.entries(stats.byKind)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  const maxKindCount = kindEntries[0]?.[1] ?? 1;
  const totalEvents = stats.liveTotal + stats.historicalTotal;
  const activeKinds = Object.keys(stats.byKind).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <a href="https://fizx.uk" className="font-mono text-[11px] sm:text-[12px] text-muted-foreground/50 hover:text-primary transition-colors shrink-0">fizx</a>
          {(() => {
            const SUBS = ['blst','glmps','npub','pls','smpl'] as const;
            const cur = SUBS.find((s) => window.location.hostname === `${s}.fizx.uk`);
            return <>
              {cur && <span className="font-mono text-[11px] sm:text-[12px] text-primary whitespace-nowrap shrink-0 cursor-default">{cur}</span>}
              <div className="flex-1 flex justify-center items-center gap-x-3 overflow-x-auto">
                {SUBS.filter((s) => s !== cur).map((sub) => (
                  <a key={sub} href={`https://${sub}.fizx.uk`} className="text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap text-[11px] sm:text-[12px] font-mono">{sub}</a>
                ))}
              </div>
            </>;
          })()}
          <a href="https://github.com/adjmx/pls.fizx.uk" target="_blank" rel="noopener noreferrer" title="Source on GitHub" aria-label="Source on GitHub" className="shrink-0 text-muted-foreground/60 hover:text-primary transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.21 0 .31.21.68.8.56 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z"/></svg>
          </a>
          <NstartHand />
          <div className="shrink-0 flex justify-end w-[34px] sm:w-[210px]"><NostrLogin /></div>
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Header — hero card (title + subtitle + streaming relays + Shaka) */}
        <div>
          <div className="bg-card border border-border px-4 py-3 mb-4 min-h-[110px] flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0 space-y-1">
              <AnimatedTitle accent="pls" rest="" from="#a78bfa" to="#2dd4bf" suffixRgba="rgba(45,212,191,0.55)" fontSize="clamp(28px, 5vw, 40px)" />
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-muted-foreground/70 truncate">Nostr relay statistics</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">Streaming Relays</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              </div>
              <div className="flex flex-col gap-1.5 font-mono">
                <RelayBadge url={primaryRelay} bare />
                <RelayBadge url={SECONDARY_RELAY_URL} bare />
              </div>
            </div>
          </div>
        </div>

        {/* Event kind distribution */}
        <section>
          <div className="bg-card border border-border px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">Event Kind Distribution</h3>
              {kindEntries.length > 0 && (
                <span className="font-mono text-[9px] text-muted-foreground/30">{kindEntries.length}</span>
              )}
            </div>
            <div className="space-y-1.5">
              {kindEntries.length === 0 ? (
                <p className="text-[10px] font-mono text-muted-foreground/50 animate-pulse">Accumulating data…</p>
              ) : (
                kindEntries.map(([kind, count]) => (
                  <div key={kind} className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono w-32 shrink-0 truncate ${kindColor(Number(kind)).split(' ')[0]}`}>
                      {kindLabel(Number(kind))}
                    </span>
                    <div className="flex-1 bg-border/20 h-1.5 min-w-0">
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
            <div className="mt-3 pt-3 border-t border-border/40">
              <RelayEdit value={primaryRelay} onChange={setPrimaryRelay} />
            </div>
          </div>
          <div className="mt-2">
            <RelayNip05Card />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={Radio}
            label="Events seen"
            value={toApprox(totalEvents)}
            sub={`${stats.liveTotal.toLocaleString()} live · ${toApprox(stats.historicalTotal)} ~24hr`}
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
            value={toApprox(stats.eventsPerMinute)}
            sub="60s rolling · ±250"
          />
          <StatCard
            icon={Hash}
            label="Total events"
            value={relayStats.isLoading ? '…' : relayStats.data ? relayStats.data.event_count.toLocaleString() : 'N/A'}
            sub="precise · updates ~1 min"
            onRefresh={relayStats.refetch}
            refreshing={relayStats.isFetching}
          />
          <StatCard
            icon={Database}
            label="DB size"
            value={relayStats.data ? formatBytes(relayStats.data.db_bytes) : relayStats.isLoading ? '…' : 'N/A'}
            sub="nostr.db · updates ~1 min"
          />
        </section>

        {/* Live feed — full width */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[2px] bg-primary/50 shrink-0" style={{ width: 'calc((100% - 60px) / 21)' }} />
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
              <div>
                {stats.recentEvents.map(ev => <EventRow key={ev.id} event={ev} />)}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer — cross-site chips */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-mono">
          <div className="flex items-center gap-4">
            <a href="https://ln.fizx.uk" className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#a78bfa" aria-hidden="true">
                <path d="M13 2L4.5 13.5H11L10 22L20.5 10.5H14L13 2z"/>
              </svg>
              <span>ln<span className="text-muted-foreground/40">.fizx.uk</span></span>
            </a>
            <a href="https://recipes.fizx.uk" className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <span>recipes<span className="text-muted-foreground/40">.fizx.uk</span></span>
            </a>
            <a href="https://relay.fizx.uk" className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
              </svg>
              <span>relay<span className="text-muted-foreground/40">.fizx.uk</span></span>
            </a>
          </div>
          <span className="text-primary/60">✦ built with claude</span>
        </div>
      </footer>

    </div>
  );
}
