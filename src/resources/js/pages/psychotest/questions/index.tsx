import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import QuestionForm from './form';

interface PsychotestQuestion {
    id: number;
    test_type: string;
    session_number: number;
    section_number: number | null;
    question_number: number;
    type: string;
    content: any;
    options: any;
}

interface Props {
    questions: PsychotestQuestion[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Psychotest Questions',
        href: '/psychotest-questions',
    },
];

// --- Columns were moved into the component to access state ---

export default function QuestionsIndex({ questions }: Props) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] =
        useState<PsychotestQuestion | null>(null);

    const columns: ColumnDef<PsychotestQuestion>[] = [
        {
            accessorKey: 'test_type',
            header: 'Test Type',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.test_type.toUpperCase()}
                </Badge>
            ),
        },
        {
            accessorKey: 'session_number',
            header: 'Session',
            cell: ({ row }) => row.original.session_number,
        },
        {
            accessorKey: 'question_number',
            header: 'No.',
            cell: ({ row }) => row.original.question_number,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => row.original.type,
        },
        {
            accessorKey: 'content',
            header: 'Content',
            cell: ({ row }) => {
                const content = row.original.content;
                return (
                    <div className="max-w-[300px] truncate text-xs text-muted-foreground">
                        {content?.text
                            ? content.text
                            : content
                              ? JSON.stringify(content)
                              : '-'}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const question = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditingQuestion(question);
                                        setIsEditOpen(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                'Are you sure you want to delete this question?',
                                            )
                                        ) {
                                            router.delete(
                                                `/psychotest-questions/${question.id}`,
                                                {
                                                    onSuccess: () =>
                                                        toast.success(
                                                            'Question deleted',
                                                        ),
                                                },
                                            );
                                        }
                                    }}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    // Table Instance
    const table = useReactTable({
        data: questions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Psychotest Questions" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Psychotest Questions
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage questions for Papicostic, CFIT, and DISC.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Filter type..."
                                    value={
                                        (table
                                            .getColumn('test_type')
                                            ?.getFilterValue() as string) ?? ''
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn('test_type')
                                            ?.setFilterValue(event.target.value)
                                    }
                                    className="w-40 pl-9"
                                />
                            </div>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Create Dialog */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogContent className="max-h-[90vh] w-full p-0 sm:max-w-6xl">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle>Add New Question</DialogTitle>
                                <DialogDescription>
                                    Create a new question for the psychotest
                                    assessment.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[calc(90vh-120px)] p-6">
                                <QuestionForm
                                    mode="create"
                                    onSuccess={() => {
                                        setIsCreateOpen(false);
                                        toast.success(
                                            'Question created successfully',
                                        );
                                    }}
                                    onCancel={() => setIsCreateOpen(false)}
                                />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-h-[90vh] w-full p-0 sm:max-w-6xl">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle>Edit Question</DialogTitle>
                                <DialogDescription>
                                    Modify the question details and response
                                    options.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[calc(90vh-120px)] p-6">
                                {editingQuestion && (
                                    <QuestionForm
                                        mode="edit"
                                        question={editingQuestion}
                                        onSuccess={() => {
                                            setIsEditOpen(false);
                                            setEditingQuestion(null);
                                            toast.success(
                                                'Question updated successfully',
                                            );
                                        }}
                                        onCancel={() => {
                                            setIsEditOpen(false);
                                            setEditingQuestion(null);
                                        }}
                                    />
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                    <Separator />
                    <CardContent className="pt-6">
                        <div className="rounded-md border">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 font-medium text-muted-foreground">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <th
                                                            key={header.id}
                                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                                        >
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                      header
                                                                          .column
                                                                          .columnDef
                                                                          .header,
                                                                      header.getContext(),
                                                                  )}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        ))}
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
