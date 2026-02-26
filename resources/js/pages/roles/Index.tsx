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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Save, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Management',
        href: '/roles',
    },
];

interface Permission {
    id: number;
    name: string;
    group: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    roles: Role[];
    groupedPermissions: Record<string, Permission[]>;
}

export default function RoleIndex({ roles, groupedPermissions }: Props) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            permissions: [] as string[],
        });

    const handleDelete = (id: number) => {
        router.delete(`/roles/${id}`, {
            onSuccess: () => toast.success('Role deleted successfully'),
            onError: () => toast.error('Failed to delete role'),
        });
    };

    const togglePermission = (perm: string) => {
        setData(
            'permissions',
            data.permissions.includes(perm)
                ? data.permissions.filter((p) => p !== perm)
                : [...data.permissions, perm],
        );
    };

    const toggleGroup = (group: string, perms: Permission[]) => {
        const allChecked = perms.every((perm) =>
            data.permissions.includes(perm.name),
        );
        if (allChecked) {
            setData(
                'permissions',
                data.permissions.filter(
                    (p) => !perms.map((perm) => perm.name).includes(p),
                ),
            );
        } else {
            const newPermissions = [...data.permissions];
            perms.forEach((perm) => {
                if (!newPermissions.includes(perm.name)) {
                    newPermissions.push(perm.name);
                }
            });
            setData('permissions', newPermissions);
        }
    };

    const openCreateSheet = () => {
        setEditingRole(null);
        reset();
        clearErrors();
        setIsSheetOpen(true);
    };

    const openEditSheet = (role: Role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map((p) => p.name),
        });
        clearErrors();
        setIsSheetOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRole) {
            put(`/roles/${editingRole.id}`, {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    toast.success('Role updated successfully');
                },
            });
        } else {
            post('/roles', {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    toast.success('Role created successfully');
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Role Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage roles and permissions for the system
                        </p>
                    </div>
                    <Button size="sm" onClick={openCreateSheet}>
                        + Add Role
                    </Button>
                </div>

                <div className="space-y-4">
                    {roles.length === 0 && (
                        <Card>
                            <CardContent className="py-6 text-center text-muted-foreground">
                                No role data available.
                            </CardContent>
                        </Card>
                    )}

                    {roles.map((role) => (
                        <Card key={role.id} className="border pt-0 shadow-sm">
                            <CardHeader className="space-y-2 border-b bg-muted/40 pt-6 pb-6 md:flex-row md:items-center md:justify-between md:space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        {role.name}
                                    </CardTitle>
                                    <div className="text-sm text-muted-foreground">
                                        {role.permissions.length} permission
                                        {role.permissions.length > 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditSheet(role)}
                                    >
                                        <Edit className="mr-1 h-3.5 w-3.5" />
                                        Edit
                                    </Button>

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
                                                    Are you sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Role{' '}
                                                    <strong>{role.name}</strong>{' '}
                                                    will be permanently deleted.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(role.id)
                                                    }
                                                    disabled={processing}
                                                >
                                                    Yes, Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardHeader>

                            {role.permissions.length > 0 && (
                                <CardContent className="">
                                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                                        Permissions:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map((permission) => (
                                            <Badge
                                                key={permission.id}
                                                variant="outline"
                                                className="border-muted text-xs font-normal"
                                            >
                                                {permission.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>
                            {editingRole ? 'Edit Role' : 'Create Role'}
                        </SheetTitle>
                        <SheetDescription>
                            {editingRole
                                ? 'Update role details and permissions'
                                : 'Create a new role and set permissions'}
                        </SheetDescription>
                    </SheetHeader>

                    <form
                        onSubmit={handleSubmit}
                        className="flex h-[calc(100vh-7rem)] flex-col space-y-6"
                    >
                        <div className="mx-4 space-y-4">
                            <div>
                                <Label htmlFor="name" className="mb-2 block">
                                    Role Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter role name"
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

                            <Separator />

                            <div className="flex-1 overflow-hidden">
                                <div className="mb-4">
                                    <h2 className="font-semiboldText text-lg">
                                        Permissions
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Select permissions to grant to this role
                                    </p>
                                </div>

                                <ScrollArea className="h-[calc(100vh-22rem)] pr-6">
                                    <div className="space-y-4">
                                        {Object.entries(groupedPermissions).map(
                                            ([group, perms]) => {
                                                const allChecked = perms.every(
                                                    (perm) =>
                                                        data.permissions.includes(
                                                            perm.name,
                                                        ),
                                                );

                                                return (
                                                    <div
                                                        key={group}
                                                        className="rounded-lg border bg-muted/20 p-4"
                                                    >
                                                        <div className="mb-3 flex items-center gap-3">
                                                            <Checkbox
                                                                id={`group-${group}`}
                                                                checked={
                                                                    allChecked
                                                                }
                                                                onCheckedChange={() =>
                                                                    toggleGroup(
                                                                        group,
                                                                        perms,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`group-${group}`}
                                                                className="cursor-pointer text-sm font-medium tracking-wider text-muted-foreground uppercase"
                                                            >
                                                                {group}
                                                            </label>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3 pl-7 sm:grid-cols-2">
                                                            {perms.map(
                                                                (perm) => (
                                                                    <div
                                                                        key={
                                                                            perm.id
                                                                        }
                                                                        className="flex items-center gap-3"
                                                                    >
                                                                        <Checkbox
                                                                            id={`perm-${perm.id}`}
                                                                            checked={data.permissions.includes(
                                                                                perm.name,
                                                                            )}
                                                                            onCheckedChange={() =>
                                                                                togglePermission(
                                                                                    perm.name,
                                                                                )
                                                                            }
                                                                        />
                                                                        <label
                                                                            htmlFor={`perm-${perm.id}`}
                                                                            className="cursor-pointer text-sm"
                                                                        >
                                                                            {
                                                                                perm.name
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end gap-3 border-t pt-4 pr-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Saving...'
                                    : editingRole
                                      ? 'Save Changes'
                                      : 'Create Role'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsSheetOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
