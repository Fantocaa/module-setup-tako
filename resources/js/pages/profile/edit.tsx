import { update } from '@/routes/profile';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/intent-avatar';
import { Label } from '@/components/ui/label';
import password from '@/routes/password';
import { ArrowLeft } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name,
            email: auth.user.email,
        });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        errors: passwordErrors,
        reset: resetPassword,
        processing: passwordProcessing,
        recentlySuccessful: passwordRecentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update().url, {
            preserveScroll: true,
        });
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword(password.update().url, {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
            onError: () => {
                if (passwordErrors.password) {
                    resetPassword('password', 'password_confirmation');
                }
                if (passwordErrors.current_password) {
                    resetPassword('current_password');
                }
            },
        });
    };

    return (
        <>
            <Head title="Profile" />

            <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
                <div className="flex items-center gap-4">
                    <Link
                        href="/courses"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Profile
                        </h1>
                        <p className="mt-2 text-muted-fg">
                            Manage your account information and how others see
                            you.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-muted/20 p-8 backdrop-blur-sm">
                            <Avatar
                                size="xl"
                                className="h-24 w-24 border-4 border-background shadow-2xl"
                                alt={auth.user.name}
                                isSquare
                                src={
                                    auth.user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`
                                }
                            />
                            <h2 className="mt-4 text-center text-xl font-bold text-white">
                                {auth.user.name}
                            </h2>
                            <p className="text-center text-sm text-muted-fg">
                                {auth.user.email}
                            </p>
                        </div>

                        <nav className="flex flex-col space-y-1">
                            <div className="flex cursor-default items-center rounded-lg px-4 py-2 text-xl font-medium text-primary transition-colors">
                                Profile Information
                            </div>
                            <p className="px-4 pb-2 text-sm leading-relaxed text-muted-fg">
                                Only profile updates are available for your
                                account type.
                            </p>
                        </nav>
                    </div>

                    <div className="space-y-8 lg:col-span-8">
                        <Card className="border-border/50 bg-card/40 ring-1 ring-white/5 backdrop-blur-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold tracking-tight">
                                    Personal Information
                                </CardTitle>
                                <CardDescription className="text-muted-fg">
                                    Update your basic profile details below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-sm font-medium text-white/80"
                                            >
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                className="h-11 border-white/10 bg-black/20 transition-all placeholder:text-muted-fg/50 focus:border-primary/40 focus:ring-primary/40"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium text-white/80"
                                            >
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="h-11 border-white/10 bg-black/20 transition-all placeholder:text-muted-fg/50 focus:border-primary/40 focus:ring-primary/40"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                autoComplete="username"
                                                placeholder="Enter your email"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at ===
                                            null && (
                                            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 backdrop-blur-sm">
                                                <p className="text-sm leading-relaxed text-orange-200/90">
                                                    Your email address is
                                                    currently unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        method="post"
                                                        as="button"
                                                        className="font-semibold text-orange-400 underline decoration-orange-500/30 underline-offset-4 transition-colors hover:text-orange-300"
                                                    >
                                                        Resend verification
                                                        email
                                                    </Link>
                                                </p>
                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-2 text-xs font-medium text-green-400">
                                                        A fresh verification
                                                        link has been sent to
                                                        your inbox.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button disabled={processing} size="lg">
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-out duration-300"
                                            enterFrom="opacity-0 translate-x-4"
                                            leave="transition ease-in duration-300"
                                            leaveTo="opacity-0 -translate-x-4"
                                        >
                                            <p className="flex items-center gap-2 text-sm font-medium text-green-400">
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Changes saved successfully
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/40 ring-1 ring-white/5 backdrop-blur-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold tracking-tight">
                                    Update Password
                                </CardTitle>
                                <CardDescription className="text-muted-fg">
                                    Ensure your account is using a long, random
                                    password to stay secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={updatePassword}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="current_password"
                                                className="text-sm font-medium text-white/80"
                                            >
                                                Current Password
                                            </Label>
                                            <Input
                                                id="current_password"
                                                type="password"
                                                className="h-11 border-white/10 bg-black/20 transition-all placeholder:text-muted-fg/50 focus:border-primary/40 focus:ring-primary/40"
                                                value={
                                                    passwordData.current_password
                                                }
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        'current_password',
                                                        e.target.value,
                                                    )
                                                }
                                                autoComplete="current-password"
                                                placeholder="Enter current password"
                                            />
                                            <InputError
                                                message={
                                                    passwordErrors.current_password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-medium text-white/80"
                                            >
                                                New Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                className="h-11 border-white/10 bg-black/20 transition-all placeholder:text-muted-fg/50 focus:border-primary/40 focus:ring-primary/40"
                                                value={passwordData.password}
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                autoComplete="new-password"
                                                placeholder="Enter new password"
                                            />
                                            <InputError
                                                message={
                                                    passwordErrors.password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="password_confirmation"
                                                className="text-sm font-medium text-white/80"
                                            >
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                className="h-11 border-white/10 bg-black/20 transition-all placeholder:text-muted-fg/50 focus:border-primary/40 focus:ring-primary/40"
                                                value={
                                                    passwordData.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                autoComplete="new-password"
                                                placeholder="Confirm new password"
                                            />
                                            <InputError
                                                message={
                                                    passwordErrors.password_confirmation
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            disabled={passwordProcessing}
                                            size="lg"
                                        >
                                            {passwordProcessing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    <span>Updating...</span>
                                                </div>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </Button>

                                        <Transition
                                            show={passwordRecentlySuccessful}
                                            enter="transition ease-out duration-300"
                                            enterFrom="opacity-0 translate-x-4"
                                            leave="transition ease-in duration-300"
                                            leaveTo="opacity-0 -translate-x-4"
                                        >
                                            <p className="flex items-center gap-2 text-sm font-medium text-green-400">
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Password updated successfully
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
