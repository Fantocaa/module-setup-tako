<?php

namespace App\Http\Services;

/**
 * DISC Personality Scoring Service
 *
 * Ported from: https://github.com/cahyadsn/disc_id
 * by Cahya DSN (MIT License)
 *
 * Algorithm:
 *  1. Count how many times each option (D/I/S/C) was chosen as Most vs Least
 *  2. Graph I  = Most  counts  → lookup in tbl_results[line=1]
 *  3. Graph II = Least counts  → lookup in tbl_results[line=2]
 *  4. Graph III (Change) = Most-Least counts → lookup in tbl_results[line=3]
 *  5. Each graph's normalised D/I/S/C values determine a pattern (1–40)
 *  6. tbl_patterns maps the pattern number to a name/description/jobs/behaviour
 *
 * Disc option ID mapping (matches the seeder options):
 *  option id '1' → D, '2' → I, '3' → S, '4' → C  (per question)
 */
class DiscScoringService
{
    /**
     * Mapping from option position (1-4) to DISC letter, per question number (1-24).
     * This is derived from tbl_personalities in the original disc.sql.
     * Keys are question numbers (1-24), values are arrays [pos1..pos4] => DISC letter.
     * 'N' means the option contributes to no DISC dimension (neutral / balancer).
     */
    private const PERSONALITIES = [
        // q => [most_letter_for_option1, most_letter_for_option2, most_letter_for_option3, most_letter_for_option4]
        //       and
        //      [least_letter_for_option1, …]
        // Data from tbl_personalities:
        // id, no, term, most, least
        //  1,  1, Ramah, S, N
        //  2,  1, Bosan rutinitas, N, I
        //  3,  1, Inovatif, D, D
        //  4,  1, Kepastian, C, C
        1  => ['most' => ['S', 'N', 'D', 'C'], 'least' => ['N', 'I', 'D', 'C']],
        //  5,  2, Menyenangkan orang, S, S
        //  6,  2, Tertawa lepas, N, I
        //  7,  2, Tak gentar, D, D
        //  8,  2, Tenang, C, C
        2  => ['most' => ['S', 'N', 'D', 'C'], 'least' => ['S', 'I', 'D', 'C']],
        //  9,  3, Ingin kemajuan, D, D
        // 10,  3, Mudah Puas, S, N
        // 11,  3, Perasaan, I, N
        // 12,  3, Sederhana, N, C
        3  => ['most' => ['D', 'S', 'I', 'N'], 'least' => ['D', 'N', 'N', 'C']],
        // 13,  4, Frustrasi, C, C
        // 14,  4, Menyimpan perasaan, S, S
        // 15,  4, Menceritakan sisi saya, N, I
        // 16,  4, Siap beroposisi, D, D
        4  => ['most' => ['C', 'S', 'N', 'D'], 'least' => ['C', 'S', 'I', 'D']],
        // 17,  5, Suka berkumpul, S, S
        // 18,  5, Bersiap, C, N
        // 19,  5, Petualangan baru, I, I
        // 20,  5, Mengharap imbalan, D, D
        5  => ['most' => ['S', 'C', 'I', 'D'], 'least' => ['S', 'N', 'I', 'D']],
        // 21,  6, Disiplin, C, N
        // 22,  6, Terburu-buru, D, D
        // 23,  6, Sosialita, I, I
        // 24,  6, Berkomitmen, S, S
        6  => ['most' => ['C', 'D', 'I', 'S'], 'least' => ['N', 'D', 'I', 'S']],
        // 25,  7, Terencana, S, N
        // 26,  7, Mudah berjanji, I, I
        // 27,  7, Menghindar, N, C
        // 28,  7, Petarung, N, D
        7  => ['most' => ['S', 'I', 'N', 'N'], 'least' => ['N', 'I', 'C', 'D']],
        // 29,  8, Penyemangat, I, I
        // 30,  8, Pendengar, S, S
        // 31,  8, Penganalisa, C, C
        // 32,  8, Delegator, D, D
        8  => ['most' => ['I', 'S', 'C', 'D'], 'least' => ['I', 'S', 'C', 'D']],
        // 33,  9, Tidak mudah dikalahkan, D, D
        // 34,  9, Ikut pimpinan, S, N
        // 35,  9, Riang, I, I
        // 36,  9, Rapi, N, C
        9  => ['most' => ['D', 'S', 'I', 'N'], 'least' => ['D', 'N', 'I', 'C']],
        // 37, 10, Lepas kendali, N, C
        // 38, 10, Mengikuti kata hati, D, D
        // 39, 10, Tanpa tekanan, S, S
        // 40, 10, Gigih, I, N
        10 => ['most' => ['N', 'D', 'S', 'I'], 'least' => ['C', 'D', 'S', 'N']],
        // 41, 11, Memikirkan orang dahulu, S, S
        // 42, 11, Suka tantangan, D, D
        // 43, 11, Optimis, I, I
        // 44, 11, Sistematik, N, C
        11 => ['most' => ['S', 'D', 'I', 'N'], 'least' => ['S', 'D', 'I', 'C']],
        // 45, 12, Pendiam, C, N
        // 46, 12, Visioner, D, D
        // 47, 12, Suka gaul, N, I
        // 48, 12, Pendamai, S, S
        12 => ['most' => ['C', 'D', 'N', 'S'], 'least' => ['N', 'D', 'I', 'S']],
        // 49, 13, Penyemangat, I, I
        // 50, 13, Perfeksionis, N, C
        // 51, 13, Berkelompok, N, S
        // 52, 13, Mempunyai tujuan, D, N
        13 => ['most' => ['I', 'N', 'N', 'D'], 'least' => ['I', 'C', 'S', 'N']],
        // 53, 14, Dapat diandalkan, N, S
        // 54, 14, Kreatif, I, I
        // 55, 14, Orientasi hasil, D, N
        // 56, 14, Akurat, C, N
        14 => ['most' => ['N', 'I', 'D', 'C'], 'least' => ['S', 'I', 'N', 'N']],
        // 57, 15, Suka bicara, I, N
        // 58, 15, Gerak cepat, D, D
        // 59, 15, Menjaga keseimbangan, S, S
        // 60, 15, Taat aturan, N, C
        15 => ['most' => ['I', 'D', 'S', 'N'], 'least' => ['N', 'D', 'S', 'C']],
        // 61, 16, Aturan perlu dipertanyakan, N, D
        // 62, 16, Aturan membuat adil, C, N
        // 63, 16, Aturan membuat bosan, I, I
        // 64, 16, Aturan membuat aman, S, S
        16 => ['most' => ['N', 'C', 'I', 'S'], 'least' => ['D', 'N', 'I', 'S']],
        // 65, 17, Pendidikan, N, C
        // 66, 17, Prestasi, D, D
        // 67, 17, Keselamatan, S, S
        // 68, 17, Sosial, I, N
        17 => ['most' => ['N', 'D', 'S', 'I'], 'least' => ['C', 'D', 'S', 'N']],
        // 69, 18, Memimpin, D, D
        // 70, 18, Antusias, N, I
        // 71, 18, Konsisten, N, S
        // 72, 18, Waspada, C, N
        18 => ['most' => ['D', 'N', 'N', 'C'], 'least' => ['D', 'I', 'S', 'N']],
        // 73, 19, Berorientasi hasil, D, D
        // 74, 19, Akurat, C, C
        // 75, 19, Dibuat menyenangkan, N, I
        // 76, 19, Bekerjasama, N, S
        19 => ['most' => ['D', 'C', 'N', 'N'], 'least' => ['D', 'C', 'I', 'S']],
        // 77, 20, Saya akan pimpin mereka, D, N
        // 78, 20, Saya akan melaksanakan, S, S
        // 79, 20, Saya akan meyakinkan mereka, I, I
        // 80, 20, Saya dapatkan fakta, C, N
        20 => ['most' => ['D', 'S', 'I', 'C'], 'least' => ['N', 'S', 'I', 'N']],
        // 81, 21, Mudah setuju, S, S
        // 82, 21, Mudah percaya, I, I
        // 83, 21, Petualang, N, D
        // 84, 21, Toleran, C, C
        21 => ['most' => ['S', 'I', 'N', 'C'], 'least' => ['S', 'I', 'D', 'C']],
        // 85, 22, Menyerah, N, S
        // 86, 22, Mendetail, C, N
        // 87, 22, Mudah berubah, I, I
        // 88, 22, Kasar, D, D
        22 => ['most' => ['N', 'C', 'I', 'D'], 'least' => ['S', 'N', 'I', 'D']],
        // 89, 23, Ingin otoritas lebih, N, D
        // 90, 23, Ingin kesempatan baru, I, N
        // 91, 23, Menghindari konflik, S, S
        // 92, 23, Ingin petunjuk yang jelas, N, C
        23 => ['most' => ['N', 'I', 'S', 'N'], 'least' => ['D', 'N', 'S', 'C']],
        // 93, 24, Tenang, C, C
        // 94, 24, Tanpa beban, I, I
        // 95, 24, Baik hati, S, N
        // 96, 24, Berani, D, D
        24 => ['most' => ['C', 'I', 'S', 'D'], 'least' => ['C', 'I', 'N', 'D']],
    ];

    /**
     * Graph coordinate lookup for D/I/S/C.
     * line 1 = Most (value range 0..20)
     * line 2 = Least (value range 0..20)
     * line 3 = Change/Mirror (value range -22..22)
     *
     * Format: value => [d, i, s, c]
     */
    private const TBL_RESULTS = [
        1 => [  // Most
            0  => [-6,    -7,    -5.7,  -6],
            1  => [-5.3,  -4.6,  -4.3,  -4.7],
            2  => [-4,    -2.5,  -3.5,  -3.5],
            3  => [-2.5,  -1.3,  -1.5,  -1.5],
            4  => [-1.7,   1,    -0.7,   0.5],
            5  => [-1.3,   3,     0.5,   2],
            6  => [ 0,     3.5,   1,     3],
            7  => [ 0.5,   5.3,   2.5,   5.3],
            8  => [ 1,     5.7,   3,     5.7],
            9  => [ 2,     6,     4,     6],
            10 => [ 3,     6.5,   4.6,   6.3],
            11 => [ 3.5,   7,     5,     6.5],
            12 => [ 4,     7,     5.7,   6.7],
            13 => [ 4.7,   7,     6,     7],
            14 => [ 5.3,   7,     6.5,   7.3],
            15 => [ 6.5,   7,     6.5,   7.3],
            16 => [ 7,     7.5,   7,     7.3],
            17 => [ 7,     7.5,   7,     7.5],
            18 => [ 7,     7.5,   7,     8],
            19 => [ 7.5,   7.5,   7.5,   8],
            20 => [ 7.5,   8,     7.5,   8],
        ],
        2 => [  // Least
            0  => [ 7.5,   7,     7.5,   7.5],
            1  => [ 6.5,   6,     7,     7],
            2  => [ 4.3,   4,     6,     5.6],
            3  => [ 2.5,   2.5,   4,     4],
            4  => [ 1.5,   0.5,   2.5,   2.5],
            5  => [ 0.5,   0,     1.5,   1.5],
            6  => [ 0,    -2,     0.5,   0.5],
            7  => [-1.3,  -3.5,  -1.3,   0],
            8  => [-1.5,  -4.3,  -2,    -1.3],
            9  => [-2.5,  -5.3,  -3,    -2.5],
            10 => [-3,    -6,    -4.3,  -3.5],
            11 => [-3.5,  -6.5,  -5.3,  -5.3],
            12 => [-4.3,  -7,    -6,    -5.7],
            13 => [-5.3,  -7.2,  -6.5,  -6],
            14 => [-5.7,  -7.2,  -6.7,  -6.5],
            15 => [-6,    -7.2,  -6.7,  -7],
            16 => [-6.5,  -7.3,  -7,    -7.3],
            17 => [ 6.7,  -7.3,  -7.2,  -7.5],
            18 => [ 7,    -7.3,  -7.3,  -7.7],
            19 => [-7.3,  -7.5,  -7.5,  -7.9],
            20 => [-7.5,  -8,    -8,    -8],
        ],
        3 => [  // Change = Most - Least
            -22 => [-8,    -8,    -8,    -7.5],
            -21 => [-7.5,  -8,    -8,    -7.3],
            -20 => [-7,    -8,    -8,    -7.3],
            -19 => [-6.8,  -8,    -8,    -7],
            -18 => [-6.75, -7,    -7.5,  -6.7],
            -17 => [-6.7,  -6.7,  -7.3,  -6.7],
            -16 => [-6.5,  -6.7,  -7.3,  -6.7],
            -15 => [-6.3,  -6.7,  -7,    -6.5],
            -14 => [-6.1,  -6.7,  -6.5,  -6.3],
            -13 => [-5.9,  -6.7,  -6.5,  -6],
            -12 => [-5.7,  -6.7,  -6.5,  -5.85],
            -11 => [-5.3,  -6.7,  -6.5,  -5.85],
            -10 => [-4.3,  -6.5,  -6,    -5.7],
            -9  => [-3.5,  -6,    -4.7,  -4.7],
            -8  => [-3.25, -5.7,  -4.3,  -4.3],
            -7  => [-3,    -4.7,  -3.5,  -3.5],
            -6  => [-2.75, -4.3,  -3,    -3],
            -5  => [-2.5,  -3.5,  -2,    -2.5],
            -4  => [-1.5,  -3,    -1.5,  -0.5],
            -3  => [-1,    -2,    -1,     0],
            -2  => [-0.5,  -1.5,  -0.5,   0.3],
            -1  => [-0.25,  0,     0,     0.5],
            0   => [ 0,     0.5,   1,     1.5],
            1   => [ 0.5,   1,     1.5,   3],
            2   => [ 0.7,   1.5,   2,     4],
            3   => [ 1,     3,     3,     4.3],
            4   => [ 1.3,   4,     3.5,   5.5],
            5   => [ 1.5,   4.3,   4,     5.7],
            6   => [ 2,     5,     4.3,   6],
            7   => [ 2.5,   5.5,   4.7,   6.3],
            8   => [ 3.5,   6.5,   5,     6.5],
            9   => [ 4,     6.7,   5.5,   6.7],
            10  => [ 4.7,   7,     6,     7],
            11  => [ 4.85,  7.3,   6.2,   7.3],
            12  => [ 5,     7.3,   6.3,   7.3],
            13  => [ 5.5,   7.3,   6.5,   7.3],
            14  => [ 6,     7.3,   6.7,   7.3],
            15  => [ 6.3,   7.3,   7,     7.3],
            16  => [ 6.5,   7.3,   7.3,   7.3],
            17  => [ 6.7,   7.3,   7.3,   7.5],
            18  => [ 7,     7.5,   7.3,   8],
            19  => [ 7.3,   8,     7.3,   8],
            20  => [ 7.3,   8,     7.5,   8],
            21  => [ 7.5,   8,     8,     8],
            22  => [ 8,     8,     8,     8],
        ],
    ];

    /**
     * Pattern descriptions (from tbl_patterns).
     * Keys are pattern numbers 1–40 (0 = unrecognized).
     */
    private const TBL_PATTERNS = [
        0  => ['type' => '?',       'pattern' => 'UNDEFINED',                  'behaviour' => '',                                                                                  'jobs' => '',                                                                                                 'description' => 'Pola tidak dapat diidentifikasi dari data jawaban yang diberikan.'],
        1  => ['type' => 'C',       'pattern' => 'LOGICAL THINKER',             'behaviour' => 'Pendiam,Anti Kritik,Perfeksionis',                                                  'jobs' => 'Planner (any function), Engineer (Installation, Technical), Technical/Research (Chemist Technician)',   'description' => 'Seorang yang praktis, cakap dan unik. Ia orang yang mampu menilai diri sendiri dan kritis terhadap dirinya dan orang lain.'],
        2  => ['type' => 'D',       'pattern' => 'ESTABLISHER',                 'behaviour' => 'Individualis,Ego Tinggi,Kurang Sensitif',                                           'jobs' => 'Attorney, Researcher, Sales Representative',                                                        'description' => 'Memiliki rasa ego yang tinggi dan cenderung individualis dengan standard yang sangat tinggi. Ia lebih suka menganalisa masalah sendirian daripada bersama orang lain.'],
        3  => ['type' => 'D / C-D', 'pattern' => 'DESIGNER',                   'behaviour' => 'Sensitif,Result Oriented,Suka Tantangan',                                           'jobs' => 'Engineering (Management, Research, Design), Research (R&D), Planning',                              'description' => 'Seorang yang sangat berorientasi pada tugas dan sensitif pada permasalahan. Ia lebih mempedulikan tugas yang ada dibanding orang-orang di sekitarnya, termasuk perasaan mereka.'],
        4  => ['type' => 'D / I-D', 'pattern' => 'NEGOTIATOR',                  'behaviour' => 'Terlalu Percaya Diri,Agresif,Optimis',                                             'jobs' => 'Recruitment Consultant, Politician, Self-Employed.',                                                'description' => 'Merupakan seorang pemimpin integratif yang bekerja dengan dan melalui orang lain. Ia ramah, memiliki perhatian yang tinggi akan orang dan juga mempunyai kemampuan untuk memperoleh hormat dan penghargaan dari berbagai tipe orang.'],
        5  => ['type' => 'D / I-D-C','pattern' => 'CONFIDENT & DETERMINED',     'behaviour' => 'Dominan,Agresif,Perfeksionis',                                                     'jobs' => 'Insurance, Mortgage and Finance Sales, Personnel and Marketing Services.',                           'description' => 'Sangat berorientasi terhadap tugas dan juga menyukai orang. Ia sangat baik dalam menarik orang/recruiting. Seorang yang bersahabat, tetapi menyukai keadaan di mana tugas-tugas harus dilakukan dengan benar.'],
        6  => ['type' => 'D / I-D-S','pattern' => 'REFORMER',                   'behaviour' => 'Butuh Pujian & Penghargaan,Cepat Percaya Orang,Mudah Simpati & Empati',            'jobs' => 'Recruiting Agent, Sales (Manager/Person), Marketing Services.',                                    'description' => 'Ia menyelesaikan tugasnya melalui keterampilan sosialnya; ia peduli dan menerima orang lain. Ia berkonsentrasi pada tugas yang ada di tangannya sampai selesai dan akan minta bantuan orang lain jika perlu.'],
        7  => ['type' => 'D / I-S-D','pattern' => 'MOTIVATOR',                  'behaviour' => 'Supporter,Sosialisasi Baik,Butuh Pujian & Penghargaan',                            'jobs' => 'Hotelier, Community Counseling, Complaints Manager.',                                              'description' => 'Seorang yang menampilkan gaya bersemangat ketika termotivasi pada sasaran. Ia lebih suka memimpin atau melibatkan diri, walaupun ia juga mau melayani sebagai pembantu.'],
        8  => ['type' => 'D / S-D-C','pattern' => 'INQUIRER',                   'behaviour' => 'Result Oriented,Kaku dan Keras Kepala,Good Service',                               'jobs' => 'Research Manager, Scientific Work, Accountant.',                                                   'description' => 'Seorang yang sabar, terkontrol dan suka menggali fakta dan jalan keluar. Ia tenang dan ramah. Ia merencanakan pekerjaan dengan hati-hati, tetapi agresif, menanyakan sesuatu serta mengumpulkan data pendukung.'],
        9  => ['type' => 'D-I',     'pattern' => 'PENGAMBIL KEPUTUSAN',         'behaviour' => 'Leader,Dingin / Task Oriented,Argumentatif',                                       'jobs' => 'General Management (Directing/Managing/Supervising), Public Relations, Business Management',       'description' => 'Tidak basa-basi dan tegas, ia cenderung merupakan seorang individualis yang kuat. Ia berpandangan jauh ke depan, progresif dan mau berkompetisi untuk mencapai sasaran.'],
        10 => ['type' => 'D-I-S',   'pattern' => 'DIRECTOR',                   'behaviour' => 'Pengelola,Enerjik,Kurang Detail',                                                   'jobs' => 'Service Manager, Office Management, Account Manager',                                               'description' => 'Fokus pada penyelesaian pekerjaan dan menunjukkan penghargaan yang tinggi kepada orang lain. Ia memiliki kemampuan untuk menggerakkan orang dan pekerjaan dikarenakan keterampilannya berpikir ke depan dan hubungan antar manusia.'],
        11 => ['type' => 'D-S',     'pattern' => 'SELF-MOTIVATED',              'behaviour' => 'Objektif & Analitis,Mandiri,Good Planner',                                         'jobs' => 'Researcher, Lawyer, Solicitor',                                                                    'description' => 'Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati. Secara internal termotivasi oleh target pribadi, ia berorientasi terhadap pekerjaannya tapi juga menyukai hubungan dengan sesama.'],
        12 => ['type' => 'I / C-I-S','pattern' => 'MEDIATOR',                  'behaviour' => 'Sensitif,Good Communication Skill,Good Analitical Think',                          'jobs' => 'Public Relations, Administration, Office Administrator.',                                          'description' => 'Merupakan individu yang berorientasi pada orang, ia mampu menggabungkan ketepatan dan loyalitas. Ia cenderung peka dan mempunyai standard yang tinggi.'],
        13 => ['type' => 'I / C-S-I','pattern' => 'PRACTITIONER',               'behaviour' => 'Perfeksionis,Quality Oriented,Scheduled',                                          'jobs' => 'Chemist Research, Computer Programmer, Market Analyst.',                                           'description' => 'Bersahabat, antusias, informal, banyak bicara, dan mungkin sangat mencemaskan apa yang dipikirkan oleh orang lain. Ia menolak agresi dan mengharapkan suasana harmonis.'],
        14 => ['type' => 'I-S-C',   'pattern' => 'RESPONSIVE & THOUGHTFUL',    'behaviour' => 'High Energy,To The Point,Sensitif',                                                'jobs' => 'Actors, Chef, Personnel, Welfare',                                                                 'description' => 'Merupakan individu yang berorientasi pada orang dan lancar berkomunikasi serta loyal. Ia cenderung sensitif dan mempunyai standard yang tinggi. Keputusannya dibuat berdasarkan fakta dan data pendukung.'],
        15 => ['type' => 'S',       'pattern' => 'SPECIALIST',                  'behaviour' => 'Stabil & Konsisten,Nyaman di Belakang Layar,Process Oriented',                     'jobs' => 'Administrative Work, Service-General, Landscape Gardener.',                                        'description' => 'Merupakan individu konsisten yang berusaha menjaga lingkungan/suasana yang tidak berubah. Ia butuh waktu untuk menyesuaikan diri dengan perubahan dan sungkan menjalankan cara-cara lama mengerjakan sesuatu.'],
        16 => ['type' => 'S / C-S', 'pattern' => 'PERFECTIONIST',               'behaviour' => 'Detail & Teliti,Sistematik & Prosedural,Anti Kritik',                              'jobs' => 'Statistician, Surveyor, Optician.',                                                                'description' => 'Berpikir sistematis dan cenderung mengikuti prosedur dalam kehidupan pribadi dan pekerjaannya. Teratur dan memiliki perencanaan yang baik, ia teliti dan fokus pada detil.'],
        17 => ['type' => 'S-C',     'pattern' => 'PEACEMAKER, RESPECTFULL & ACCURATE', 'behaviour' => 'Memikirkan Dampak ke Orang Lain,Terlalu Mendalam dalam Berpikir,Concern ke Data dan Fakta', 'jobs' => 'Office (Manager; Supervisor; Person), Chief Clerk, General Administrator.', 'description' => 'Ia peduli dengan orang-orang di sekitarnya dan mempunyai kualitas yang membuatnya sangat teliti dalam penyelesaian tugas.'],
        18 => ['type' => 'D-C',     'pattern' => 'CHALLENGER',                  'behaviour' => 'Mempunyai keputusan yang kuat,Kreatif dalam memecahkan masalah,Memiliki reaksi yang cepat', 'jobs' => 'Hospital Supervisor, Industrial Marketing, Investment Banking.', 'description' => 'Seorang yang tekun dan memiliki reaksi yang cepat. Ia akan meneliti dan mengejar semua kemungkinan yang ada dalam mencari solusi permasalahan.'],
        19 => ['type' => 'D-I-C',   'pattern' => 'CHANCELLOR',                  'behaviour' => 'Seorang yang ramah secara alami,Menggabungkan kesenangan dengan pekerjaan,Menyukai hubungan dengan sesama', 'jobs' => 'Finance, Production Planning, Personnel Disciplines.', 'description' => 'Ia menggabungkan antara kesenangan dengan pekerjaan/bisnis ketika melakukan sesuatu. Ia kelihatan menyukai hubungan dengan sesama tetapi juga dapat mengerjakan hal-hal detil.'],
        20 => ['type' => 'D-S-I',   'pattern' => 'DIRECTOR',                   'behaviour' => 'Ingin terlibat dalam situasi,Ingin memberikan bantuan dan dukungan,Termotivasi oleh target pribadi', 'jobs' => 'Engineering and Production (Directing, Managing, Supervising), Service Manager, Distribution.', 'description' => 'Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati.'],
        21 => ['type' => 'D-S-C',   'pattern' => 'DIRECTOR',                   'behaviour' => 'Ingin terlibat dalam situasi,Ingin memberikan bantuan dan dukungan,Termotivasi oleh target pribadi,Berorientasi terhadap pekerjaannya', 'jobs' => 'Office Management, Business Consultant, Human Resources.', 'description' => 'Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati.'],
        22 => ['type' => 'D-C-I',   'pattern' => 'CHALLENGER',                  'behaviour' => 'Seorang yang tekun,Mempunyai keputusan yang kuat,Kreatif dalam memecahkan masalah', 'jobs' => 'Technical/Scientific (Directing, Management, Supervision), Engineering, Finance.', 'description' => 'Seorang yang sensitif terhadap permasalahan, dan memiliki kreativitas yang baik dalam memecahkan masalah.'],
        23 => ['type' => 'D-C-S',   'pattern' => 'CHALLENGER',                  'behaviour' => 'Memiliki reaksi yang cepat,Mampu mencari solusi permasalahan,Banyak memberikan ide-ide,Usaha yang keras pada ketepatan', 'jobs' => 'Engineering, Scientific, Research Planning.', 'description' => 'Seorang yang sensitif terhadap permasalahan, dan memiliki kreativitas yang baik dalam memecahkan masalah. Ia dapat menyelesaikan tugas-tugas penting dalam waktu singkat karena mempunyai keputusan yang kuat.'],
        24 => ['type' => 'I',       'pattern' => 'COMMUNICATOR',                'behaviour' => 'Persuasif,Bicara aktif,Inspirasional',                                             'jobs' => 'Promoting, Demonstrating, Canvassing',                                                            'description' => 'Merupakan seorang yang antusias dan optimistik, ia lebih suka mencapai sasarannya melalui orang lain. Ia suka berhubungan dengan sesamanya. Ia tidak suka bekerja sendirian dan cenderung bersama dengan orang lain dalam menyelesaikan proyek.'],
        25 => ['type' => 'I-S',     'pattern' => 'ADVISOR',                     'behaviour' => 'Hangat,Simpati,Tenang dalam situasi sosial',                                       'jobs' => 'Personnel-HR, Coach, Mentor.',                                                                     'description' => 'Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Ia memiliki ketenangan dalam sebagian besar situasi sosial dan jarang tidak menyenangkan orang lain.'],
        26 => ['type' => 'I-C',     'pattern' => 'ASSESSOR',                    'behaviour' => 'Suka berteman,Nyaman walaupun dengan orang asing,Mudah mengembangkan hubungan baru', 'jobs' => 'Training, Inventing, Service Engineer or Supervising within a Technical/Specialist Area.', 'description' => 'Merupakan seorang yang ramah dan suka berteman; ia merasa nyaman walaupun dengan orang asing. Ia cenderung perfeksionis secara alamiah, dan akan mengisolasi dirinya jika diperlukan untuk melaksanakan pekerjaan.'],
        27 => ['type' => 'I-C-D',   'pattern' => 'ASSESSOR',                    'behaviour' => 'Analitis,Berwatak hati-hati,Ramah pada saat merasa nyaman',                        'jobs' => 'Financial (Manager, Specialist), Engineering (Manager, Designer), Project Engineer.',             'description' => 'Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia suka berada pada situasi yang dapat diramalkan dan tidak ada kejutan.'],
        28 => ['type' => 'I-C-S',   'pattern' => 'RESPONSIVE & THOUGHTFUL',    'behaviour' => 'Good Communication Skill,To The Point,Need Socialism,Kurang Fokus',               'jobs' => 'Customer Services, Public Relations, Artist',                                                     'description' => 'Merupakan individu yang berorientasi pada orang dan lancar berkomunikasi serta loyal. Ia butuh pengakuan sosial dan perhatian pribadi; ia dapat cepat akrab dengan orang lain.'],
        29 => ['type' => 'S-D',     'pattern' => 'SELF-MOTIVATED',              'behaviour' => 'Mandiri,Good planner,Komitmen terhadap target,Termotivasi oleh target pribadi',   'jobs' => 'Investigator, Researcher, Computer Specialist',                                                   'description' => 'Merupakan seorang yang obyektif dan analitis. Karena determinasinya yang kuat, ia sering berhasil dalam berbagai hal; karakternya yang tenang, stabil dan daya tahannya memiliki kontribusi akan keberhasilannya.'],
        30 => ['type' => 'S-I',     'pattern' => 'ADVISOR',                     'behaviour' => 'Simpati dan Pengertian,Tenang dalam situasi sosial,Pendengar yang baik',          'jobs' => 'Hotelier, Travel Agent, Therapist.',                                                               'description' => 'Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Ia merupakan "penjaga damai" yang sebenarnya dan akan bekerja untuk menjaga kedamaian dalam setiap keadaan.'],
        31 => ['type' => 'S-D-I',   'pattern' => 'DIRECTOR',                   'behaviour' => 'Seorang yang obyektif dan analitis,Termotivasi oleh target pribadi,Berorientasi terhadap pekerjaannya', 'jobs' => 'Engineering and Production (Supervision), Service Selling, Office Management.', 'description' => 'Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati.'],
        32 => ['type' => 'S-I-D',   'pattern' => 'ADVISOR',                     'behaviour' => 'Pendengar yang baik,Demonstratif,Tidak memaksakan idenya pada orang lain',        'jobs' => 'Engineering and Production (Supervision), Service Selling, Distribution and Warehouse Supervision', 'description' => 'Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Ia cenderung sangat demonstratif dan emosinya biasanya tampak jelas bagi orang di sekitarnya.'],
        33 => ['type' => 'S-I-C',   'pattern' => 'ADVOCATE',                    'behaviour' => 'Stabil,Detail ketika situasi membutuhkan,Teguh pendirian',                        'jobs' => 'Personnel Welfare, Technical Instructor, Customer Service.',                                      'description' => 'Merupakan orang yang stabil, individu yang ramah yang berusaha keras membangun hubungan yang positif di tempat kerja dan di rumah. Ia dapat menjadi sangat berorientasi detil ketika situasi membutuhkan.'],
        34 => ['type' => 'S-C-D',   'pattern' => 'INQUIRER',                    'behaviour' => 'Sangat berorientasi pada detil,Sangat teliti dalam penyelesaian tugas,Sangat berhati-hati', 'jobs' => 'Managing or Supervising (in Engineering, Accountancy, Project Engineer, Draughtsman)', 'description' => 'Seorang yang baik secara alamiah dan sangat berorientasi detil. Ia peduli dengan orang-orang di sekitarnya dan mempunyai kualitas yang membuatnya sangat teliti dalam penyelesaian tugas.'],
        35 => ['type' => 'S-C-I',   'pattern' => 'ADVOCATE',                    'behaviour' => 'Stabil,Ramah,Cenderung individualis',                                             'jobs' => 'Personnel Welfare, Advisers, Attorney Counseling',                                                'description' => 'Merupakan orang yang stabil, individu yang ramah yang berusaha keras membangun hubungan yang positif di tempat kerja dan di rumah. Ia ingin diterima sebagai anggota tim, dan ia menginginkan orang lain menyukainya.'],
        36 => ['type' => 'C-I',     'pattern' => 'ASSESSOR',                    'behaviour' => 'Analitis,Berwatak hati-hati,Ramah pada saat merasa nyaman',                        'jobs' => 'Public Relations, Lecturer, Personnel Administration',                                            'description' => 'Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia menampilkan sikap peduli dan ramah, namun mampu memusatkan perhatian pada penyelesaian tugas yang ada.'],
        37 => ['type' => 'C-D-I',   'pattern' => 'CHALLENGER',                  'behaviour' => 'Sangat berorientasi pada tugas,Sensitif terhadap permasalahan,Lebih mempedulikan tugas daripada orang', 'jobs' => 'Logistic Support, Systems Analyst, Lecturer', 'description' => 'Seorang yang sangat berorientasi pada tugas dan sensitif pada permasalahan. Ia lebih mempedulikan tugas yang ada dibanding orang-orang di sekitarnya, termasuk perasaan mereka.'],
        38 => ['type' => 'C-D-S',   'pattern' => 'CONTEMPLATOR',                'behaviour' => 'Mempunyai standar tinggi untuk dirinya,Selalu berpikir ada ruang untuk kemajuan,Ingin menghasilkan mutu yang terbaik', 'jobs' => 'Accountant, Administrator, Quality Controller', 'description' => 'Berorientasi pada hal detil dan mempunyai standard tinggi untuk dirinya. Ia logis dan analitis. Ia ingin berbuat yang terbaik, dan ia selalu berpikir ada ruang untuk peningkatan/kemajuan.'],
        39 => ['type' => 'C-I-D',   'pattern' => 'ASSESSOR',                    'behaviour' => 'Berwatak hati-hati,Sangat biasa dengan orang asing,Memusatkan perhatian pada penyelesaian tugas', 'jobs' => 'Managing or Supervising (Engineering, Research, Finance, Planning), Designer, Work Study', 'description' => 'Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia sangat biasa dengan orang asing, karena ia dapat menilai dan menyesuaikan diri dalam hubungan mereka.'],
        40 => ['type' => 'C-S-D',   'pattern' => 'PRECISIONIST',                'behaviour' => 'Sistematis dan Prosedural,Fokus pada detil,Mengharapkan akurasi dan standard tinggi', 'jobs' => 'Engineering, Research Director, Production and Finance (Director, Manager, Supervisor)', 'description' => 'Berpikir sistematis dan cenderung mengikuti prosedur dalam kehidupan pribadi dan pekerjaannya. Teratur dan memiliki perencanaan yang baik, ia teliti dan fokus pada detil.'],
    ];

    /**
     * Main entry point.
     *
     * @param array $answers  Flat array of answers from the DISC session.
     *                        Each element is an array with at least:
     *                          - 'question_number' (int)
     *                          - 'most'  (string option id, e.g. '1')
     *                          - 'least' (string option id, e.g. '3')
     *
     * @return array {
     *   tally: {D: int, I: int, S: int, C: int, N: int}[line1, line2, line3]
     *   graphs: {line1: {d,i,s,c}, line2: {d,i,s,c}, line3: {d,i,s,c}}
     *   results: {
     *     line1: {pattern_id, type, pattern, behaviour: string[], description, jobs: string[]}
     *     line2: ...
     *     line3: ...
     *   }
     * }
     */
    public function score(array $answers): array
    {
        // Step 1 — Count D/I/S/C selections for Most and Least
        $most  = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, 'N' => 0];
        $least = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, 'N' => 0];

        foreach ($answers as $answer) {
            $qNum      = (int) ($answer['question_number'] ?? 0);
            $mostId    = (string) ($answer['most']  ?? '');
            $leastId   = (string) ($answer['least'] ?? '');

            if (!isset(self::PERSONALITIES[$qNum])) {
                continue;
            }

            $optionIndex = (int) $mostId - 1; // option ids are 1-4
            if ($optionIndex >= 0 && $optionIndex < 4) {
                $disc = self::PERSONALITIES[$qNum]['most'][$optionIndex];
                $most[$disc]++;
            }

            $optionIndex = (int) $leastId - 1;
            if ($optionIndex >= 0 && $optionIndex < 4) {
                $disc = self::PERSONALITIES[$qNum]['least'][$optionIndex];
                $least[$disc]++;
            }
        }

        // Step 2 — Build raw result arrays (line 1=most, 2=least, 3=change)
        $rawResult = [
            'D' => [1 => $most['D'], 2 => $least['D'], 3 => $most['D'] - $least['D']],
            'I' => [1 => $most['I'], 2 => $least['I'], 3 => $most['I'] - $least['I']],
            'S' => [1 => $most['S'], 2 => $least['S'], 3 => $most['S'] - $least['S']],
            'C' => [1 => $most['C'], 2 => $least['C'], 3 => $most['C'] - $least['C']],
            'N' => [1 => $most['N'], 2 => $least['N'], 3 => 0],
        ];

        $tally = [
            'line1' => ['D' => $rawResult['D'][1], 'I' => $rawResult['I'][1], 'S' => $rawResult['S'][1], 'C' => $rawResult['C'][1], 'N' => $rawResult['N'][1]],
            'line2' => ['D' => $rawResult['D'][2], 'I' => $rawResult['I'][2], 'S' => $rawResult['S'][2], 'C' => $rawResult['C'][2], 'N' => $rawResult['N'][2]],
            'line3' => ['D' => $rawResult['D'][3], 'I' => $rawResult['I'][3], 'S' => $rawResult['S'][3], 'C' => $rawResult['C'][3], 'N' => 0],
        ];

        // Step 3 — Convert raw counts to graph coordinates via tbl_results
        $graphs = [
            'line1' => $this->getGraphCoords($rawResult, 1),
            'line2' => $this->getGraphCoords($rawResult, 2),
            'line3' => $this->getGraphCoords($rawResult, 3),
        ];

        // Step 4 — Determine pattern for each line
        $results = [
            'line1' => $this->getPatternResult($graphs['line1'], 'Kepribadian di muka umum (Most)'),
            'line2' => $this->getPatternResult($graphs['line2'], 'Kepribadian saat mendapat tekanan (Least)'),
            'line3' => $this->getPatternResult($graphs['line3'], 'Kepribadian asli yang tersembunyi (Change)'),
        ];

        return compact('tally', 'graphs', 'results');
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    /**
     * Look up graph coordinates for a given line using tbl_results data.
     * TBL_RESULTS rows are arrays [d_coord, i_coord, s_coord, c_coord].
     * For each dimension, we look up the raw count in tbl_results and extract
     * the correct column index (0=D, 1=I, 2=S, 3=C).
     */
    private function getGraphCoords(array $rawResult, int $line): array
    {
        $table = self::TBL_RESULTS[$line];
        return [
            'd' => $this->lookupDim($table, $rawResult['D'][$line], 0),
            'i' => $this->lookupDim($table, $rawResult['I'][$line], 1),
            's' => $this->lookupDim($table, $rawResult['S'][$line], 2),
            'c' => $this->lookupDim($table, $rawResult['C'][$line], 3),
        ];
    }

    /**
     * Look up a value in a tbl_results table, clamping to valid range,
     * and extract the given column index (0=d, 1=i, 2=s, 3=c) from the row array.
     */
    private function lookupDim(array $table, int $value, int $dimIndex): float
    {
        $keys  = array_keys($table);
        $min   = min($keys);
        $max   = max($keys);
        $value = max($min, min($max, $value));

        if (isset($table[$value])) {
            return (float) $table[$value][$dimIndex];
        }

        // Find nearest key
        $nearest = null;
        $minDist = PHP_INT_MAX;
        foreach ($keys as $k) {
            $dist = abs($k - $value);
            if ($dist < $minDist) {
                $minDist = $dist;
                $nearest = $k;
            }
        }
        return (float) $table[$nearest][$dimIndex];
    }

    /** @deprecated Use lookupDim instead */
    private function lookup(array $table, int $value): float
    {
        return $this->lookupDim($table, $value, 0);
    }

    private function getGraphCoords2(array $rawResult, int $line): array
    {
        return $this->getGraphCoords($rawResult, $line);
    }


    /**
     * Matches normalised DISC graph values to a pattern number (formula.php logic).
     * When all four dimensions are positive the 40-pattern table has no match,
     * so we fall back to subtracting the minimum value from all dimensions,
     * which preserves relative ordering while making the lowest go to ≤ 0.
     */
    private function matchPattern(float $D, float $I, float $S, float $C): int
    {
        $pattern = $this->matchPatternStrict($D, $I, $S, $C);
        if ($pattern !== 0) {
            return $pattern;
        }

        // Fallback: normalise by subtracting the minimum so the smallest ≤ 0
        $min = min($D, $I, $S, $C);
        if ($min > 0) {
            $pattern = $this->matchPatternStrict($D - $min, $I - $min, $S - $min, $C - $min);
        }

        return $pattern;
    }

    /**
     * Core pattern matching without fallback (exact port of formula.php).
     */
    private function matchPatternStrict(float $D, float $I, float $S, float $C): int
    {
        if ($D <= 0 && $I <= 0 && $S <= 0 && $C >  0)                                          return 1;
        if ($D >  0 && $I <= 0 && $S <= 0 && $C <= 0)                                          return 2;
        if ($D >  0 && $I <= 0 && $S <= 0 && $C >  0 && $C >= $D)                             return 3;
        if ($D >  0 && $I >  0 && $S <= 0 && $C <= 0 && $I >= $D)                             return 4;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $I >= $D && $D >= $C)                 return 5;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $I >= $D && $D >= $S)                 return 6;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $I >= $S && $S >= $D)                 return 7;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $S >= $D && $D >= $C)                 return 8;
        if ($D >  0 && $I >  0 && $S <= 0 && $C <= 0 && $D >= $I)                             return 9;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $D >= $I && $I >= $S)                 return 10;
        if ($D >  0 && $I <= 0 && $S >  0 && $C <= 0 && $D >= $S)                             return 11;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $C >= $I && $I >= $S)                 return 12;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $C >= $S && $S >= $I)                 return 13;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $I >= $S && $I >= $C)                 return 14;
        if ($D <= 0 && $I <= 0 && $S >  0 && $C <= 0)                                          return 15;
        if ($D <= 0 && $I <= 0 && $S >  0 && $C >  0 && $C >= $S)                             return 16;
        if ($D <= 0 && $I <= 0 && $S >  0 && $C >  0 && $S >= $C)                             return 17;
        if ($D >  0 && $I <= 0 && $S <= 0 && $C >  0 && $D >= $C)                             return 18;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $D >= $I && $I >= $C)                 return 19;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $D >= $S && $S >= $I)                 return 20;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $D >= $S && $S >= $C)                 return 21;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $D >= $C && $C >= $I)                 return 22;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $D >= $C && $C >= $S)                 return 23;
        if ($D <= 0 && $I >  0 && $S <= 0 && $C <= 0)                                          return 24;
        if ($D <= 0 && $I >  0 && $S >  0 && $C <= 0 && $I >= $S)                             return 25;
        if ($D <= 0 && $I >  0 && $S <= 0 && $C >  0 && $I >= $C)                             return 26;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $I >= $C && $C >= $D)                 return 27;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $I >= $C && $C >= $S)                 return 28;
        if ($D >  0 && $I <= 0 && $S >  0 && $C <= 0 && $S >= $D)                             return 29;
        if ($D <= 0 && $I >  0 && $S >  0 && $C <= 0 && $S >= $I)                             return 30;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $S >= $D && $D >= $I)                 return 31;
        if ($D >  0 && $I >  0 && $S >  0 && $C <= 0 && $S >= $I && $I >= $D)                 return 32;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $S >= $I && $I >= $C)                 return 33;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $S >= $C && $C >= $D)                 return 34;
        if ($D <= 0 && $I >  0 && $S >  0 && $C >  0 && $S >= $C && $C >= $I)                 return 35;
        if ($D <= 0 && $I >  0 && $S <= 0 && $C >  0 && $C >= $I)                             return 36;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $C >= $D && $D >= $I)                 return 37;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $C >= $D && $D >= $S)                 return 38;
        if ($D >  0 && $I >  0 && $S <= 0 && $C >  0 && $C >= $I && $I >= $D)                 return 39;
        if ($D >  0 && $I <= 0 && $S >  0 && $C >  0 && $C >= $S && $S >= $D)                 return 40;
        return 0;
    }

    private function getPatternResult(array $graph, string $label): array
    {
        $patternId = $this->matchPattern($graph['d'], $graph['i'], $graph['s'], $graph['c']);
        $data      = self::TBL_PATTERNS[$patternId] ?? self::TBL_PATTERNS[0];

        return [
            'label'      => $label,
            'pattern_id' => $patternId,
            'type'       => $data['type'],
            'pattern'    => $data['pattern'],
            'behaviour'  => array_map('trim', explode(',', $data['behaviour'])),
            'description'=> $data['description'],
            'jobs'        => array_filter(array_map('trim', explode(',', $data['jobs']))),
        ];
    }
}
