import React, { useState, useEffect } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLoginActions } from '@/hooks/useLoginActions';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type Loading = 'extension' | 'npub' | 'nsec' | 'bunker' | null;

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose, onLogin }) => {
  const login = useLoginActions();
  const [loading, setLoading] = useState<Loading>(null);
  const [npub, setNpub]       = useState('');
  const [nsec, setNsec]       = useState('');
  const [bunker, setBunker]   = useState('');
  const [errors, setErrors]   = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (isOpen) { setLoading(null); setNpub(''); setNsec(''); setBunker(''); setErrors({}); }
  }, [isOpen]);

  const succeed = () => { onLogin(); onClose(); };
  const fail = (field: string, msg: string) => {
    setErrors(e => ({ ...e, [field]: msg }));
    setLoading(null);
  };

  const handleExtension = async () => {
    if (!('nostr' in window)) return fail('extension', 'No NIP-07 extension found. Install Alby or Nos2x.');
    setLoading('extension');
    setErrors({});
    try { await login.extension(); succeed(); }
    catch (e: unknown) { fail('extension', (e as Error).message ?? 'Extension login failed'); }
  };

  const handleNpub = () => {
    if (!npub.trim()) return fail('npub', 'Enter an npub');
    if (!npub.startsWith('npub1')) return fail('npub', 'Must start with npub1');
    setLoading('npub');
    setErrors({});
    try { login.npub(npub.trim()); succeed(); }
    catch (e: unknown) { fail('npub', (e as Error).message ?? 'Invalid npub'); }
  };

  const handleNsec = () => {
    if (!nsec.trim()) return fail('nsec', 'Enter an nsec');
    if (!nsec.startsWith('nsec1')) return fail('nsec', 'Must start with nsec1');
    setLoading('nsec');
    setErrors({});
    setTimeout(() => {
      try { login.nsec(nsec.trim()); succeed(); }
      catch (e: unknown) { fail('nsec', (e as Error).message ?? 'Invalid nsec'); }
    }, 50);
  };

  const handleBunker = async () => {
    if (!bunker.trim()) return fail('bunker', 'Enter a bunker URI');
    if (!bunker.startsWith('bunker://')) return fail('bunker', 'Must start with bunker://');
    setLoading('bunker');
    setErrors({});
    try { await login.bunker(bunker.trim()); succeed(); }
    catch (e: unknown) { fail('bunker', (e as Error).message ?? 'Bunker connection failed'); }
  };

  const Row = ({ field, value, onChange, placeholder, onSubmit, type = 'text' }: {
    field: string; value: string; onChange: (v: string) => void;
    placeholder: string; onSubmit: () => void; type?: string;
  }) => (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input
          type={type}
          value={value}
          onChange={e => { onChange(e.target.value); setErrors(ev => ({ ...ev, [field]: undefined })); }}
          placeholder={placeholder}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          autoComplete="off"
          className="rounded-none font-mono text-xs flex-1 h-8 border-border bg-background focus-visible:ring-0 focus-visible:border-primary/60"
        />
        <button
          onClick={onSubmit}
          disabled={loading !== null}
          className="font-mono text-xs px-3 h-8 border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors disabled:opacity-40"
        >
          {loading === field ? <Loader2 className="w-3 h-3 animate-spin" /> : '→'}
        </button>
      </div>
      {errors[field] && <p className="text-[10px] font-mono text-red-400">{errors[field]}</p>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-none p-0 border-border bg-background gap-0 [&>button]:rounded-none [&>button]:border-border">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            connect to nostr
          </p>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* Extension */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              browser extension
            </p>
            <button
              onClick={handleExtension}
              disabled={loading !== null}
              className="w-full font-mono text-xs py-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === 'extension'
                ? <><Loader2 className="w-3 h-3 animate-spin" /> connecting…</>
                : <><Shield className="w-3 h-3" /> connect with extension</>
              }
            </button>
            {errors.extension && <p className="text-[10px] font-mono text-red-400">{errors.extension}</p>}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-[10px] font-mono text-muted-foreground/40">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* npub */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              npub <span className="normal-case tracking-normal opacity-50">— read only</span>
            </p>
            <Row field="npub" value={npub} onChange={setNpub} placeholder="npub1…" onSubmit={handleNpub} />
          </div>

          {/* nsec */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              nsec <span className="normal-case tracking-normal opacity-50">— secret key</span>
            </p>
            <Row field="nsec" value={nsec} onChange={setNsec} placeholder="nsec1…" onSubmit={handleNsec} type="password" />
          </div>

          {/* Bunker — collapsed */}
          <details className="group">
            <summary className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 cursor-pointer hover:text-muted-foreground select-none list-none flex items-center gap-1.5">
              <span className="transition-transform group-open:rotate-90 inline-block text-[8px]">▶</span>
              bunker / remote signer
            </summary>
            <div className="mt-2 space-y-1.5">
              <Row field="bunker" value={bunker} onChange={setBunker} placeholder="bunker://…" onSubmit={handleBunker} />
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/60">
          <p className="text-[10px] font-mono text-muted-foreground/40">
            new to nostr?{' '}
            <a
              href="https://nostr.how"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              nostr.how ↗
            </a>
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
