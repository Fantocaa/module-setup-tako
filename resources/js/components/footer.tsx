import { Container } from '@/components/ui/container';
import { Link } from '@inertiajs/react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-border/50 bg-secondary/30 py-12 lg:py-16">
            <Container>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/courses"
                            className="flex items-center gap-2 font-bold text-foreground"
                        >
                            <img
                                src="https://design.intentui.com/logo?color=155DFC"
                                alt="Tako LMS"
                                className="h-8 w-8 rounded-lg"
                            />
                            <span className="text-xl tracking-tight">
                                Tako{' '}
                                <span className="font-medium text-muted-fg">
                                    LMS
                                </span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-fg">
                            Platform belajar online modern untuk meningkatkan
                            skill digital Anda melalui kurikulum yang
                            terstruktur dan materi berkualitas tinggi.
                        </p>
                        {/* <div className="mt-8 flex items-center gap-5">
                            <a
                                href="#"
                                className="text-muted-fg transition-colors hover:text-foreground"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-fg transition-colors hover:text-foreground"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-fg transition-colors hover:text-foreground"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-fg transition-colors hover:text-foreground"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div> */}
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                            Belajar
                        </h3>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <Link
                                    href="/courses"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    Semua Course
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/history"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    Riwayat Belajar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/watch-later"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    Tonton Nanti
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                            Bantuan
                        </h3>
                        <ul className="mt-6 space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    Syarat & Ketentuan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-base text-muted-fg transition-colors hover:text-primary"
                                >
                                    Kebijakan Privasi
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-border/50 pt-8 lg:mt-20">
                    <p className="text-center text-sm text-muted-fg lg:text-left">
                        &copy; {currentYear} Tako LMS. Built with modern
                        technology and ❤️ by Fantocaa.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
