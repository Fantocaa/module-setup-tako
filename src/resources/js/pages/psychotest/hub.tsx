import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Info, Lock, PlayCircle } from 'lucide-react';
import React from 'react';

interface Props {
    link: any;
    currentSession: number;
}

const ALL_SESSIONS = [
    {
        id: 1,
        title: 'Session 1',
        description: 'Papicostic Test',
        duration: 'Multiple Parts',
        type: 'papicostic',
        instructions:
            'Terdapat 90 pasang pernyataan. Pilih salah satu pernyataan dari setiap pasangan yang paling menggambarkan diri Anda. Tes ini tidak memiliki jawaban benar atau salah.',
    },
    {
        id: 2,
        title: 'Session 2',
        description: 'CFIT Intelligence Test',
        duration: 'Timed Sections',
        type: 'cfit',
        instructions:
            'Tes ini terdiri dari 4 subtes dengan batas waktu masing-masing (3-4 menit). Anda akan berpindah ke subtes selanjutnya secara otomatis setelah menyelesaikan bagian sebelumnya. Jawaban yang sudah dikirim akan terkunci.',
    },
    {
        id: 3,
        title: 'Session 3',
        description: 'DISC Profile',
        duration: 'Personality Test',
        type: 'disc',
        instructions:
            'Dari setiap kelompok yang terdiri dari 4 pernyataan, pilih satu yang PALING menggambarkan Anda (M) dan satu yang PALING TIDAK menggambarkan Anda (L).',
    },
    {
        id: 4,
        title: 'Session 4',
        description: 'Skill Test',
        duration: 'Technical Assessment',
        type: 'skill_test',
        instructions:
            'Kerjakan tes teknis sesuai dengan instruksi yang diberikan pada bagian pertanyaan.',
    },
];

export default function PsychotestHub({ link, currentSession }: Props) {
    const [startingSession, setStartingSession] = React.useState<any>(null);

    const allowedSessionIds = link.allowed_sessions || [1, 2, 3, 4];
    const sessions = ALL_SESSIONS.filter((s) =>
        allowedSessionIds.includes(s.id),
    );

    // Determine the next session the user should take
    const nextSessionId = allowedSessionIds
        .sort((a: number, b: number) => a - b)
        .find((id: number) => id > (currentSession || 0));

    const isTotallyDone = !nextSessionId || !!link.finished_at;

    const handleStart = () => {
        if (startingSession) {
            router.get(
                `/psychotest/${link.uuid}?session=${startingSession.id}`,
            );
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Head title={`Assessment Hub - ${link.applicant_name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        Assessment Center
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Welcome,{' '}
                        <span className="font-bold text-foreground">
                            {link.applicant_name}
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please complete the sessions in order.
                    </p>
                </div>

                <div className="grid gap-4">
                    {sessions.map((session) => {
                        const isDone = currentSession >= session.id;
                        const isOpen = session.id === nextSessionId;
                        const isFuture = session.id > (nextSessionId || 999);

                        return (
                            <Card
                                key={session.id}
                                className={`transition-all ${
                                    isOpen
                                        ? 'scale-[1.02] border-primary shadow-lg ring-2 ring-primary/20'
                                        : isDone
                                          ? 'bg-muted/50 opacity-80'
                                          : 'bg-muted/30 opacity-60 grayscale'
                                }`}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                                            isDone
                                                ? 'border-green-500 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                : isOpen
                                                  ? 'border-primary bg-primary text-white'
                                                  : 'border-border bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle className="h-6 w-6" />
                                        ) : isFuture ? (
                                            <Lock className="h-5 w-5" />
                                        ) : (
                                            <span className="text-lg font-black">
                                                {session.id}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-bold">
                                            {session.title}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {session.description}
                                        </CardDescription>
                                    </div>
                                    {isOpen && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    onClick={() =>
                                                        setStartingSession(
                                                            session,
                                                        )
                                                    }
                                                    size="lg"
                                                    className="rounded-full px-6 font-bold shadow-lg shadow-primary/20"
                                                >
                                                    Start Now{' '}
                                                    <PlayCircle className="ml-2 h-5 w-5" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <Info className="h-6 w-6" />
                                                    </div>
                                                    <DialogTitle className="text-2xl font-black">
                                                        Test Instructions
                                                    </DialogTitle>
                                                    <DialogDescription className="text-base font-medium">
                                                        Please read carefully
                                                        before starting the{' '}
                                                        <span className="font-bold text-foreground">
                                                            {session.title}
                                                        </span>
                                                        .
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="rounded-2xl bg-muted/50 p-6">
                                                    <p className="text-lg leading-relaxed font-bold text-foreground">
                                                        {session.instructions}
                                                    </p>
                                                </div>
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        onClick={handleStart}
                                                        className="h-14 w-full rounded-2xl text-lg font-black shadow-xl"
                                                    >
                                                        I UNDERSTAND & START
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    {isDone && (
                                        <Badge
                                            variant="outline"
                                            className="border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
                                        >
                                            Completed
                                        </Badge>
                                    )}
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                {isTotallyDone && (
                    <Card className="border-none bg-green-600 text-white shadow-xl dark:bg-green-700">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-black text-white">
                                All Assessments Completed!
                            </CardTitle>
                            <CardDescription className="text-lg text-green-100">
                                Thank you for completing the tests. HR will
                                contact you shortly.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
