'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { icons } from '@/constants/icons';

import { DashboardSidebarMenuInterface } from '@/lib/types';

import { cn } from '@/lib/utils';

export default function SidebarNavAdmin({
    menuLinks,
}: {
    menuLinks: DashboardSidebarMenuInterface[];
}) {
    const pathname = usePathname();
    return (
        <nav className="relative grow">
            <Command className="rounded-lg overflow-visible bg-transparent">
                <CommandInput placeholder="Search..." />
                <CommandList className="py-2 overflow-visible">
                    {!menuLinks.length && <CommandEmpty>No Links Found.</CommandEmpty>}
                    <CommandGroup className="overflow-visible pt-0 relative">
                        {menuLinks.map((link, index) => {
                            let icon;
                            const iconSearch = icons.find((icon) => icon.value === link.icon);
                            if (iconSearch) icon = <iconSearch.path />;
                            return (
                                <Link key={index} href={link.link}>
                                    <CommandItem
                                        className={cn('w-full h-12 cursor-pointer mt-1', {
                                            'bg-accent text-accent-foreground':
                                                link.link === pathname,
                                        })}
                                    >
                                        <div className="flex items-center gap-2 rounded-md transition-all w-full">
                                            {icon}
                                            <span>{link.label}</span>
                                        </div>
                                    </CommandItem>
                                </Link>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
        </nav>
    );
}
