import { ChevronDown, LogOut, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoggedInAccounts, type Account } from '@/hooks/useLoggedInAccounts';
import { useNostrLogin } from '@nostrify/react/login';

interface AccountSwitcherProps {
  onAddAccountClick: () => void;
}

export function AccountSwitcher({ onAddAccountClick }: AccountSwitcherProps) {
  const { currentUser, otherUsers, setLogin, removeLogin } = useLoggedInAccounts();
  const { logins } = useNostrLogin();

  if (!currentUser) return null;

  const isReadOnly = logins[0]?.type === 'pubkey';
  const displayName = (a: Account) =>
    a.metadata.name || `${a.pubkey.slice(0, 8)}…${a.pubkey.slice(-4)}`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors font-mono text-xs">
          {isReadOnly && (
            <span className="text-[9px] opacity-50" title="read only">👁</span>
          )}
          <span className="max-w-[120px] truncate">{displayName(currentUser)}</span>
          <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-none border-border bg-background min-w-[180px] p-0"
      >
        {/* Identity header */}
        <div className="px-3 py-2.5 border-b border-border/60">
          <p className="text-[9px] font-mono text-muted-foreground/50 truncate">
            {currentUser.pubkey.slice(0, 20)}…
          </p>
          {isReadOnly && (
            <p className="text-[9px] font-mono text-accent/60 mt-0.5">read only</p>
          )}
        </div>

        {/* Other accounts */}
        {otherUsers.length > 0 && (
          <>
            <div className="px-3 pt-2 pb-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
                switch
              </p>
            </div>
            {otherUsers.map(user => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setLogin(user.id)}
                className="rounded-none font-mono text-xs px-3 py-2 cursor-pointer focus:bg-card"
              >
                <span className="truncate">{displayName(user)}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border/60 my-0" />
          </>
        )}

        <DropdownMenuItem
          onClick={onAddAccountClick}
          className="rounded-none font-mono text-xs px-3 py-2 cursor-pointer focus:bg-card gap-2"
        >
          <UserPlus className="w-3 h-3" />
          add account
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/60 my-0" />

        <DropdownMenuItem
          onClick={() => removeLogin(currentUser.id)}
          className="rounded-none font-mono text-xs px-3 py-2 cursor-pointer focus:bg-card gap-2 text-red-400 focus:text-red-300"
        >
          <LogOut className="w-3 h-3" />
          disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
