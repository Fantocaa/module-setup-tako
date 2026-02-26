import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { columns, PsychotestLink } from './columns';
import { DataTable } from './data-table';

interface Props {
    links: PsychotestLink[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Psychotest Management',
        href: '/psychotest',
    },
];

const AVAILABLE_TESTS = [
    { id: 'papicostic', title: 'Papicostic' },
    { id: 'cfit', title: 'CFIT' },
    { id: 'disc', title: 'DISC' },
    { id: 'skill_test', title: 'Skill Test' },
];

export default function PsychotestIndex({ links }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            applicant_name: '',
            applicant_email: '',
            included_tests: [] as string[],
            skill_category: '',
        });

    const toggleTest = (testId: string) => {
        const current = [...data.included_tests];
        if (current.includes(testId)) {
            setData(
                'included_tests',
                current.filter((id) => id !== testId),
            );
        } else {
            setData('included_tests', [...current, testId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            included_tests: data.included_tests.map((test) => {
                if (test === 'skill_test' && data.skill_category) {
                    return `skill_test:${data.skill_category}`;
                }
                return test;
            }),
        }));

        post('/psychotest-link', {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast.success('Temporary link generated!');
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Psychotest Management" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Psychotest Links
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage and test temporary links for applicants
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    placeholder="Filter applicants..."
                                    value={
                                        (columnFilters.find(
                                            (f: { id: string }) =>
                                                f.id === 'applicant_name',
                                        )?.value as string) ?? ''
                                    }
                                    onChange={(event) =>
                                        setColumnFilters([
                                            {
                                                id: 'applicant_name',
                                                value: event.target.value,
                                            },
                                        ])
                                    }
                                    className="w-64 pl-9"
                                />
                            </div>
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Generate Link
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Generate Temporary Link
                                        </DialogTitle>
                                        <DialogDescription>
                                            Create a temporary link for an
                                            applicant to take the test.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="applicant_name">
                                                Applicant Name
                                            </Label>
                                            <Input
                                                id="applicant_name"
                                                value={data.applicant_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'applicant_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter applicant name"
                                            />
                                            {errors.applicant_name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.applicant_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="applicant_email">
                                                Applicant Email (Optional)
                                            </Label>
                                            <Input
                                                id="applicant_email"
                                                value={data.applicant_email}
                                                onChange={(e) =>
                                                    setData(
                                                        'applicant_email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter applicant email"
                                            />
                                            {errors.applicant_email && (
                                                <p className="text-sm text-red-500">
                                                    {errors.applicant_email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Tests to Include</Label>
                                            <div className="grid grid-cols-2 gap-4 rounded-xl border p-4">
                                                {AVAILABLE_TESTS.map((test) => (
                                                    <div
                                                        key={test.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={test.id}
                                                            checked={data.included_tests.includes(
                                                                test.id,
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleTest(
                                                                    test.id,
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={test.id}
                                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {test.title}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>

                                            {data.included_tests.includes(
                                                'skill_test',
                                            ) && (
                                                <div className="mt-4 animate-in space-y-2 rounded-xl border p-4 transition-all fade-in slide-in-from-top-2">
                                                    <Label
                                                        htmlFor="skill_category"
                                                        className="text-xs font-bold uppercase"
                                                    >
                                                        Skill Category (Required
                                                        for Skill Test)
                                                    </Label>
                                                    <Input
                                                        id="skill_category"
                                                        value={
                                                            data.skill_category
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'skill_category',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="e.g. Accounting"
                                                        className="h-10 border-indigo-200 bg-white"
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">
                                                        System will only show
                                                        questions matching this
                                                        category.
                                                    </p>
                                                </div>
                                            )}

                                            <p className="text-xs text-muted-foreground">
                                                Default includes all tests if
                                                none selected.
                                            </p>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Generating...'
                                                    : 'Generate'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6">
                        <DataTable
                            columns={columns}
                            data={links}
                            columnFilters={columnFilters}
                            onColumnFiltersChange={setColumnFilters}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
