<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsychotestQuestion;

class DiscSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'q' => 1,
                'options' => [
                    ['id' => '1', 'text' => 'Dipenuhi hal detail'],
                    ['id' => '2', 'text' => 'Menuntut, Kasar'],
                    ['id' => '3', 'text' => 'Non konfrontasi, Menyerah'],
                    ['id' => '4', 'text' => 'Perubahan pada menit terakhir'],
                ]
            ],
            [
                'q' => 2,
                'options' => [
                    ['id' => '1', 'text' => 'Menerima ganjaran atas tujuan yg dicapai'],
                    ['id' => '2', 'text' => 'Bepergian demi petualangan baru'],
                    ['id' => '3', 'text' => 'Rencanakan masa depan, Bersiap'],
                    ['id' => '4', 'text' => 'Menggunakan waktu berkualitas dgn teman'],
                ]
            ],
            [
                'q' => 3,
                'options' => [
                    ['id' => '1', 'text' => 'Mari kerjakan bersama'],
                    ['id' => '2', 'text' => 'Hasil adalah penting'],
                    ['id' => '3', 'text' => 'Dibuat menyenangkan'],
                    ['id' => '4', 'text' => 'Lakukan dengan benar, Akurasi penting'],
                ]
            ],
            [
                'q' => 4,
                'options' => [
                    ['id' => '1', 'text' => 'Menghindari konflik'],
                    ['id' => '2', 'text' => 'Ingin otoritas lebih'],
                    ['id' => '3', 'text' => 'Ingin petunjuk yang jelas'],
                    ['id' => '4', 'text' => 'Ingin kesempatan baru'],
                ]
            ],
            [
                'q' => 5,
                'options' => [
                    ['id' => '1', 'text' => 'Delegator yang baik'],
                    ['id' => '2', 'text' => 'Pendengar yang baik'],
                    ['id' => '3', 'text' => 'Penyemangat yang baik'],
                    ['id' => '4', 'text' => 'Penganalisa yang baik'],
                ]
            ],
            [
                'q' => 6,
                'options' => [
                    ['id' => '1', 'text' => 'Suka selesaikan apa yang saya mulai'],
                    ['id' => '2', 'text' => 'Sering terburu-buru, Merasa tertekan'],
                    ['id' => '3', 'text' => 'Kelola waktu secara efisien'],
                    ['id' => '4', 'text' => 'Masalah sosial itu penting'],
                ]
            ],
            [
                'q' => 7,
                'options' => [
                    ['id' => '1', 'text' => 'Menceritakan sisi saya'],
                    ['id' => '2', 'text' => 'Menyimpan perasaan saya'],
                    ['id' => '3', 'text' => 'Siap beroposisi'],
                    ['id' => '4', 'text' => 'Menjadi frustrasi'],
                ]
            ],
            [
                'q' => 8,
                'options' => [
                    ['id' => '1', 'text' => 'Berani, Tak gentar'],
                    ['id' => '2', 'text' => 'Menyenangkan orang, Mudah setuju'],
                    ['id' => '3', 'text' => 'Tertawa lepas, Hidup'],
                    ['id' => '4', 'text' => 'Tenang, Pendiam'],
                ]
            ],
            [
                'q' => 9,
                'options' => [
                    ['id' => '1', 'text' => 'Ingin segalanya teratur, Rapi'],
                    ['id' => '2', 'text' => 'Mudah terangsang, Riang'],
                    ['id' => '3', 'text' => 'Tidak mudah dikalahkan'],
                    ['id' => '4', 'text' => 'Kerjakan sesuai perintah, Ikut pimpinan'],
                ]
            ],
            [
                'q' => 10,
                'options' => [
                    ['id' => '1', 'text' => 'Puas dengan segalanya'],
                    ['id' => '2', 'text' => 'Ingin kemajuan'],
                    ['id' => '3', 'text' => 'Rendah hati, Sederhana'],
                    ['id' => '4', 'text' => 'Terbuka memperlihatkan perasaan'],
                ]
            ],
            [
                'q' => 11,
                'options' => [
                    ['id' => '1', 'text' => 'Gampangan, Mudah setuju'],
                    ['id' => '2', 'text' => 'Toleran, Menghormati'],
                    ['id' => '3', 'text' => 'Percaya, Mudah percaya pada orang'],
                    ['id' => '4', 'text' => 'Petualang, Mengambil resiko'],
                ]
            ],
            [
                'q' => 12,
                'options' => [
                    ['id' => '1', 'text' => 'Hidup, Suka bicara'],
                    ['id' => '2', 'text' => 'Gerak cepat, Tekun'],
                    ['id' => '3', 'text' => 'Usaha mengikuti aturan'],
                    ['id' => '4', 'text' => 'Usaha menjaga keseimbangan'],
                ]
            ],
            [
                'q' => 13,
                'options' => [
                    ['id' => '1', 'text' => 'Ingin membuat tujuan'],
                    ['id' => '2', 'text' => 'Berusaha sempurna'],
                    ['id' => '3', 'text' => 'Menyemangati orang'],
                    ['id' => '4', 'text' => 'Bagian dari kelompok'],
                ]
            ],
            [
                'q' => 14,
                'options' => [
                    ['id' => '1', 'text' => 'Aturan membuat bosan'],
                    ['id' => '2', 'text' => 'Aturan membuat adil'],
                    ['id' => '3', 'text' => 'Aturan perlu dipertanyakan'],
                    ['id' => '4', 'text' => 'Aturan membuat aman'],
                ]
            ],
            [
                'q' => 15,
                'options' => [
                    ['id' => '1', 'text' => 'Dapat diramal, Konsisten'],
                    ['id' => '2', 'text' => 'Memimpin, Pendekatan langsung'],
                    ['id' => '3', 'text' => 'Suka bergaul, Antusias'],
                    ['id' => '4', 'text' => 'Waspada, Hati-hati'],
                ]
            ],
            [
                'q' => 16,
                'options' => [
                    ['id' => '1', 'text' => 'Kreatif, Unik'],
                    ['id' => '2', 'text' => 'Dapat diandalkan, Dapat dipercaya'],
                    ['id' => '3', 'text' => 'Garis dasar, Orientasi hasil'],
                    ['id' => '4', 'text' => 'Jalankan standar yang tinggi, Akurat'],
                ]
            ],
            [
                'q' => 17,
                'options' => [
                    ['id' => '1', 'text' => 'Ramah, Mudah bergabung'],
                    ['id' => '2', 'text' => 'Aktif mengubah sesuatu'],
                    ['id' => '3', 'text' => 'Unik, Bebas rutinitas'],
                    ['id' => '4', 'text' => 'Ingin hal-hal yang pasti'],
                ]
            ],
            [
                'q' => 18,
                'options' => [
                    ['id' => '1', 'text' => 'Menyenangkan, Baik hati'],
                    ['id' => '2', 'text' => 'Bahagia, Tanpa beban'],
                    ['id' => '3', 'text' => 'Tenang, Pendiam'],
                    ['id' => '4', 'text' => 'Tak gentar, Berani'],
                ]
            ],
            [
                'q' => 19,
                'options' => [
                    ['id' => '1', 'text' => 'Akan menunggu, Tanpa tekanan'],
                    ['id' => '2', 'text' => 'Akan membeli sesuai dorongan hati'],
                    ['id' => '3', 'text' => 'Akan berjalan terus tanpa kontrol diri'],
                    ['id' => '4', 'text' => 'Akan mengusahakan yang kuinginkan'],
                ]
            ],
            [
                'q' => 20,
                'options' => [
                    ['id' => '1', 'text' => 'Saya akan melaksanakan'],
                    ['id' => '2', 'text' => 'Saya akan meyakinkan mereka'],
                    ['id' => '3', 'text' => 'Saya dapatkan fakta'],
                    ['id' => '4', 'text' => 'Saya akan pimpin mereka'],
                ]
            ],
            [
                'q' => 21,
                'options' => [
                    ['id' => '1', 'text' => 'Cenderung janji berlebihan'],
                    ['id' => '2', 'text' => 'Tidak takut bertempur'],
                    ['id' => '3', 'text' => 'Tarik diri di tengah tekanan'],
                    ['id' => '4', 'text' => 'Tolak perubahan mendadak'],
                ]
            ],
            [
                'q' => 22,
                'options' => [
                    ['id' => '1', 'text' => 'Kompetitif, Suka tantangan'],
                    ['id' => '2', 'text' => 'Optimis, Positif'],
                    ['id' => '3', 'text' => 'Memikirkan orang dahulu'],
                    ['id' => '4', 'text' => 'Pemikir logis, Sistematik'],
                ]
            ],
            [
                'q' => 23,
                'options' => [
                    ['id' => '1', 'text' => 'Lembut suara, Pendiam'],
                    ['id' => '2', 'text' => 'Pusat Perhatian, Suka gaul'],
                    ['id' => '3', 'text' => 'Pendamai, Membawa Harmoni'],
                    ['id' => '4', 'text' => 'Optimistik, Visioner'],
                ]
            ],
            [
                'q' => 24,
                'options' => [
                    ['id' => '1', 'text' => 'Sosial, Perkumpulan kelompok'],
                    ['id' => '2', 'text' => 'Keselamatan, keamanan'],
                    ['id' => '3', 'text' => 'Pendidikan, Kebudayaan'],
                    ['id' => '4', 'text' => 'Prestasi, Ganjaran'],
                ]
            ],
        ];

        foreach ($questions as $data) {
            PsychotestQuestion::updateOrCreate(
                [
                    'test_type' => 'disc',
                    'session_number' => 3,
                    'question_number' => $data['q'],
                ],
                [
                    'type' => 'disc',
                    'content' => [
                        'text' => 'Pilih satu yang paling menggambarkan diri Anda (Most) dan satu yang paling tidak menggambarkan diri Anda (Least).',
                        'section_title' => 'DISC Personality Test',
                        'section_description' => 'Dalam setiap kelompok di bawah ini, silakan pilih SALAH SATU pernyataan yang PALING menggambarkan Anda (M) dan SALAH SATU pernyataan yang PALING TIDAK menggambarkan Anda (L).',
                    ],
                    'options' => $data['options'],
                    'section_number' => 1,
                    'section_duration' => 600, // 10 minutes
                ]
            );
        }
    }
}
