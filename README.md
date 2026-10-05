# pls.fizx.uk

> Nostr relay dashboard — live stats, NIP-11 metadata, event feeds.

**Live**: <https://pls.fizx.uk>

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- Tailwind CSS
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- lucide-react

## Nostr

- **Login**: NIP-07 (browser extension) + NIP-55 (Amber callback URI)
- `kind:1` — live notes feed

NIP-11 client (probes any wss URL for relay info). Primary relay card configurable in `src/pages/Settings.tsx` (default `wss://relay.fizx.uk`).

## Develop

```bash
npm install
npm run dev
```

## Build + deploy

```bash
./deploy.sh
```

Builds, then rsyncs `dist/` to the webroot. The script names the server by an
SSH host alias (`fizx.uk` in `~/.ssh/config`), which carries the user, port and
key.

Server addresses and the nginx / SSL / DNS notes for the wider deployment live in the local `code_gh/adjmx/CLAUDE.md` (not pushed; this README is the public-facing summary).

---

_Sister repo on the other side: <https://github.com/macos-node/pls.upleb.uk>_
