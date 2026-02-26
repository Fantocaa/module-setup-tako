<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsychotestQuestion;

class PapiCosticSeeder extends Seeder
{
    /**
     * PAPI-Kostic (Personality and Preference Inventory - Kostick)
     *
     * Cara scoring:
     * - Setiap soal terdiri dari 2 pernyataan (A & B).
     * - Setiap pernyataan mewakili satu "role" dari 20 role (A-T, role_id 1-20).
     * - User memilih satu pernyataan yang paling menggambarkan dirinya.
     * - Jumlah pilihan per role dihitung (range 0–9 per role dari 20 soal).
     * - Skor dicocokkan ke rules: 0-2=Lower, 3-5=Middle, 6-9=Higher.
     *
     * 20 Role (A-T) dalam 5 Aspek:
     * Aspek 1: A(1)=Leadership Role, B(2)=Need for Rules/Supervision, C(3)=Need for Companionship, D(4)=Social Extension
     * Aspek 2: E(5)=Emotional Restraint, F(6)=Affiliation, G(7)=Activity Level, H(8)=Work Drive
     * Aspek 3: I(9)=Attention to Detail, J(10)=Theoretical Thinking, K(11)=Flexibility, L(12)=Ease in Decision Making
     * Aspek 4: M(13)=Need to Achieve, N(14)=Role as General Manager, O(15)=Need for Status, P(16)=Personal Achievement Motivation
     * Aspek 5: Q(17)=Anxiety Level, R(18)=Planning Orientation, S(19)=Hard-Intense Worker, T(20)=Methodical Approach
     */
    public function run(): void
    {
        $questions = [
            [
                'q' => 1,
                'options' => [
                    [
                        'id' => 16, // P - Need for Self-Achievement
                        'role' => 'P',
                        'text' => 'Saya ingin dipuji karena pekerjaan yang saya lakukan dengan baik.',
                    ],
                    [
                        'id' => 10, // J - Conceptual Thinking
                        'role' => 'J',
                        'text' => 'Saya suka memikirkan masalah-masalah yang kompleks.',
                    ],
                ],
            ],
            [
                'q' => 2,
                'options' => [
                    [
                        'id' => 12, // L - Ease of Decision Making
                        'role' => 'L',
                        'text' => 'Saya merasa mudah membuat keputusan.',
                    ],
                    [
                        'id' => 3, // C - Need for Companionship
                        'role' => 'C',
                        'text' => 'Saya lebih suka bekerja bersama orang lain daripada sendirian.',
                    ],
                ],
            ],
            [
                'q' => 3,
                'options' => [
                    [
                        'id' => 18, // R - Planning Orientation
                        'role' => 'R',
                        'text' => 'Saya selalu merencanakan pekerjaan saya dengan hati-hati sebelum memulai.',
                    ],
                    [
                        'id' => 1, // A - Leadership Role
                        'role' => 'A',
                        'text' => 'Saya suka memimpin dan mengarahkan orang lain.',
                    ],
                ],
            ],
            [
                'q' => 4,
                'options' => [
                    [
                        'id' => 7, // G - Activity Level
                        'role' => 'G',
                        'text' => 'Saya selalu aktif dan sibuk dengan berbagai kegiatan.',
                    ],
                    [
                        'id' => 11, // K - Flexibility
                        'role' => 'K',
                        'text' => 'Saya suka mencoba cara-cara baru dalam menyelesaikan pekerjaan.',
                    ],
                ],
            ],
            [
                'q' => 5,
                'options' => [
                    [
                        'id' => 2, // B - Need for Rules
                        'role' => 'B',
                        'text' => 'Saya merasa lebih nyaman bekerja dengan aturan dan petunjuk yang jelas.',
                    ],
                    [
                        'id' => 19, // S - Hard-Intense Worker
                        'role' => 'S',
                        'text' => 'Saya bekerja keras dan tekun sampai pekerjaan selesai.',
                    ],
                ],
            ],
            [
                'q' => 6,
                'options' => [
                    [
                        'id' => 6, // F - Affiliation
                        'role' => 'F',
                        'text' => 'Saya merasa penting untuk memiliki banyak teman di tempat kerja.',
                    ],
                    [
                        'id' => 13, // M - Need to Achieve
                        'role' => 'M',
                        'text' => 'Saya selalu berusaha mencapai target dan tujuan yang telah ditetapkan.',
                    ],
                ],
            ],
            [
                'q' => 7,
                'options' => [
                    [
                        'id' => 19, // S - Hard-Intense Worker
                        'role' => 'S',
                        'text' => 'Saya tidak berhenti sebelum pekerjaan benar-benar selesai.',
                    ],
                    [
                        'id' => 12, // L - Ease of Decision Making
                        'role' => 'L',
                        'text' => 'Saya dapat membuat keputusan dengan cepat tanpa banyak pertimbangan.',
                    ],
                ],
            ],
            [
                'q' => 8,
                'options' => [
                    [
                        'id' => 10, // J - Conceptual Thinking
                        'role' => 'J',
                        'text' => 'Saya suka mencari hubungan antara berbagai ide dan konsep.',
                    ],
                    [
                        'id' => 18, // R - Planning Orientation
                        'role' => 'R',
                        'text' => 'Saya lebih suka membuat rencana yang terinci sebelum bertindak.',
                    ],
                ],
            ],
            [
                'q' => 9,
                'options' => [
                    [
                        'id' => 1, // A - Leadership Role
                        'role' => 'A',
                        'text' => 'Orang lain sering datang kepada saya untuk meminta bimbingan.',
                    ],
                    [
                        'id' => 5, // E - Emotional Restraint
                        'role' => 'E',
                        'text' => 'Saya biasanya dapat mengendalikan emosi saya dengan baik.',
                    ],
                ],
            ],
            [
                'q' => 10,
                'options' => [
                    [
                        'id' => 7, // G - Activity Level
                        'role' => 'G',
                        'text' => 'Saya berfungsi paling baik ketika ada banyak hal yang harus dilakukan.',
                    ],
                    [
                        'id' => 3, // C - Need for Companionship
                        'role' => 'C',
                        'text' => 'Saya menikmati pertemuan sosial dan berinteraksi dengan banyak orang.',
                    ],
                ],
            ],
            [
                'q' => 11,
                'options' => [
                    [
                        'id' => 15, // O - Need for Status
                        'role' => 'O',
                        'text' => 'Saya ingin memiliki kedudukan yang tinggi dan dihormati oleh orang lain.',
                    ],
                    [
                        'id' => 20, // T - Methodical Approach
                        'role' => 'T',
                        'text' => 'Saya selalu mengerjakan sesuatu dengan cara yang sistematis dan teratur.',
                    ],
                ],
            ],
            [
                'q' => 12,
                'options' => [
                    [
                        'id' => 8, // H - Work Drive
                        'role' => 'H',
                        'text' => 'Saya memiliki dorongan yang kuat untuk bekerja dan berprestasi.',
                    ],
                    [
                        'id' => 11, // K - Flexibility
                        'role' => 'K',
                        'text' => 'Saya mudah menyesuaikan diri dengan perubahan situasi.',
                    ],
                ],
            ],
            [
                'q' => 13,
                'options' => [
                    [
                        'id' => 20, // T - Methodical Approach
                        'role' => 'T',
                        'text' => 'Saya lebih suka mengerjakan satu hal dalam satu waktu secara metodis.',
                    ],
                    [
                        'id' => 4, // D - Social Extension
                        'role' => 'D',
                        'text' => 'Saya mudah bergaul dan membuat teman baru di mana saja.',
                    ],
                ],
            ],
            [
                'q' => 14,
                'options' => [
                    [
                        'id' => 14, // N - Role as General Manager
                        'role' => 'N',
                        'text' => 'Saya menikmati memikul tanggung jawab yang besar dalam pekerjaan.',
                    ],
                    [
                        'id' => 6, // F - Affiliation
                        'role' => 'F',
                        'text' => 'Saya senang bekerja dalam tim yang saling mendukung satu sama lain.',
                    ],
                ],
            ],
            [
                'q' => 15,
                'options' => [
                    [
                        'id' => 5, // E - Emotional Restraint
                        'role' => 'E',
                        'text' => 'Saya tidak mudah terbawa perasaan ketika menghadapi masalah.',
                    ],
                    [
                        'id' => 2, // B - Need for Rules
                        'role' => 'B',
                        'text' => 'Saya lebih produktif ketika ada prosedur yang jelas untuk diikuti.',
                    ],
                ],
            ],
            [
                'q' => 16,
                'options' => [
                    [
                        'id' => 13, // M - Need to Achieve
                        'role' => 'M',
                        'text' => 'Saya merasa puas ketika berhasil mencapai sesuatu yang sulit.',
                    ],
                    [
                        'id' => 9, // I - Attention to Detail
                        'role' => 'I',
                        'text' => 'Saya sangat teliti dan memperhatikan detail dalam setiap pekerjaan.',
                    ],
                ],
            ],
            [
                'q' => 17,
                'options' => [
                    [
                        'id' => 4, // D - Social Extension
                        'role' => 'D',
                        'text' => 'Saya aktif terlibat dalam kegiatan sosial dan komunitas.',
                    ],
                    [
                        'id' => 17, // Q - Anxiety Level (Low)
                        'role' => 'Q',
                        'text' => 'Saya sering merasa khawatir ketika menghadapi situasi yang tidak pasti.',
                    ],
                ],
            ],
            [
                'q' => 18,
                'options' => [
                    [
                        'id' => 9, // I - Attention to Detail
                        'role' => 'I',
                        'text' => 'Saya senang mengerjakan pekerjaan yang membutuhkan ketelitian dan kecermatan.',
                    ],
                    [
                        'id' => 14, // N - Role as General Manager
                        'role' => 'N',
                        'text' => 'Saya mampu mengorganisasi orang dan sumber daya untuk mencapai tujuan.',
                    ],
                ],
            ],
            [
                'q' => 19,
                'options' => [
                    [
                        'id' => 16, // P - Need for Self-Achievement
                        'role' => 'P',
                        'text' => 'Saya termotivasi oleh pengakuan atas pencapaian pribadi saya.',
                    ],
                    [
                        'id' => 8, // H - Work Drive
                        'role' => 'H',
                        'text' => 'Saya merasa perlu bekerja keras setiap hari untuk merasa produktif.',
                    ],
                ],
            ],
            [
                'q' => 20,
                'options' => [
                    [
                        'id' => 17, // Q - Anxiety Level
                        'role' => 'Q',
                        'text' => 'Saya mudah merasa cemas ketika banyak hal terjadi secara bersamaan.',
                    ],
                    [
                        'id' => 15, // O - Need for Status
                        'role' => 'O',
                        'text' => 'Bagi saya, posisi dan jabatan adalah hal yang penting dalam karir.',
                    ],
                ],
            ],
        ];

        foreach ($questions as $data) {
            PsychotestQuestion::updateOrCreate(
                [
                    'test_type'       => 'papicostic',
                    'session_number'  => 1,
                    'question_number' => $data['q'],
                ],
                [
                    'type'             => 'papicostic',
                    'section_number'   => 1,
                    'section_duration' => 2700, // 45 minutes
                    'content'          => [
                        'text'                => 'Dari dua pernyataan berikut, pilih SATU yang paling menggambarkan diri Anda.',
                        'section_title'       => 'PAPI-Kostic Personality Test',
                        'section_description' => 'Tes ini terdiri dari pasangan pernyataan yang berkaitan dengan situasi kerja. Pilih pernyataan yang paling mencerminkan kepribadian atau preferensi Anda. Tidak ada jawaban benar atau salah.',
                    ],
                    'options'          => $data['options'],
                    'correct_answer'   => null,
                ]
            );
        }
    }
}
