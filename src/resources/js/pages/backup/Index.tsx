import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Backup {
    name: string;
    size: number;
    last_modified: number;
    download_url: string;
}

interface Props {
    backups: Backup[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Backup', href: '/backup' }];

export default function BackupIndex({ backups }: Props) {
    const handleBackup = () => {
        router.post(
            '/backup/run',
            {},
            {
                onSuccess: () => toast.success('Backup created successfully'),
                onError: () => toast.error('Failed to create backup'),
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (filename: string) => {
        router.delete(`/backup/delete/${filename}`, {
            onSuccess: () => toast.success('Backup deleted successfully'),
            onError: () => toast.error('Failed to delete backup'),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Backup" breadcrumbs={breadcrumbs}>
            <Head title="Backup" />

            <div className="space-y-4 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Database Backups
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage system backup files
                            </p>
                        </div>
                        <Button onClick={handleBackup}>Create Backup</Button>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-4 pt-4">
                        {backups.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No backups available.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {backups.map((backup, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between rounded border bg-muted/50 p-3"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {backup.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatSize(backup.size)} •{' '}
                                                {new Date(
                                                    backup.last_modified * 1000,
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={backup.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Download
                                                </Button>
                                            </a>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete this backup?
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive hover:bg-destructive/90"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    backup.name,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function formatSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
