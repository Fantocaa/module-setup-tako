import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

interface Activity {
    id: number;
    description: string;
    created_at: string;
    causer: { name: string } | null;
    properties: Record<string, any>;
    subject_type: string | null;
}

interface Props {
    logs: {
        data: Activity[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audit Log',
        href: '/audit-logs',
    },
];

export default function AuditLogIndex({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Log" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-bold">
                            Audit Log
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            User activity history in the system
                        </p>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-4 pt-6">
                        {/* List Logs */}
                        {logs.data.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No activity logs.
                            </p>
                        ) : (
                            logs.data.map((log) => (
                                <div
                                    key={log.id}
                                    className="rounded-md border bg-muted/50 px-4 py-3 transition hover:bg-muted/70"
                                >
                                    <div className="text-sm font-medium text-foreground">
                                        {log.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {log.causer?.name ?? 'System'} •{' '}
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleString()}
                                        {log.subject_type
                                            ? ` • ${log.subject_type.split('\\').pop()}`
                                            : ''}
                                    </div>
                                    {log.properties &&
                                        Object.keys(log.properties).length >
                                            0 && (
                                            <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
                                                {JSON.stringify(
                                                    log.properties,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        )}
                                </div>
                            ))
                        )}

                        {/* Pagination */}
                        {logs.links.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 pt-6">
                                {logs.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        disabled={!link.url}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            router.visit(link.url || '', {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
