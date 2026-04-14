import { useState } from 'react';
import { useLoggedInAccounts } from '@/hooks/useLoggedInAccounts';
import { AccountSwitcher } from './AccountSwitcher';
import LoginDialog from './LoginDialog';
import { cn } from '@/lib/utils';

export interface LoginAreaProps {
  className?: string;
}

export function LoginArea({ className }: LoginAreaProps) {
  const { currentUser } = useLoggedInAccounts();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('inline-flex items-center', className)}>
      {currentUser ? (
        <AccountSwitcher onAddAccountClick={() => setOpen(true)} />
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="font-mono text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
        >
          connect
        </button>
      )}
      <LoginDialog isOpen={open} onClose={() => setOpen(false)} onLogin={() => setOpen(false)} />
    </div>
  );
}
