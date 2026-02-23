<?php

use App\Models\ApiClient;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$client = ApiClient::where('client_id', 'my-client-id')->first();
if ($client) {
    $client->client_secret = Hash::make('secret');
    $client->save();
    echo "Secret successfully reset to 'secret'.\n";
} else {
    echo "Client not found.\n";
}
