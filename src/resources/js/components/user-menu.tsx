import { Avatar } from '@/components/ui/intent-avatar';
import {
    Menu,
    MenuContent,
    MenuHeader,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
} from '@/components/ui/menu';
import type { SharedData } from '@/types';
import {
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { router, usePage } from '@inertiajs/react';
import { Clock, History } from 'lucide-react';

export function UserMenu() {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <Menu>
            <MenuTrigger aria-label="Open Menu">
                <Avatar
                    alt={auth.user.name}
                    size="md"
                    isSquare
                    src={
                        auth.user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`
                    }
                />
            </MenuTrigger>
            <MenuContent
                placement="bottom right"
                className="min-w-60 sm:min-w-56"
            >
                <MenuHeader separator>
                    <span className="block">{auth.user.name}</span>
                    <span className="font-normal text-muted-fg">
                        {auth.user.email}
                    </span>
                </MenuHeader>

                {/* <MenuItem href="/dashboard">
                    <Squares2X2Icon />
                    Dashboard
                </MenuItem> */}
                <MenuItem href="/history">
                    <History data-slot="icon" />
                    History
                </MenuItem>
                <MenuItem href="/watch-later">
                    <Clock data-slot="icon" />
                    Tonton Nanti
                </MenuItem>
                <MenuItem href="/profile">
                    <Cog6ToothIcon data-slot="icon" />
                    Settings
                </MenuItem>

                <MenuSeparator />
                <MenuItem onAction={handleLogout}>
                    <ArrowRightOnRectangleIcon data-slot="icon" />
                    Log out
                </MenuItem>
            </MenuContent>
        </Menu>
    );
}
