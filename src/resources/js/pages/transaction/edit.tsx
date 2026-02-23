import AppLayout from '@/layouts/app-layout';
import { edit, index } from '@/routes/transactions';
import { Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import TransactionForm from './transaction-form';

export default function Edit({ transaction }: { transaction: Transaction }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Transactions', href: index() },
                {
                    title: 'Edit',
                    href: edit({ transaction: transaction.id }),
                },
            ]}
        >
            <Head title="Edit Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-xl">
                    <h1 className="mb-6 text-2xl font-bold">
                        Edit Transaction
                    </h1>

                    <TransactionForm transaction={transaction} />
                </div>
            </div>
        </AppLayout>
    );
}
