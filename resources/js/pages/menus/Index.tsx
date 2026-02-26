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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComboboxPermission from '@/components/ui/combobox-permission';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import IconPicker from '@/components/ui/icon-picker';
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
import SortableMenuItem from '@/pages/menus/SortableMenuItem';
import { type BreadcrumbItem } from '@/types';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    Edit,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MenuItem {
    id: number;
    title: string;
    route: string;
    icon: string;
    parent_id: number | null;
    permission_name: string | null;
    order: number;
    children?: MenuItem[];
}

interface Props {
    menuItems: MenuItem[];
    parentMenus: { id: number; title: string }[];
    permissions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu Management',
        href: '/menus',
    },
];

export default function MenuIndex({
    menuItems,
    parentMenus,
    permissions,
}: Props) {
    const [menus, setMenus] = useState<MenuItem[]>(menuItems);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        route: '',
        icon: '',
        parent_id: null as number | null,
        permission_name: '',
    });

    useEffect(() => {
        if (selectedMenu) {
            setData({
                title: selectedMenu.title || '',
                route: selectedMenu.route || '',
                icon: selectedMenu.icon || '',
                parent_id: selectedMenu.parent_id ?? null,
                permission_name: selectedMenu.permission_name || '',
            });
        } else {
            reset();
        }
    }, [selectedMenu]);

    useEffect(() => {
        setMenus(menuItems);
    }, [menuItems]);

    const handleOpen = (menu: MenuItem | null = null) => {
        setSelectedMenu(menu);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedMenu(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = selectedMenu ? `/menus/${selectedMenu.id}` : '/menus';
        const method = selectedMenu ? put : post;

        method(url, {
            onSuccess: () => {
                handleClose();
                toast.success(
                    selectedMenu
                        ? 'Menu updated successfully'
                        : 'Menu created successfully',
                );
            },
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
    );

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = menus.findIndex((m) => m.id === Number(active.id));
        const newIndex = menus.findIndex((m) => m.id === Number(over.id));

        setMenus((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    const handleChildDragEnd = (parentId: number) => (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setMenus((prevMenus) =>
            prevMenus.map((menu) => {
                if (menu.id !== parentId || !menu.children) return menu;

                const oldIndex = menu.children.findIndex(
                    (m) => m.id === Number(active.id),
                );
                const newIndex = menu.children.findIndex(
                    (m) => m.id === Number(over.id),
                );
                if (oldIndex === -1 || newIndex === -1) return menu;

                const newChildren = arrayMove(
                    menu.children,
                    oldIndex,
                    newIndex,
                );
                return { ...menu, children: newChildren };
            }),
        );
    };

    const handleSave = () => {
        setIsSaving(true);

        const buildOrderPayload = (items: MenuItem[]): any[] => {
            return items.map((item, index) => ({
                id: item.id,
                order: index + 1,
                children: item.children ? buildOrderPayload(item.children) : [],
            }));
        };

        router.post(
            '/menus/reorder',
            { menus: buildOrderPayload(menus) },
            {
                onSuccess: () => toast.success('Menu order saved successfully'),
                onError: () => toast.error('Failed to save menu order'),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(`/menus/${id}`, {
            onSuccess: () => {
                setMenus((prev) =>
                    prev
                        .map((m) => ({
                            ...m,
                            children:
                                m.children?.filter((c) => c.id !== id) || [],
                        }))
                        .filter((m) => m.id !== id),
                );
                toast.success('Menu deleted successfully.');
            },
            onError: () => toast.error('Failed to delete menu.'),
        });
    };

    function renderMenuList(
        items: MenuItem[],
        level: number = 0,
    ): JSX.Element[] {
        const levelIndentMap = [
            'ml-0',
            'ml-4',
            'ml-8',
            'ml-12',
            'ml-16',
            'ml-20',
        ];

        return items.map((menu) => {
            const hasChildren = menu.children && menu.children.length > 0;
            const isExpanded = expandedIds.includes(menu.id);
            const indentClass = levelIndentMap[level] || 'ml-20';

            return (
                <div key={menu.id}>
                    <div
                        className={`flex items-center justify-between rounded-lg border bg-background px-4 py-3 shadow-sm transition-shadow hover:shadow ${indentClass}`}
                    >
                        <div className="flex flex-1 items-center gap-2">
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(menu.id)}
                                    className="text-muted-foreground transition hover:text-primary"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                            ) : (
                                <span className="w-4" />
                            )}

                            <SortableMenuItem
                                id={menu.id.toString()}
                                title={menu.title}
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-primary"
                                onClick={() => handleOpen(menu)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Delete this menu?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the
                                            menu "{menu.title}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleDelete(menu.id)
                                            }
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="mt-4 space-y-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleChildDragEnd(menu.id)}
                            >
                                <SortableContext
                                    items={menu.children!.map((c) =>
                                        c.id.toString(),
                                    )}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {renderMenuList(menu.children!, level + 1)}
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>
            );
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Management" />

            <div className="flex-1 p-4 md:p-6">
                <Card className="w-full">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    Menu Management
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop to reorder main menus and
                                    submenus
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSaving ? 'Saving...' : 'Save Order'}
                                </Button>
                                <Button onClick={() => handleOpen()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Menu
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6">
                        {menus.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="mb-4 text-muted-foreground">
                                    No menus available
                                </p>
                                <Button onClick={() => handleOpen()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Menu
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={menus.map((m) =>
                                            m.id.toString(),
                                        )}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4">
                                            {renderMenuList(menus)}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedMenu ? 'Edit Menu' : 'Add New Menu'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMenu
                                ? 'Update menu details'
                                : 'Create a new menu for the system'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Menu Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Example: Dashboard"
                                    className={
                                        errors.title ? 'border-red-500' : ''
                                    }
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="route">Route</Label>
                                <Input
                                    id="route"
                                    value={data.route}
                                    onChange={(e) =>
                                        setData('route', e.target.value)
                                    }
                                    placeholder="Example: /dashboard"
                                    className={
                                        errors.route ? 'border-red-500' : ''
                                    }
                                />
                                {errors.route && (
                                    <p className="text-sm text-red-500">
                                        {errors.route}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (Lucide)</Label>
                                <IconPicker
                                    value={data.icon}
                                    onChange={(val) => setData('icon', val)}
                                />
                                {errors.icon && (
                                    <p className="text-sm text-red-500">
                                        {errors.icon}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent_id">Parent Menu</Label>
                                <Select
                                    value={
                                        data.parent_id
                                            ? String(data.parent_id)
                                            : 'none'
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'parent_id',
                                            value === 'none'
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="parent_id"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="— None —" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            — None —
                                        </SelectItem>
                                        {parentMenus
                                            .filter(
                                                (m) =>
                                                    m.id !== selectedMenu?.id,
                                            )
                                            .map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={String(m.id)}
                                                >
                                                    {m.title}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="permission_name">
                                    Permission
                                </Label>
                                <ComboboxPermission
                                    value={data.permission_name || ''}
                                    onChange={(val) =>
                                        setData('permission_name', val)
                                    }
                                    options={permissions}
                                />
                                {errors.permission_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.permission_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">↻</span>
                                        {selectedMenu
                                            ? 'Saving...'
                                            : 'Creating...'}
                                    </span>
                                ) : selectedMenu ? (
                                    'Save Changes'
                                ) : (
                                    'Create Menu'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
