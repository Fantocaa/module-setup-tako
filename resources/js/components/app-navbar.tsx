import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Avatar } from '@/components/ui/intent-avatar';
import {
    Navbar,
    NavbarGap,
    NavbarItem,
    NavbarMobile,
    type NavbarProps,
    NavbarProvider,
    NavbarSection,
    NavbarSeparator,
    NavbarSpacer,
    NavbarStart,
    NavbarTrigger,
} from '@/components/ui/navbar';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from '@/components/user-menu';
import { Link } from '@inertiajs/react';

export default function AppNavbar(props: NavbarProps) {
    return (
        <NavbarProvider>
            <Navbar {...props}>
                <NavbarStart>
                    <Link
                        className="flex items-center gap-x-2 font-medium"
                        aria-label="Home"
                        href="/courses"
                    >
                        <Avatar
                            size="sm"
                            className="outline-hidden"
                            src="https://design.intentui.com/logo?color=155DFC"
                        />
                        <span className="text-base">
                            Tako <span className="text-muted-fg">LMS</span>
                        </span>
                    </Link>
                </NavbarStart>
                <NavbarGap />
                <NavbarSection>
                    <NavbarItem href="/courses" isCurrent>
                        Series
                    </NavbarItem>
                    {/* Add more navigation items here as needed */}
                </NavbarSection>
                <NavbarSpacer />
                <NavbarSection className="max-md:hidden">
                    <Separator
                        orientation="vertical"
                        className="mr-3 ml-1 h-5 opacity-50"
                    />
                    <AppearanceToggleDropdown className="mr-2" />
                    <UserMenu />
                </NavbarSection>
            </Navbar>
            <NavbarMobile>
                <NavbarTrigger />
                <NavbarSpacer />
                <AppearanceToggleDropdown className="mr-2" />
                <NavbarSeparator className="mr-2.5 opacity-50" />
                <UserMenu />
            </NavbarMobile>
        </NavbarProvider>
    );
}
