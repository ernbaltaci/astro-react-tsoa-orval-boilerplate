import * as React from 'react';
import { Button } from '@/lib/components/ui/button';
import { cn } from '@/lib/utils';

export type NavbarAction = {
  key: string;
  label: string;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
};

type NavbarProps = {
  title?: string;
  className?: string;
  actions?: NavbarAction[];
  rightSlot?: React.ReactNode;
};

export function Navbar({
  title = 'Dashboard',
  className,
  actions,
  rightSlot,
}: NavbarProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b bg-background px-4',
        className
      )}
    >
      <div className='font-semibold'>{title}</div>
      <div className='flex items-center gap-2'>
        {actions?.map((a) => (
          <Button
            key={a.key}
            variant={a.variant}
            size={a.size}
            onClick={a.onClick}
          >
            {a.label}
          </Button>
        ))}
        {rightSlot}
      </div>
    </header>
  );
}

export default Navbar;

