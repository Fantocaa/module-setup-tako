import AppLayout from '@/layouts/app-layout';
import { create, index } from '@/routes/transactions';
import { Head } from '@inertiajs/react';
import TransactionForm from './transaction-form';

export default function Create() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Transactions', href: index() },
                { title: 'Create', href: create() },
            ]}
        >
            <Head title="Create Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-xl">
                    <h1 className="mb-6 text-2xl font-bold">
                        Create Transaction
                    </h1>

                    <TransactionForm />
                </div>
            </div>
        </AppLayout>
    );
}
