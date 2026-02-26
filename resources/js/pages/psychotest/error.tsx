import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

interface Props {
    message: string;
}

export default function PsychotestError({ message }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Head title="Error - Psychotest" />
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-600">
                        Access Denied
                    </CardTitle>
                    <CardDescription>
                        There was an issue with your assessment link.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-8 text-center">
                    <p className="text-muted-foreground">{message}</p>
                    {/* <div className="pt-2">
                        <Button asChild variant="outline">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
}
