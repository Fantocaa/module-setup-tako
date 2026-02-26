<?php

namespace App\Http\Services;

/**
 * PAPI-Kostic (Personality and Preference Inventory - Kostick) Scoring Service
 *
 * Ported/adapted from: https://github.com/cahyadsn/papi (MIT License)
 * by Cahya DSN
 *
 * Algorithm:
 *  1. Setiap soal memiliki 2 pernyataan (A & B), masing-masing membawa role_id (1–20).
 *  2. User memilih salah satu → count untuk role tersebut bertambah 1.
 *  3. Score per role berkisar 0–9 (dari 20 soal, tiap role muncul beberapa kali).
 *  4. Score dicocokkan ke rules:
 *       0–2  = Lower  (ciri rendah)
 *       3–5  = Middle (ciri sedang)
 *       6–9  = Higher (ciri kuat)
 *  5. Hasil dikelompokkan per Aspek (5 aspek, masing-masing 4 role).
 */
class PapiCosticScoringService
{
    /**
     * 20 Role PAPI-Kostic (role_id 1–20, kode A–T).
     *
     * Setiap role memiliki:
     *  - code        : kode huruf (A–T)
     *  - aspect_id   : aspek ke-1 sampai ke-5
     *  - name        : nama role (bahasa Inggris)
     *  - name_id     : nama role (bahasa Indonesia)
     *  - description : deskripsi singkat
     */
    private const ROLES = [
        1  => [
            'code'        => 'A',
            'aspect_id'   => 1,
            'name'        => 'Leadership Role',
            'name_id'     => 'Peran sebagai Pemimpin',
            'description' => 'Kecenderungan untuk memimpin, mengarahkan, dan mempengaruhi orang lain.',
        ],
        2  => [
            'code'        => 'B',
            'aspect_id'   => 1,
            'name'        => 'Need for Rules & Supervision',
            'name_id'     => 'Kebutuhan akan Aturan & Pengawasan',
            'description' => 'Kebutuhan untuk bekerja dalam lingkungan yang memiliki aturan dan arahan yang jelas.',
        ],
        3  => [
            'code'        => 'C',
            'aspect_id'   => 1,
            'name'        => 'Need for Companionship',
            'name_id'     => 'Kebutuhan Bersosialisasi',
            'description' => 'Kebutuhan untuk bersama orang lain dan menjalin hubungan sosial.',
        ],
        4  => [
            'code'        => 'D',
            'aspect_id'   => 1,
            'name'        => 'Social Extension',
            'name_id'     => 'Keterbukaan Sosial',
            'description' => 'Kemampuan dan kemauan untuk berinteraksi dan terlibat dalam kegiatan sosial.',
        ],
        5  => [
            'code'        => 'E',
            'aspect_id'   => 2,
            'name'        => 'Emotional Restraint',
            'name_id'     => 'Pengendalian Emosi',
            'description' => 'Kemampuan untuk mengendalikan perasaan dan emosi dalam situasi kerja.',
        ],
        6  => [
            'code'        => 'F',
            'aspect_id'   => 2,
            'name'        => 'Affiliation',
            'name_id'     => 'Afiliasi / Kebersamaan',
            'description' => 'Keinginan untuk menjadi bagian dari kelompok dan menjalin kerjasama.',
        ],
        7  => [
            'code'        => 'G',
            'aspect_id'   => 2,
            'name'        => 'Activity Level',
            'name_id'     => 'Tingkat Aktivitas',
            'description' => 'Kecenderungan untuk selalu aktif bergerak, bersemangat, dan dinamis.',
        ],
        8  => [
            'code'        => 'H',
            'aspect_id'   => 2,
            'name'        => 'Work Drive',
            'name_id'     => 'Dorongan Kerja',
            'description' => 'Motivasi dan dorongan internal yang kuat untuk bekerja dan berprestasi.',
        ],
        9  => [
            'code'        => 'I',
            'aspect_id'   => 3,
            'name'        => 'Attention to Detail',
            'name_id'     => 'Perhatian pada Detail',
            'description' => 'Kecenderungan untuk memperhatikan hal-hal kecil dan bekerja dengan teliti.',
        ],
        10 => [
            'code'        => 'J',
            'aspect_id'   => 3,
            'name'        => 'Theoretical Thinking',
            'name_id'     => 'Pemikiran Konseptual',
            'description' => 'Menikmati analisis, pemikiran abstrak, dan pemecahan masalah yang kompleks.',
        ],
        11 => [
            'code'        => 'K',
            'aspect_id'   => 3,
            'name'        => 'Flexibility',
            'name_id'     => 'Fleksibilitas',
            'description' => 'Kemampuan untuk beradaptasi dan terbuka terhadap perubahan dan cara baru.',
        ],
        12 => [
            'code'        => 'L',
            'aspect_id'   => 3,
            'name'        => 'Ease in Decision Making',
            'name_id'     => 'Kemudahan Pengambilan Keputusan',
            'description' => 'Kemampuan untuk membuat keputusan dengan cepat dan percaya diri.',
        ],
        13 => [
            'code'        => 'M',
            'aspect_id'   => 4,
            'name'        => 'Need to Achieve',
            'name_id'     => 'Kebutuhan Berprestasi',
            'description' => 'Dorongan untuk menetapkan tujuan tinggi dan mencapainya.',
        ],
        14 => [
            'code'        => 'N',
            'aspect_id'   => 4,
            'name'        => 'Role as General Manager',
            'name_id'     => 'Peran sebagai Pengelola',
            'description' => 'Kecenderungan untuk mengambil tanggung jawab pengelolaan dan koordinasi.',
        ],
        15 => [
            'code'        => 'O',
            'aspect_id'   => 4,
            'name'        => 'Need for Status',
            'name_id'     => 'Kebutuhan Status/Prestise',
            'description' => 'Keinginan untuk mendapatkan pengakuan, kedudukan, dan gengsi.',
        ],
        16 => [
            'code'        => 'P',
            'aspect_id'   => 4,
            'name'        => 'Personal Achievement Motivation',
            'name_id'     => 'Motivasi Pencapaian Pribadi',
            'description' => 'Termotivasi oleh pengakuan atas kemampuan dan pencapaian individual.',
        ],
        17 => [
            'code'        => 'Q',
            'aspect_id'   => 5,
            'name'        => 'Anxiety Level',
            'name_id'     => 'Tingkat Kecemasan',
            'description' => 'Kecenderungan untuk merasakan kekhawatiran atau kecemasan (skor tinggi = lebih cemas).',
        ],
        18 => [
            'code'        => 'R',
            'aspect_id'   => 5,
            'name'        => 'Planning Orientation',
            'name_id'     => 'Orientasi Perencanaan',
            'description' => 'Kecenderungan untuk merencanakan, mengorganisir, dan bekerja secara sistematis.',
        ],
        19 => [
            'code'        => 'S',
            'aspect_id'   => 5,
            'name'        => 'Hard & Intense Worker',
            'name_id'     => 'Pekerja Keras & Tekun',
            'description' => 'Kecenderungan untuk bekerja keras dan tidak mudah menyerah.',
        ],
        20 => [
            'code'        => 'T',
            'aspect_id'   => 5,
            'name'        => 'Methodical Approach',
            'name_id'     => 'Pendekatan Metodis',
            'description' => 'Kecenderungan untuk mengerjakan segala sesuatu secara teratur dan prosedural.',
        ],
    ];

    /**
     * 5 Aspek yang mengelompokkan 20 role.
     */
    private const ASPECTS = [
        1 => ['name' => 'Peran & Kebutuhan Sosial',      'roles' => [1, 2, 3, 4]],
        2 => ['name' => 'Gaya Kerja & Emosi',             'roles' => [5, 6, 7, 8]],
        3 => ['name' => 'Gaya Berpikir & Fleksibilitas',  'roles' => [9, 10, 11, 12]],
        4 => ['name' => 'Motivasi & Ambisi',               'roles' => [13, 14, 15, 16]],
        5 => ['name' => 'Karakter & Orientasi Kerja',      'roles' => [17, 18, 19, 20]],
    ];

    /**
     * Rules interpretasi: score per role → kategori
     *
     * Rules didasarkan dari tabel papi_rules referensi:
     *   role_id | low_value | high_value | interprestation
     *   -------------------------------------------------------
     *   (sama untuk semua role)
     *   0–2 = Lower, 3–5 = Middle, 6–9 = Higher
     */
    private const RULES = [
        ['low' => 0, 'high' => 2, 'category' => 'Lower',  'label' => 'Rendah',  'description_tpl' => 'Kecenderungan %s pada individu ini tergolong rendah.'],
        ['low' => 3, 'high' => 5, 'category' => 'Middle', 'label' => 'Sedang',  'description_tpl' => 'Kecenderungan %s pada individu ini tergolong sedang.'],
        ['low' => 6, 'high' => 9, 'category' => 'Higher', 'label' => 'Tinggi',  'description_tpl' => 'Kecenderungan %s pada individu ini tergolong tinggi.'],
    ];

    /**
     * Hitung skor PAPI-Kostic berdasarkan jawaban user.
     *
     * @param array $answers Array jawaban. Tiap elemen berupa:
     *   [
     *     'question_number' => int,   // nomor soal (1–20)
     *     'selected_role_id' => int,  // role_id yang dipilih (1–20)
     *   ]
     *
     * @return array {
     *   tally: array<int, int>,             // role_id => jumlah dipilih
     *   roles: array,                        // hasil per role (code, name, score, category, label, interpretation)
     *   aspects: array,                      // hasil per aspek (name, roles)
     *   dominant_roles: array,               // role dengan kategori Higher
     *   summary: string                      // ringkasan teks
     * }
     */
    public function score(array $answers): array
    {
        // ─── Step 1: Hitung tally per role ──────────────────────────────────
        $tally = array_fill_keys(range(1, 20), 0);

        foreach ($answers as $answer) {
            // Handle both simple value array and object array
            $roleId = is_array($answer) ? ($answer['selected_role_id'] ?? 0) : $answer;
            $roleId = (int) $roleId;

            if (isset($tally[$roleId])) {
                $tally[$roleId]++;
            }
        }

        // ─── Step 2: Interpretasi per role ──────────────────────────────────
        $rolesResult = [];
        $dominantRoles = [];

        foreach (self::ROLES as $roleId => $roleData) {
            $score       = $tally[$roleId];
            $interpretation = $this->interpretScore($score, $roleData['name_id']);

            $rolesResult[$roleId] = [
                'role_id'        => $roleId,
                'code'           => $roleData['code'],
                'aspect_id'      => $roleData['aspect_id'],
                'name'           => $roleData['name'],
                'name_id'        => $roleData['name_id'],
                'description'    => $roleData['description'],
                'score'          => $score,
                'category'       => $interpretation['category'],
                'label'          => $interpretation['label'],
                'interpretation' => $interpretation['text'],
            ];

            if ($interpretation['category'] === 'Higher') {
                $dominantRoles[] = $roleData['code'] . ' (' . $roleData['name_id'] . ')';
            }
        }

        // ─── Step 3: Kelompokkan per aspek ──────────────────────────────────
        $aspectsResult = [];
        foreach (self::ASPECTS as $aspectId => $aspectData) {
            $aspectRoles = [];
            foreach ($aspectData['roles'] as $roleId) {
                $aspectRoles[] = $rolesResult[$roleId];
            }
            $aspectsResult[$aspectId] = [
                'aspect_id' => $aspectId,
                'name'      => $aspectData['name'],
                'roles'     => $aspectRoles,
            ];
        }

        // ─── Step 4: Ringkasan ───────────────────────────────────────────────
        $summary = empty($dominantRoles)
            ? 'Tidak ada dimensi kepribadian yang menonjol secara kuat.'
            : 'Dimensi kepribadian yang menonjol (Higher): ' . implode(', ', $dominantRoles) . '.';

        return [
            'tally'          => $tally,
            'roles'          => array_values($rolesResult),
            'aspects'        => array_values($aspectsResult),
            'dominant_roles' => $dominantRoles,
            'summary'        => $summary,
        ];
    }

    /**
     * Cocokkan skor dengan rules untuk mendapatkan interpretasi.
     */
    private function interpretScore(int $score, string $roleName): array
    {
        foreach (self::RULES as $rule) {
            if ($score >= $rule['low'] && $score <= $rule['high']) {
                return [
                    'category' => $rule['category'],
                    'label'    => $rule['label'],
                    'text'     => sprintf($rule['description_tpl'], $roleName),
                ];
            }
        }

        // Fallback (tidak seharusnya terjadi)
        return [
            'category' => 'Unknown',
            'label'    => '-',
            'text'     => 'Skor tidak dapat diinterpretasikan.',
        ];
    }
}
