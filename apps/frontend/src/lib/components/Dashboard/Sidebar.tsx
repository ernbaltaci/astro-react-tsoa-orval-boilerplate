import { cn } from '@/lib/utils';

export type SidebarItem = { label: string; href: string };

type SidebarProps = {
  items: SidebarItem[];
  className?: string;
};

export function Sidebar({ items, className }: SidebarProps) {
  return (
    <aside className={cn('w-60 border-r p-3', className)}>
      <nav className='space-y-1'>
        {items.map((i) => (
          <a
            key={i.href}
            href={i.href}
            className='block rounded px-2 py-1 hover:bg-accent'
          >
            {i.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

