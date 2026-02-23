import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Edit, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

dayjs.extend(relativeTime);
dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

interface Role {
    id: number;
    name: string;
}

interface Position {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Role[];
    position_id: number | null;
    position: Position | null;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    roles: Role[];
    positions: Position[];
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

export default function UserIndex({ users, roles, positions }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            password: '',
            role: '',
            position_id: '' as string | number,
        });

    const handleDelete = (id: number) => {
        router.delete(`/users/${id}`, {
            onSuccess: () => toast.success('User deleted successfully'),
            onError: () => toast.error('Failed to delete user'),
        });
    };

    const handleResetPassword = (id: number) => {
        router.put(
            `/users/${id}/reset-password`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Password reset successfully'),
                onError: () => toast.error('Failed to reset password'),
            },
        );
    };

    const openCreateDialog = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0]?.name || '',
            position_id: user.position_id || '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('User updated successfully');
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('User created successfully');
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            User Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage user data and their roles within the system.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <div className="space-y-2 divide-y rounded-md border bg-background">
                    {users.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            No user data available.
                        </div>
                    ) : (
                        users.data.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col justify-between gap-4 px-4 py-5 transition hover:bg-muted/50 md:flex-row md:items-center"
                            >
                                {/* Avatar dan Informasi */}
                                <div className="flex flex-1 items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold text-primary">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-base font-medium">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {user.email}
                                        </div>
                                        <div className="text-xs text-muted-foreground italic">
                                            Registered{' '}
                                            {dayjs(user.created_at).fromNow()}
                                        </div>
                                        {user.roles.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {user.position && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-primary/30 text-xs font-semibold text-primary"
                                                    >
                                                        {user.position.name}
                                                    </Badge>
                                                )}
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="secondary"
                                                        className="text-xs font-normal"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="flex flex-wrap gap-2 md:justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditDialog(user)}
                                    >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                            >
                                                Reset
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset Password?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Password for{' '}
                                                    <strong>{user.name}</strong>{' '}
                                                    will be reset to:
                                                    <br />
                                                    <code className="rounded bg-muted px-2 py-1 text-sm">
                                                        ResetPasswordNya
                                                    </code>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleResetPassword(
                                                            user.id,
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    Yes, Reset
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete User?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    User{' '}
                                                    <strong>{user.name}</strong>{' '}
                                                    will be permanently deleted.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    disabled={processing}
                                                >
                                                    Yes, Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Create User'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? 'Update user data and role'
                                : 'Enter user data and set role'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Full name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {editingUser ? '(Optional)' : ''}
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
                                    errors.password ? 'border-red-500' : ''
                                }
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
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
                                <p className="text-sm text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Position */}
                        <div className="space-y-2">
                            <Label htmlFor="position_id">
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
                                    <SelectItem value="none">None</SelectItem>
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
                                <p className="text-sm text-red-500">
                                    {errors.position_id}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Saving...'
                                    : editingUser
                                      ? 'Save Changes'
                                      : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
