import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/transactions';
import { Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';
import { DataTable } from './data-table';

interface PageProps {
    transactions: {
        data: Transaction[];
        links: any[];
    };
    breadcrumb?: any;
}

export default function Index({ transactions }: PageProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Transactions', href: index() }]}>
            <Head title="Transactions" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={columns} data={transactions.data} />
            </div>
        </AppLayout>
    );
}
