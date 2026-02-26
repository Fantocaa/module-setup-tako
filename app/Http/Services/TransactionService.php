<?php

namespace App\Http\Services;

use App\Models\Transaction;

class TransactionService
{
    public function create(array $data): Transaction
    {
        // contoh business rule
        if ($data['type'] === 'expense') {
            $data['amount'] = -abs($data['amount']);
        }

        return Transaction::create($data);
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        if ($data['type'] === 'expense') {
            $data['amount'] = -abs($data['amount']);
        }

        $transaction->update($data);

        return $transaction;
    }
}
