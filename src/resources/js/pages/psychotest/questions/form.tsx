import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import {
    ClipboardList,
    FileText,
    Hash,
    Layers,
    Layout,
    Plus,
    Save,
    Settings2,
    Timer,
    Trash,
    Undo2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuestionFormProps {
    question?: any;
    mode: 'create' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface FormState {
    test_type: string;
    skill_category: string;
    session_number: number | string;
    section_number: number | string;
    section_duration: number | string;
    question_number: number | string;
    type: string;
    content_text: string;
    content_text2: string;
    content_file_url: string;
    template_file: File | null;
    options: { id: string; text: string }[];
    correct_answer: string[];
}

export default function QuestionForm({
    question,
    mode,
    onSuccess,
    onCancel,
}: QuestionFormProps) {
    const { data, setData, post, put, processing, errors, transform } =
        useForm<FormState>({
            test_type: question?.test_type || 'disc',
            skill_category: question?.content?.skill_category || '',
            session_number: question?.session_number || 1,
            section_number: question?.section_number || '',
            section_duration: question?.section_duration
                ? Math.floor(question.section_duration / 60)
                : '',
            question_number: question?.question_number || '',
            type: question?.type || 'disc',
            // Content helpers
            content_text: question?.content?.text || '',
            content_text2: question?.content?.text2 || '', // For comparison
            content_file_url: question?.content?.file_url || '', // For file assignment
            template_file: null,
            // Options helper (array of objects)
            options:
                question?.options ||
                ([
                    { id: '1', text: '' },
                    { id: '2', text: '' },
                    { id: '3', text: '' },
                    { id: '4', text: '' },
                ] as any[]),
            correct_answer: question?.correct_answer || [],
        });

    // Auto-set session number and type based on test type
    useEffect(() => {
        if (data.test_type === 'papicostic') {
            setData((d) => ({
                ...d,
                session_number: 1,
                type: 'choice', // Changed from 'forced' to 'choice'
            }));
        }
        if (data.test_type === 'cfit') {
            const validCfitTypes = [
                'standard',
                'multiple_select',
                'comparison',
            ];
            setData((d) => ({
                ...d,
                session_number: 2,
                type: validCfitTypes.includes(d.type) ? d.type : 'standard',
            }));
        }
        if (data.test_type === 'disc') {
            setData((d) => ({
                ...d,
                session_number: 3,
                type: 'disc',
            }));
        }
        if (data.test_type === 'skill_test') {
            setData((d) => ({
                ...d,
                session_number: 4,
                type: 'file_assignment',
            }));
        }
    }, [data.test_type]);

    // Initialize options based on type
    useEffect(() => {
        // Prevent clearing data when FIRST loading an edit form
        if (mode === 'edit' && question && data.type === question.type) {
            return;
        }

        // Only reset if it's a type with FIXED options structure
        // OR if we are in create mode for flexible types
        const isFixedType = [
            'disc',
            'choice',
            'comparison',
            'file_assignment',
        ].includes(data.type);

        if (isFixedType || (!question && mode === 'create')) {
            if (data.type === 'disc') {
                setData('options', [
                    { id: '1', text: '' },
                    { id: '2', text: '' },
                    { id: '3', text: '' },
                    { id: '4', text: '' },
                ]);
            } else if (data.type === 'choice') {
                setData('options', [
                    { id: 'a', text: '' },
                    { id: 'b', text: '' },
                ]);
            } else if (data.type === 'comparison') {
                setData('options', [
                    { id: 's', text: 'S (Sama)' },
                    { id: 'ts', text: 'TS (Tidak Sama)' },
                ]);
            } else if (data.type === 'file_assignment') {
                setData('options', []);
            } else if (
                data.type === 'standard' ||
                data.type === 'multiple_select'
            ) {
                // For flexible types, only reset if creating new
                if (mode === 'create') {
                    setData('options', [
                        { id: 'a', text: '' },
                        { id: 'b', text: '' },
                        { id: 'c', text: '' },
                        { id: 'd', text: '' },
                        { id: 'e', text: '' },
                    ]);
                }
            }
        }
    }, [data.type]);

    const [isSubmitting, setIsSubmitting] = useState(processing);

    useEffect(() => {
        setIsSubmitting(processing);
    }, [processing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        const isUpdate = mode === 'edit';
        const url = isUpdate
            ? `/psychotest-questions/${question.id}`
            : '/psychotest-questions';

        // We use transform to prepare the payload before Inertia sends it
        transform((data) => ({
            ...data,
            _method: isUpdate ? 'PUT' : 'POST',
            section_number: data.section_number
                ? parseInt(data.section_number as string)
                : null,
            section_duration: data.section_duration
                ? parseInt(data.section_duration as string) * 60
                : null,
            content:
                data.test_type === 'skill_test'
                    ? {
                          skill_category: data.skill_category,
                          text: data.content_text,
                          file_url: data.content_file_url, // Keep legacy if provided
                      }
                    : {
                          text: data.content_text,
                          text2: data.content_text2,
                      },
        }));

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
            onFinish: () => setIsSubmitting(false),
            onError: (errors) => {
                console.error('Submission Errors:', errors);
            },
        });
    };

    const addOption = () => {
        const id = String(data.options.length + 1);
        setData('options', [...data.options, { id, text: '' }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...data.options];
        newOptions.splice(index, 1);
        setData('options', newOptions);
    };

    const updateOption = (index: number, val: string) => {
        const newOptions = [...data.options];
        newOptions[index].text = val;
        setData('options', newOptions);
    };

    const updateOptionId = (index: number, val: string) => {
        const newOptions = [...data.options];
        newOptions[index].id = val;
        setData('options', newOptions);
    };

    const toggleCorrectAnswer = (id: string) => {
        const isSelected = data.correct_answer.includes(id);
        if (isSelected) {
            setData(
                'correct_answer',
                data.correct_answer.filter((item) => item !== id),
            );
        } else {
            // Limit multiple_select to max 2 answers
            if (
                data.type === 'multiple_select' &&
                data.correct_answer.length >= 2
            ) {
                return;
            }
            setData('correct_answer', [...data.correct_answer, id]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
            {/* Section 1: Assessment Profiling */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                        <Settings2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Assessment Profiling
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Configure global settings for this subtest section.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Test Type
                        </Label>
                        <Select
                            value={data.test_type}
                            onValueChange={(val) => setData('test_type', val)}
                        >
                            <SelectTrigger className="h-11 border-border bg-background transition-colors focus:ring-ring">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="disc">DISC</SelectItem>
                                <SelectItem value="papicostic">
                                    Papicostic
                                </SelectItem>
                                <SelectItem value="cfit">CFIT</SelectItem>
                                <SelectItem value="skill_test">
                                    Skill Test
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Subtest Number
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 1"
                                value={data.section_number}
                                onChange={(e) =>
                                    setData('section_number', e.target.value)
                                }
                                className="h-11 border-border bg-background pl-10 transition-colors focus:ring-ring"
                            />
                            <Layers className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Subtest Duration
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 3"
                                value={data.section_duration}
                                onChange={(e) =>
                                    setData('section_duration', e.target.value)
                                }
                                className="h-11 border-border bg-background pr-12 pl-10 transition-colors focus:ring-ring"
                            />
                            <Timer className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
                                min
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            * Applies to all questions in section{' '}
                            {data.section_number || '#'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Question Identity */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                        <Hash className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Question Registry
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Define the specific identity and format of this
                            question.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Question Number
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="e.g 1"
                                value={data.question_number}
                                onChange={(e) =>
                                    setData('question_number', e.target.value)
                                }
                                className="h-11 border-border bg-background pl-10 transition-colors focus:ring-ring"
                            />
                            <ClipboardList className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Question Format
                        </Label>
                        <Select
                            value={data.type}
                            onValueChange={(val) => setData('type', val)}
                        >
                            <SelectTrigger className="h-11 border-border bg-background transition-colors focus:ring-ring">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.test_type === 'disc' && (
                                    <SelectItem value="disc">
                                        DISC (Most / Least)
                                    </SelectItem>
                                )}
                                {data.test_type === 'papicostic' && (
                                    <>
                                        <SelectItem value="choice">
                                            Multiple Choice
                                        </SelectItem>
                                        <SelectItem value="file_assignment">
                                            File Assignment (Download/Upload)
                                        </SelectItem>
                                    </>
                                )}
                                {data.test_type === 'cfit' && (
                                    <>
                                        <SelectItem value="standard">
                                            Standard Choice
                                        </SelectItem>
                                        <SelectItem value="multiple_select">
                                            Multiple Select
                                        </SelectItem>
                                        <SelectItem value="comparison">
                                            Comparison
                                        </SelectItem>
                                    </>
                                )}
                                {data.test_type === 'skill_test' && (
                                    <SelectItem value="file_assignment">
                                        File Assignment (Download/Upload)
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 3: Question Content */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Question Content
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Input the text or comparison data for this question.
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Skill Category (Conditionally rendered) */}
                    {data.test_type === 'skill_test' && (
                        <div className="mb-6 space-y-2">
                            <Label
                                htmlFor="skill_category"
                                className="text-xs font-semibold text-muted-foreground uppercase"
                            >
                                Skill Category
                            </Label>
                            <Input
                                id="skill_category"
                                value={data.skill_category}
                                onChange={(e) =>
                                    setData('skill_category', e.target.value)
                                }
                                placeholder="e.g. Accounting, Document, etc."
                                className="h-11 border-border bg-background focus:ring-ring"
                            />
                            {errors.skill_category && (
                                <p className="text-sm text-destructive">
                                    {errors.skill_category}
                                </p>
                            )}
                        </div>
                    )}

                    {data.type === 'comparison' ? (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    Left Content
                                </Label>
                                <Input
                                    value={data.content_text}
                                    onChange={(e) =>
                                        setData('content_text', e.target.value)
                                    }
                                    className="h-11 border-border bg-background focus:ring-ring"
                                    placeholder="e.g. Text content"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    Right Content
                                </Label>
                                <Input
                                    value={data.content_text2}
                                    onChange={(e) =>
                                        setData('content_text2', e.target.value)
                                    }
                                    className="h-11 border-border bg-background focus:ring-ring"
                                    placeholder="e.g. Text content"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    {data.type === 'disc'
                                        ? 'Optional Header Text'
                                        : 'Question Prompt / Instructions'}
                                </Label>
                                <Textarea
                                    placeholder={
                                        data.type === 'disc'
                                            ? 'e.g. Choose one most and one least...'
                                            : 'e.g. Silakan download file di bawah ini dan kerjakan...'
                                    }
                                    value={data.content_text}
                                    onChange={(e) =>
                                        setData('content_text', e.target.value)
                                    }
                                    className="min-h-[100px] border-border bg-background focus:ring-ring"
                                />
                            </div>

                            {data.type === 'file_assignment' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="template_file"
                                            className="text-xs font-semibold text-muted-foreground uppercase"
                                        >
                                            {question?.content?.file_path
                                                ? 'Change Template File'
                                                : 'Upload Template File'}
                                        </Label>
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                id="template_file"
                                                type="file"
                                                onChange={(e) =>
                                                    setData(
                                                        'template_file',
                                                        e.target.files?.[0] ||
                                                            null,
                                                    )
                                                }
                                                className="h-11 border-border bg-background pt-2 focus:ring-ring"
                                            />
                                            {question?.content?.file_path && (
                                                <p className="text-[10px] font-bold text-blue-600">
                                                    Current file:{' '}
                                                    {question.content.file_path}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            Upload Word/Excel template for
                                            candidate download.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="content_file_url_legacy"
                                            className="text-xs font-semibold text-muted-foreground uppercase"
                                        >
                                            Or Template URL (Optional)
                                        </Label>
                                        <Input
                                            id="content_file_url_legacy"
                                            value={data.content_file_url}
                                            onChange={(e) =>
                                                setData(
                                                    'content_file_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://example.com/file.xlsx"
                                            className="h-11 border-border bg-background focus:ring-ring"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Section 4: Response Options */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                            <Layout className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                Response Options
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Manage the available choices for candidates.
                            </p>
                        </div>
                    </div>
                    {(data.type === 'standard' ||
                        data.type === 'multiple_select') && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={addOption}
                            className="bg-background hover:bg-muted hover:text-emerald-500"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Option
                        </Button>
                    )}
                </div>

                <div className="space-y-4 p-6">
                    {data.options.map((option: any, idx: number) => (
                        <div
                            key={idx}
                            className={`group flex animate-in items-end gap-4 rounded-xl border p-4 transition-all fade-in slide-in-from-top-2 hover:bg-muted/40 ${
                                data.correct_answer.includes(option.id)
                                    ? 'border-emerald-500/50 bg-emerald-500/5'
                                    : 'border-border bg-muted/20'
                            }`}
                        >
                            {/* Correct Answer Selector */}
                            {(data.type === 'standard' ||
                                data.type === 'choice' ||
                                data.type === 'comparison' ||
                                data.type === 'multiple_select') && (
                                <div className="mb-1 flex shrink-0 flex-col items-center gap-2">
                                    <Label className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                        Correct?
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                data.type === 'standard' ||
                                                data.type === 'comparison'
                                            ) {
                                                const isCurrent =
                                                    data.correct_answer.includes(
                                                        option.id,
                                                    );
                                                setData(
                                                    'correct_answer',
                                                    isCurrent
                                                        ? []
                                                        : [option.id],
                                                );
                                            } else {
                                                toggleCorrectAnswer(option.id);
                                            }
                                        }}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                                            data.correct_answer.includes(
                                                option.id,
                                            )
                                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                                : 'border-border bg-background text-muted-foreground hover:border-emerald-500/50'
                                        }`}
                                    >
                                        <Save className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="w-24 shrink-0">
                                <Label className="mb-1 block text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                    ID Code
                                </Label>
                                <Input
                                    value={option.id}
                                    onChange={(e) =>
                                        updateOptionId(idx, e.target.value)
                                    }
                                    className="h-10 border-border bg-background text-center font-mono focus:ring-ring"
                                    placeholder="ID"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="mb-1 block text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                    Value / Label
                                </Label>
                                <Input
                                    value={option.text}
                                    onChange={(e) =>
                                        updateOption(idx, e.target.value)
                                    }
                                    className="h-10 border-border bg-background focus:ring-ring"
                                    placeholder={`Enter option label...`}
                                />
                            </div>
                            {(data.type === 'standard' ||
                                data.type === 'multiple_select') && (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-muted-foreground opacity-0 group-hover:text-destructive group-hover:opacity-100"
                                    onClick={() => removeOption(idx)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        if (onCancel) onCancel();
                        else window.history.back();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Undo2 className="mr-2 h-4 w-4" />
                    {onCancel ? 'Cancel' : 'Discard Changes'}
                </Button>
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[160px]"
                    >
                        {isSubmitting ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {mode === 'create'
                                    ? 'Create Question'
                                    : 'Save Changes'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
