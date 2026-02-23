import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { iconMapper } from '@/lib/iconMapper';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import { ScrollArea } from './ui/scroll-area';

interface MenuItem {
    id: number;
    title: string;
    route: string | null;
    icon: string;
    children?: MenuItem[];
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

function RenderMenu({
    items,
    level = 0,
}: {
    items: MenuItem[];
    level?: number;
}) {
    const { url: currentUrl } = usePage();
    const [openMenus, setOpenMenus] = useState<number[]>([]);

    useEffect(() => {
        const findActiveParents = (
            menus: MenuItem[],
            parents: number[] = [],
        ): number[] => {
            for (const menu of menus) {
                if (!menu) continue;
                if (
                    menu.route &&
                    (currentUrl.startsWith(menu.route) ||
                        (menu.route === '/courses-index' &&
                            currentUrl.startsWith('/courses/')))
                ) {
                    return parents;
                }
                if (menu.children && menu.children.length > 0) {
                    const found = findActiveParents(menu.children, [
                        ...parents,
                        menu.id,
                    ]);
                    if (found.length) return found;
                }
            }
            return [];
        };

        const activeParents = findActiveParents(items);
        setOpenMenus(activeParents);
    }, [currentUrl, items]);

    const toggleMenu = (id: number) => {
        setOpenMenus((prev) =>
            prev.includes(id)
                ? prev.filter((mid) => mid !== id)
                : [...prev, id],
        );
    };

    if (!Array.isArray(items)) return null;

    return (
        <>
            {items.map((menu) => {
                if (!menu) return null;
                const Icon = iconMapper(menu.icon || 'Folder') as LucideIcon;
                const children = Array.isArray(menu.children)
                    ? menu.children.filter(Boolean)
                    : [];
                const hasChildren = children.length > 0;
                const isActive =
                    menu.route &&
                    (currentUrl.startsWith(menu.route) ||
                        (menu.route === '/courses-index' &&
                            currentUrl.startsWith('/courses/')));
                const indentClass = level > 0 ? `pl-${4 + level * 3}` : '';

                const activeClass = isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground';

                if (!menu.route && !hasChildren) return null;

                const isOpen = openMenus.includes(menu.id);

                return (
                    <SidebarMenuItem key={menu.id}>
                        {hasChildren ? (
                            <>
                                <SidebarMenuButton
                                    onClick={() => toggleMenu(menu.id)}
                                    className={cn(
                                        `group flex cursor-pointer items-center justify-between rounded-md transition-colors ${indentClass}`,
                                        activeClass,
                                        level === 0
                                            ? 'my-1 px-4 py-3'
                                            : 'px-3 py-2',
                                    )}
                                >
                                    <div className="flex items-center">
                                        <Icon className="mr-3 size-4 opacity-80 group-hover:opacity-100" />
                                        <span>{menu.title}</span>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            'size-4 opacity-50 transition-transform duration-200',
                                            isOpen ? 'rotate-180' : '',
                                        )}
                                    />
                                </SidebarMenuButton>

                                {isOpen && (
                                    <SidebarMenu className="ml-2 border-l border-muted pl-2">
                                        <RenderMenu
                                            items={children}
                                            level={level + 1}
                                        />
                                    </SidebarMenu>
                                )}
                            </>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                className={cn(
                                    `group flex items-center rounded-md transition-colors ${indentClass}`,
                                    activeClass,
                                    level === 0
                                        ? 'my-1 px-4 py-3'
                                        : 'px-3 py-2',
                                )}
                            >
                                <Link href={menu.route || '#'}>
                                    <Icon className="mr-3 size-4 opacity-80 group-hover:opacity-100" />
                                    <span>{menu.title}</span>
                                    {/* {level > 0 && <ChevronRight className="ml-auto size-4 opacity-0 group-hover:opacity-50" />} */}
                                    {level > 0}
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                );
            })}
        </>
    );
}

export function AppSidebar() {
    const { menus = [] } = usePage().props as { menus?: MenuItem[] };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea>
                    {/* <NavMain items={mainNavItems} /> */}
                    <RenderMenu items={menus} />
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
