<?php

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can create expense transaction and amount becomes negative', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/transactions', [
            'amount' => 1000,
            'description' => 'Beli kopi',
            'type' => 'expense',
        ]);

    $response->assertStatus(200); // kita bahas 201 di bawah

    $this->assertDatabaseHas('transactions', [
        'description' => 'Beli kopi',
        'amount' => -1000,
        'type' => 'expense',
    ]);
});

test('user can create income transaction with positive amount', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/transactions', [
            'amount' => 5000,
            'description' => 'Gaji',
            'type' => 'income',
        ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('transactions', [
        'description' => 'Gaji',
        'amount' => 5000,
        'type' => 'income',
    ]);
});
