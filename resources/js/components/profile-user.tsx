import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
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
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Settings
                    </h1>
                    <p className="mt-2 text-muted-fg">
                        Manage your account information and preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-8">
                            <Avatar
                                size="xl"
                                className="h-24 w-24 border-4 border-background shadow-xl"
                                alt={auth.user.name}
                                isSquare
                                src={
                                    auth.user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`
                                }
                            />
                            <h2 className="mt-4 text-xl font-bold text-white">
                                {auth.user.name}
                            </h2>
                            <p className="text-sm text-muted-fg">
                                {auth.user.email}
                            </p>

                            <div className="mt-6 flex w-full flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full text-xs"
                                    size="sm"
                                >
                                    Change Avatar
                                </Button>
                            </div>
                        </div>

                        <nav className="flex flex-col space-y-1">
                            <Link
                                href="/settings/profile"
                                className="flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors"
                            >
                                Profile Information
                            </Link>
                            {/* Disabled other links for now as requested user only can update profile */}
                        </nav>
                    </div>

                    <div className="space-y-8 md:col-span-2">
                        <Card className="border-border bg-card/50 ring-1 ring-white/5">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your accounts name and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...ProfileController.update.form()}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    className="space-y-6"
                                >
                                    {({
                                        processing,
                                        recentlySuccessful,
                                        errors,
                                    }) => (
                                        <>
                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        Full Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        className="h-11 border-border bg-background focus:ring-primary/20"
                                                        defaultValue={
                                                            auth.user.name
                                                        }
                                                        name="name"
                                                        required
                                                        autoComplete="name"
                                                        placeholder="Full name"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">
                                                        Email Address
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="h-11 border-border bg-background focus:ring-primary/20"
                                                        defaultValue={
                                                            auth.user.email
                                                        }
                                                        name="email"
                                                        required
                                                        autoComplete="username"
                                                        placeholder="Email address"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>
                                            </div>

                                            {mustVerifyEmail &&
                                                auth.user.email_verified_at ===
                                                    null && (
                                                    <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
                                                        <p className="text-sm text-orange-200">
                                                            Your email address
                                                            is unverified.{' '}
                                                            <Link
                                                                href={send()}
                                                                as="button"
                                                                className="font-semibold underline decoration-orange-500/30 underline-offset-4 hover:decoration-orange-500"
                                                            >
                                                                Resend
                                                                verification
                                                                email.
                                                            </Link>
                                                        </p>
                                                        {status ===
                                                            'verification-link-sent' && (
                                                            <div className="mt-2 text-xs font-medium text-orange-400">
                                                                A new
                                                                verification
                                                                link has been
                                                                sent.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            <div className="flex items-center gap-4 pt-2">
                                                <Button
                                                    disabled={processing}
                                                    size="lg"
                                                    className="px-8"
                                                >
                                                    {processing
                                                        ? 'Saving...'
                                                        : 'Save Changes'}
                                                </Button>

                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out duration-300"
                                                    enterFrom="opacity-0 translate-y-1"
                                                    leave="transition ease-in-out duration-300"
                                                    leaveTo="opacity-0 -translate-y-1"
                                                >
                                                    <p className="text-sm font-medium text-green-500">
                                                        Successfully saved!
                                                    </p>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        <DeleteUser />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
