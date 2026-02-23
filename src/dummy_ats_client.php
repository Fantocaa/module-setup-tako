<?php

/**
 * DUMMY ATS CLIENT SCRIPT
 * 
 * Ini adalah contoh script PHP sederhana yang mensimulasikan bagaimana sistem ATS Anda 
 * seharusnya berkomunikasi dengan API Psychotest.
 * 
 * Cara jalankan:
 * Buka terminal, lalu ketik: php dummy_ats_client.php
 */

// Konfigurasi Kredensial (Sesuai database Anda)
$clientId = 'my-client-id';
$clientSecret = 'secret'; // Ganti dengan secret yang benar jika hash berbeda. Default seeder biasanya 'secret'

function isApiReachable(string $url): bool
{
    $ch = curl_init($url . '/auth/token');
    curl_setopt_array($ch, [
        CURLOPT_NOBODY => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 2,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ]);

    curl_exec($ch);
    $error = curl_errno($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
    curl_close($ch);

    return $error === 0 && $httpCode > 0;
}

// URL API
$herdUrl = 'https://tako-module-app.test/api';
$ipUrl   = 'http://192.168.2.107:8000/api';

$baseUrl = isApiReachable($herdUrl) ? $herdUrl : $ipUrl;

echo "API digunakan: $baseUrl\n\n";

echo "--- MULAI SIMULASI ATS ---\n\n";

// --- LANGKAH 1: Get Token ---
echo "[1] Meminta Token Baru...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/auth/token");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $clientId,
    'client_secret' => $clientSecret
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Ignore SSL for local dev
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "GAGAL MENDAPATKAN TOKEN! (HTTP $httpCode)\n";
    echo "Response: $response\n";
    echo "Pastikan Client ID & Secret benar.\n";
    exit;
}

$tokenData = json_decode($response, true);
$accessToken = $tokenData['access_token'];

echo "SUKSES! Token diterima.\n";
echo "Token: " . substr($accessToken, 0, 20) . "...\n\n";


// --- LANGKAH 2: Generate Link ---
echo "[2] Meng-generate Link Psychotest...\n";

// Data pelamar
$applicantData = [
    'name' => 'Budi Santoso (Test Type Filter: CFIT & DISC)',
    'email' => 'budi.filtered@example.com',
    'nik' => '3515131708990001',
    'tests' => ['cfit', 'disc'] // Only CFIT (Session 2) and DISC (Session 3). Skips Papi (Session 1).
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/psychotest/store");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($applicantData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    "Accept: application/json" // Penting agar return JSON
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 && $httpCode !== 201) {
    echo "GAGAL GENERATE LINK! (HTTP $httpCode)\n";
    echo "Response: $response\n";
    exit;
}

$result = json_decode($response, true);

echo "SUKSES! Link berhasil dibuat.\n";
echo "------------------------------------------------\n";
echo "LINK PSYCHOTEST: " . $result['psychotest_url'] . "\n";
echo "EXPIRED PADA: " . $result['expires_at'] . "\n";
echo "------------------------------------------------\n";
