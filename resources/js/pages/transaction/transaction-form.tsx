import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { store, update } from '@/routes/transactions';
import { Transaction } from '@/types';
import { Form } from '@inertiajs/react';

interface TransactionFormProps {
    transaction?: Transaction;
    className?: string; // Allow passing className for styling flexibility
}

export default function TransactionForm({
    transaction,
    className,
}: TransactionFormProps) {
    // Determine mode based on presence of transaction
    const isEdit = !!transaction;

    // Resolve route and method
    const formProps = isEdit
        ? {
              action: update({ transaction: transaction?.id }),
              method: 'put' as const,
              data: {
                  description: transaction?.description,
                  amount: Math.abs(transaction?.amount),
                  type: transaction?.type,
              },
          }
        : {
              ...store.form(),
              data: {
                  description: '', // explicit default
                  amount: '',
                  type: 'income',
              },
          };

    return (
        <Form
            {...formProps}
            className={className}
            resetOnSuccess={!isEdit} // Only reset on create success
        >
            {({ processing, errors }) => (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={transaction?.description}
                            placeholder="Enter description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            defaultValue={
                                transaction
                                    ? Math.abs(transaction.amount)
                                    : undefined
                            }
                            placeholder="Enter amount"
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            name="type"
                            defaultValue={transaction?.type || 'income'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-500">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="mr-2" />}
                            {isEdit ? 'Update' : 'Create'} Transaction
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
