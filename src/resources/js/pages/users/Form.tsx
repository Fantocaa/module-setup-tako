import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Role {
    id: number;
    name: string;
}

interface Position {
    id: number;
    name: string;
}

interface User {
    id?: number;
    name: string;
    email: string;
    role?: string;
    position_id?: number;
}

interface Props {
    user?: User;
    roles: Role[];
    positions: Position[];
    currentRole?: string;
}

export default function UserForm({
    user,
    roles,
    positions,
    currentRole,
}: Props) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: currentRole || '',
        position_id: user?.position_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? put(`/users/${user?.id}`) : post('/users');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'User Management', href: '/users' },
        { title: isEdit ? 'Edit User' : 'Create User', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit User' : 'Create User'} />
            <div className="flex-1 p-4 md:p-6">
                <Card className="mx-auto max-w-3xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {isEdit ? 'Edit User' : 'Create New User'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {isEdit
                                ? 'Update user data and role'
                                : 'Enter user data and set role'}
                        </p>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="mb-2 block"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Full name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={
                                            errors.name ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="mb-2 block"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="Email address"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className={
                                            errors.email ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="mb-2 block"
                                    >
                                        Password {isEdit ? '(Optional)' : ''}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className={
                                            errors.password
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <Label
                                        htmlFor="role"
                                        className="mb-2 block"
                                    >
                                        Role
                                    </Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) =>
                                            setData('role', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.name}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                {/* Position */}
                                <div>
                                    <Label
                                        htmlFor="position_id"
                                        className="mb-2 block"
                                    >
                                        Position (Jabatan)
                                    </Label>
                                    <Select
                                        value={data.position_id?.toString()}
                                        onValueChange={(value) =>
                                            setData(
                                                'position_id',
                                                value === 'none' ? '' : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            {positions.map((position) => (
                                                <SelectItem
                                                    key={position.id}
                                                    value={position.id.toString()}
                                                >
                                                    {position.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.position_id && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.position_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
                                <Link
                                    href="/users"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Back
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    {processing ? (
                                        <span className="animate-pulse">
                                            Saving...
                                        </span>
                                    ) : isEdit ? (
                                        'Save Changes'
                                    ) : (
                                        'Create User'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
