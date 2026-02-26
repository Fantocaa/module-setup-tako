<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApiClient;
use Illuminate\Support\Facades\Hash;

class AuthTokenController extends Controller
{
    public function issue(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
        ]);

        $client = ApiClient::where('client_id', $data['client_id'])
            ->where('is_active', true)
            ->first();

        if (!$client || !Hash::check($data['client_secret'], $client->client_secret)) {
            return response()->json([
                'message' => 'Invalid client credentials'
            ], 401);
        }

        $token = auth('api')->login($client);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ]);
    }
}
