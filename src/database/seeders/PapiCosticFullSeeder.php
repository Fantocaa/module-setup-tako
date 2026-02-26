<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsychotestQuestion;

class PapiCosticFullSeeder extends Seeder
{
    /**
     * PAPI-Kostic (Personality and Preference Inventory - Kostick) — 90 Soal
     *
     * Role_id pairs diambil dari referensi papi.sql (github.com/cahyadsn/papi).
     * Teks soal dalam bahasa Indonesia merepresentasikan tiap role.
     *
     * 20 Role (A–T) dalam 5 Aspek:
     *  1=A Leadership, 2=B Need Rules, 3=C Companionship, 4=D Social Extension
     *  5=E Emotional Restraint, 6=F Affiliation, 7=G Activity Level, 8=H Work Drive
     *  9=I Attention to Detail, 10=J Theoretical Thinking, 11=K Flexibility, 12=L Decision Making
     *  13=M Need to Achieve, 14=N General Manager, 15=O Need for Status, 16=P Personal Achievement
     *  17=Q Anxiety, 18=R Planning, 19=S Hard Worker, 20=T Methodical
     *
     * Cara scoring:
     *  - User memilih satu dari dua pernyataan per soal.
     *  - Pilihan menambah count pada role_id yang dipilih (range 0–9 tiap role).
     *  - 0–2 = Lower, 3–5 = Middle, 6–9 = Higher.
     */
    public function run(): void
    {
        $questions = [
            // Q1: P(16) vs J(10)
            [
                'q' => 1,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya ingin dipuji dan mendapat pengakuan atas pencapaian saya.'],
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya menikmati memecahkan masalah yang kompleks dan penuh tantangan intelektual.'],
                ],
            ],
            // Q2: L(12) vs C(3)
            [
                'q' => 2,
                'options' => [
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya dapat membuat keputusan dengan cepat dan percaya diri.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya lebih suka bekerja bersama orang lain daripada sendirian.'],
                ],
            ],
            // Q3: R(18) vs A(1)
            [
                'q' => 3,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya selalu merencanakan pekerjaan saya dengan matang sebelum memulai.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya suka memimpin dan mengambil kendali dalam situasi kelompok.'],
                ],
            ],
            // Q4: G(7) vs K(11)
            [
                'q' => 4,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya selalu bergerak aktif dan tidak suka berdiam diri.'],
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya senang mencoba pendekatan atau cara kerja yang baru.'],
                ],
            ],
            // Q5: B(2) vs D(4)
            [
                'q' => 5,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya bekerja lebih baik ketika ada prosedur dan aturan yang jelas.'],
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya mudah bergaul dan merasa nyaman di lingkungan sosial manapun.'],
                ],
            ],
            // Q6: F(6) vs N(14)
            [
                'q' => 6,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya merasa penting untuk memiliki hubungan yang baik dengan rekan kerja.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya menikmati memikul tanggung jawab besar dalam mengelola orang dan sumber daya.'],
                ],
            ],
            // Q7: S(19) vs L(12)
            [
                'q' => 7,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya tidak akan berhenti sebelum pekerjaan benar-benar selesai dengan baik.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya tidak memerlukan banyak informasi untuk mengambil sebuah keputusan.'],
                ],
            ],
            // Q8: R(18) vs L(12)
            [
                'q' => 8,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya suka membuat jadwal dan rencana kerja yang terinci.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Dalam situasi yang tidak pasti, saya masih dapat mengambil keputusan dengan tegas.'],
                ],
            ],
            // Q9: J(10) vs E(5)
            [
                'q' => 9,
                'options' => [
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya tertarik pada ide-ide abstrak dan teori yang menantang pikiran.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya biasanya dapat mengendalikan perasaan saya dalam situasi yang menekan.'],
                ],
            ],
            // Q10: G(7) vs O(15)
            [
                'q' => 10,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya berfungsi paling baik saat banyak kegiatan yang harus dikerjakan.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Bagi saya, memiliki status dan posisi yang diakui itu penting.'],
                ],
            ],
            // Q11: B(2) vs G(7)
            [
                'q' => 11,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya merasa lebih nyaman jika ada arahan yang jelas dari atasan.'],
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya adalah orang yang dinamis dan penuh semangat dalam bekerja.'],
                ],
            ],
            // Q12: S(19) vs P(16)
            [
                'q' => 12,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya bekerja dengan sungguh-sungguh dan penuh dedikasi hingga tugas selesai.'],
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya termotivasi ketika prestasi saya diakui oleh orang-orang di sekitar saya.'],
                ],
            ],
            // Q13: T(20) vs S(19)
            [
                'q' => 13,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya suka mengerjakan sesuatu secara berurutan dan mengikuti langkah yang terstruktur.'],
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya tekun dan tidak mudah menyerah meskipun pekerjaan terasa berat.'],
                ],
            ],
            // Q14: D(4) vs G(7)
            [
                'q' => 14,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya aktif terlibat dalam kegiatan sosial dan suka bertemu orang baru.'],
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya memiliki energi yang tinggi dan selalu ingin terlibat dalam berbagai kegiatan.'],
                ],
            ],
            // Q15: R(18) vs P(16)
            [
                'q' => 15,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya lebih suka mendekati masalah dengan perencanaan yang matang dan sistematis.'],
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya merasa bangga ketika hasil kerja saya diakui oleh orang lain.'],
                ],
            ],
            // Q16: F(6) vs Q(17)
            [
                'q' => 16,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya merasa senang menjadi bagian dari sebuah tim yang kompak.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya sering merasa khawatir jika sesuatu belum berjalan sesuai rencana.'],
                ],
            ],
            // Q17: K(11) vs M(13)
            [
                'q' => 17,
                'options' => [
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya mudah beradaptasi dengan perubahan situasi atau peran.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya selalu berusaha mencapai target yang telah saya tetapkan untuk diri sendiri.'],
                ],
            ],
            // Q18: I(9) vs J(10)
            [
                'q' => 18,
                'options' => [
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya sangat teliti dan memperhatikan setiap detail dalam pekerjaan saya.'],
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya suka menganalisis situasi secara mendalam sebelum mengambil tindakan.'],
                ],
            ],
            // Q19: T(20) vs C(3)
            [
                'q' => 19,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya lebih suka menyelesaikan satu tugas secara tuntas sebelum beralih ke tugas lain.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya merasa lebih bersemangat ketika bekerja dalam lingkungan yang ramai dan penuh interaksi.'],
                ],
            ],
            // Q20: H(8) vs M(13)
            [
                'q' => 20,
                'options' => [
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya memiliki dorongan yang kuat untuk bekerja keras setiap harinya.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya merasa puas ketika berhasil melampaui target atau ekspektasi.'],
                ],
            ],
            // Q21: H(8) vs K(11)
            [
                'q' => 21,
                'options' => [
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya merasa perlu bekerja lebih dari orang lain untuk merasa produktif.'],
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya terbuka terhadap perubahan dan siap mencoba hal-hal baru.'],
                ],
            ],
            // Q22: I(9) vs A(1)
            [
                'q' => 22,
                'options' => [
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya senang mengerjakan pekerjaan yang membutuhkan ketelitian dan kecermatan tinggi.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya suka mengambil inisiatif dan menentukan arah dalam kelompok.'],
                ],
            ],
            // Q23: R(18) vs I(9)
            [
                'q' => 23,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya selalu memikirkan langkah-langkah ke depan sebelum bertindak.'],
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya memastikan setiap detail pekerjaan saya akurat dan tidak ada yang terlewat.'],
                ],
            ],
            // Q24: F(6) vs G(7)
            [
                'q' => 24,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya menganggap kerja sama tim sebagai kunci keberhasilan sebuah pekerjaan.'],
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya adalah orang yang tidak bisa diam dan selalu ingin melakukan sesuatu.'],
                ],
            ],
            // Q25: K(11) vs O(15)
            [
                'q' => 25,
                'options' => [
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya tidak kaku dalam mengikuti metode kerja tertentu dan siap bereksperimen.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya ingin memiliki jabatan atau gelar yang menunjukkan pencapaian saya.'],
                ],
            ],
            // Q26: C(3) vs A(1)
            [
                'q' => 26,
                'options' => [
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya menikmati interaksi dan percakapan dengan banyak orang di tempat kerja.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya merasa bertanggung jawab untuk memastikan kelompok mencapai tujuannya.'],
                ],
            ],
            // Q27: P(16) vs E(5)
            [
                'q' => 27,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Pengakuan dari atasan atau rekan kerja adalah hal yang mendorong semangat kerja saya.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya dapat tetap tenang dan rasional bahkan dalam situasi yang penuh tekanan.'],
                ],
            ],
            // Q28: J(10) vs L(12)
            [
                'q' => 28,
                'options' => [
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya suka mempelajari konsep-konsep baru yang menambah wawasan saya.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya tidak perlu lama-lama berpikir untuk menentukan pilihan terbaik.'],
                ],
            ],
            // Q29: D(4) vs M(13)
            [
                'q' => 29,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya dengan mudah memperluas jaringan dan membangun hubungan baru.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya senang menetapkan target yang tinggi dan berusaha keras mencapainya.'],
                ],
            ],
            // Q30: G(7) vs H(8)
            [
                'q' => 30,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya selalu sibuk dan aktif; istirahat yang terlalu lama membuat saya gelisah.'],
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya memiliki etos kerja yang tinggi dan tidak mudah berhenti sebelum puas.'],
                ],
            ],
            // Q31: D(4) vs N(14)
            [
                'q' => 31,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya senang bersosialisasi dan mudah akrab dengan siapa pun.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya merasa nyaman saat harus mengatur dan mengoordinasikan pekerjaan orang banyak.'],
                ],
            ],
            // Q32: D(4) vs F(6)
            [
                'q' => 32,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya senang terlibat dalam berbagai kegiatan komunitas dan pertemuan sosial.'],
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya sangat mengutamakan kebersamaan dan kolaborasi dalam bekerja.'],
                ],
            ],
            // Q33: S(19) vs J(10)
            [
                'q' => 33,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya bekerja dengan intensitas tinggi dan tidak mudah terganggu oleh hal lain.'],
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya suka menelusuri latar belakang dan teori di balik suatu masalah.'],
                ],
            ],
            // Q34: P(16) vs L(12)
            [
                'q' => 34,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya bekerja lebih keras ketika prestasi saya mendapat perhatian dan apresiasi.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya merasa nyaman membuat keputusan meskipun data yang ada belum lengkap.'],
                ],
            ],
            // Q35: G(7) vs M(13)
            [
                'q' => 35,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya suka terlibat dalam banyak proyek secara bersamaan.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya memiliki keinginan yang kuat untuk terus berkembang dan berprestasi.'],
                ],
            ],
            // Q36: F(6) vs M(13)
            [
                'q' => 36,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya lebih produktif ketika bekerja dalam tim yang solid dan saling mendukung.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya selalu berorientasi pada hasil dan tidak puas dengan hasil yang biasa-biasa saja.'],
                ],
            ],
            // Q37: I(9) vs C(3)
            [
                'q' => 37,
                'options' => [
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya suka memeriksa pekerjaan secara menyeluruh untuk memastikan tidak ada kesalahan.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya merasa lebih nyaman dan produktif saat ada orang lain di sekitar saya.'],
                ],
            ],
            // Q38: J(10) vs A(1)
            [
                'q' => 38,
                'options' => [
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya suka berpikir mendalam dan mengkaji suatu situasi dari berbagai sudut pandang.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya cenderung menjadi pemimpin dalam situasi yang membutuhkan pengambilan keputusan.'],
                ],
            ],
            // Q39: F(6) vs H(8)
            [
                'q' => 39,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya menikmati membangun dan menjaga hubungan baik dengan kolega.'],
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya mendorong diri sendiri untuk selalu memberikan hasil kerja terbaik.'],
                ],
            ],
            // Q40: E(5) vs C(3)
            [
                'q' => 40,
                'options' => [
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya jarang menunjukkan perasaan saya secara berlebihan di lingkungan kerja.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya suka berada dalam lingkungan yang penuh dengan orang dan keramaian.'],
                ],
            ],
            // Q41: M(13) vs Q(17)
            [
                'q' => 41,
                'options' => [
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya menetapkan standar tinggi untuk diri sendiri dan berusaha memenuhinya.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya mudah merasa cemas ketika menghadapi ketidakpastian atau perubahan mendadak.'],
                ],
            ],
            // Q42: T(20) vs E(5)
            [
                'q' => 42,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya mengerjakan pekerjaan langkah demi langkah sesuai urutan yang telah saya rencanakan.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya tidak mudah terpancing emosi walau situasi kerja sangat menegangkan.'],
                ],
            ],
            // Q43: T(20) vs A(1)
            [
                'q' => 43,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya lebih suka bekerja dengan cara yang sistematis dan terorganisir.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya merasa nyaman saat harus membimbing atau mengarahkan orang lain.'],
                ],
            ],
            // Q44: D(4) vs Q(17)
            [
                'q' => 44,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya menikmati bertemu dengan orang-orang baru dari berbagai latar belakang.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya sering mencemaskan hasil pekerjaan saya sebelum selesai dikerjakan.'],
                ],
            ],
            // Q45: B(2) vs M(13)
            [
                'q' => 45,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya lebih produktif saat bekerja di bawah pedoman dan prosedur yang baku.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya selalu menantang diri sendiri untuk mencapai lebih dari yang diharapkan.'],
                ],
            ],
            // Q46: G(7) vs Q(17)
            [
                'q' => 46,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya bersemangat dan penuh energi dalam menjalani aktivitas sehari-hari.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya mudah merasa gelisah jika ada sesuatu yang belum terselesaikan.'],
                ],
            ],
            // Q47: F(6) vs O(15)
            [
                'q' => 47,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya percaya bahwa bekerja sama selalu menghasilkan hasil yang lebih baik.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya ingin dikenal sebagai seseorang yang berpengaruh dan dihormati di bidang saya.'],
                ],
            ],
            // Q48: G(7) vs N(14)
            [
                'q' => 48,
                'options' => [
                    ['id' => 7,  'role' => 'G', 'text' => 'Saya suka bergerak cepat dan mengerjakan banyak hal sekaligus.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya mampu mengelola berbagai tanggung jawab besar secara bersamaan.'],
                ],
            ],
            // Q49: H(8) vs Q(17)
            [
                'q' => 49,
                'options' => [
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya selalu berusaha memberikan yang terbaik dalam setiap pekerjaan yang saya lakukan.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya cenderung khawatir tentang berbagai kemungkinan yang bisa salah dalam pekerjaan saya.'],
                ],
            ],
            // Q50: I(9) vs E(5)
            [
                'q' => 50,
                'options' => [
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya tidak suka menyerahkan pekerjaan sebelum semua detailnya sempurna.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya dapat memisahkan perasaan pribadi dari penilaian profesional saya.'],
                ],
            ],
            // Q51: F(6) vs K(11)
            [
                'q' => 51,
                'options' => [
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya merasa keberhasilan tim lebih memuaskan daripada keberhasilan pribadi.'],
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya merasa nyaman berpindah dari satu jenis tugas ke jenis tugas yang berbeda.'],
                ],
            ],
            // Q52: I(9) vs L(12)
            [
                'q' => 52,
                'options' => [
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya secara cermat memeriksa setiap aspek pekerjaan saya untuk menghindari kesalahan.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya dapat dengan cepat memilah informasi untuk membuat keputusan yang tepat.'],
                ],
            ],
            // Q53: B(2) vs F(6)
            [
                'q' => 53,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya merasa lebih aman ketika ada panduan yang jelas tentang cara mengerjakan sesuatu.'],
                    ['id' => 6,  'role' => 'F', 'text' => 'Saya lebih suka berkolaborasi dengan orang lain daripada bekerja sendiri.'],
                ],
            ],
            // Q54: S(19) vs I(9)
            [
                'q' => 54,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya terus bekerja keras tanpa mengenal lelah untuk menyelesaikan tanggung jawab saya.'],
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya menghabiskan waktu ekstra untuk memverifikasi bahwa pekerjaan saya bebas dari kesalahan.'],
                ],
            ],
            // Q55: T(20) vs I(9)
            [
                'q' => 55,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya lebih suka menyelesaikan sesuatu secara teratur dan sesuai prosedur.'],
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya perhatian terhadap hal-hal kecil yang sering diabaikan orang lain.'],
                ],
            ],
            // Q56: T(20) vs R(18)
            [
                'q' => 56,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya mengikuti prosedur yang telah ditetapkan secara konsisten dalam setiap pekerjaan.'],
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya menyusun rencana kerja yang menyeluruh sebelum memulai proyek apapun.'],
                ],
            ],
            // Q57: B(2) vs N(14)
            [
                'q' => 57,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya merasa lebih efektif saat bekerja dalam kerangka aturan yang sudah ditetapkan.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya merasa bertanggung jawab untuk memastikan semua orang dalam tim berjalan ke arah yang sama.'],
                ],
            ],
            // Q58: B(2) vs K(11)
            [
                'q' => 58,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya lebih menyukai lingkungan kerja yang stabil dengan peran yang jelas.'],
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya menikmati pekerjaan yang bervariasi dan tidak berulang-ulang.'],
                ],
            ],
            // Q59: K(11) vs Q(17)
            [
                'q' => 59,
                'options' => [
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya mudah menyesuaikan diri jika terjadi perubahan mendadak dalam pekerjaan.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya sering merasa khawatir jika menghadapi situasi yang tidak saya kuasai.'],
                ],
            ],
            // Q60: O(15) vs N(14)
            [
                'q' => 60,
                'options' => [
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya menginginkan posisi yang memberikan prestise dan pengakuan dari orang banyak.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya mampu dan bersedia menanggung beban tanggung jawab yang besar.'],
                ],
            ],
            // Q61: R(18) vs J(10)
            [
                'q' => 61,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya selalu mengantisipasi kemungkinan masalah dan menyiapkan solusinya terlebih dahulu.'],
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya suka membahas ide-ide besar dan konsep yang kompleks dengan orang lain.'],
                ],
            ],
            // Q62: J(10) vs C(3)
            [
                'q' => 62,
                'options' => [
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya tertarik untuk memahami cara kerja sesuatu secara mendalam dan teoritis.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya menikmati berinteraksi dengan orang-orang dari berbagai latar belakang.'],
                ],
            ],
            // Q63: P(16) vs C(3)
            [
                'q' => 63,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya merasa paling termotivasi ketika usaha saya diakui dan dihargai orang lain.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya lebih menyukai pekerjaan yang melibatkan banyak interaksi dengan orang.'],
                ],
            ],
            // Q64: H(8) vs O(15)
            [
                'q' => 64,
                'options' => [
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya merasa harus bekerja lebih giat dari rata-rata orang untuk meraih tujuan saya.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya mengharapkan posisi atau jabatan yang mencerminkan kemampuan dan pengalaman saya.'],
                ],
            ],
            // Q65: T(20) vs P(16)
            [
                'q' => 65,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya cenderung mengerjakan sesuatu dengan tahapan yang rapi dan tidak loncat-loncat.'],
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya merasa lebih bersemangat jika pekerjaan saya dilihat dan diapresiasi oleh atasan.'],
                ],
            ],
            // Q66: L(12) vs A(1)
            [
                'q' => 66,
                'options' => [
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya biasanya cepat membuat keputusan tanpa banyak menunda-nunda.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya secara alami mengambil peran kepemimpinan dalam berbagai situasi.'],
                ],
            ],
            // Q67: P(16) vs A(1)
            [
                'q' => 67,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya ingin pekerjaan saya dilihat sebagai kontribusi individual yang bernilai.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya menyukai posisi di mana saya dapat memimpin dan mempengaruhi orang lain.'],
                ],
            ],
            // Q68: O(15) vs Q(17)
            [
                'q' => 68,
                'options' => [
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya termotivasi oleh keinginan untuk mendapatkan posisi bergengsi dalam karir saya.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya sering merasa cemas tentang bagaimana orang lain menilai pekerjaan saya.'],
                ],
            ],
            // Q69: R(18) vs C(3)
            [
                'q' => 69,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya tidak nyaman memulai sesuatu tanpa rencana yang jelas.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya merasa kesepian jika bekerja sendirian dalam waktu yang lama.'],
                ],
            ],
            // Q70: B(2) vs Q(17)
            [
                'q' => 70,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya merasa lebih tenang dan efektif jika ada petunjuk yang jelas tentang apa yang harus dilakukan.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya sering mengkhawatirkan hal-hal yang mungkin salah dalam pekerjaan saya.'],
                ],
            ],
            // Q71: D(4) vs O(15)
            [
                'q' => 71,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya senang membangun jaringan pertemanan yang luas dalam lingkungan kerja.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya ingin karir saya mencerminkan tingkat keahlian dan pengalaman yang saya miliki.'],
                ],
            ],
            // Q72: K(11) vs N(14)
            [
                'q' => 72,
                'options' => [
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya dapat dengan mudah berpindah fokus ketika situasi menuntut perubahan arah.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya nyaman memimpin tim untuk mencapai tujuan organisasi yang lebih besar.'],
                ],
            ],
            // Q73: B(2) vs H(8)
            [
                'q' => 73,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya membutuhkan kerangka kerja yang jelas untuk dapat bekerja secara optimal.'],
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya tidak pernah puas jika belum memberikan upaya maksimal dalam pekerjaan.'],
                ],
            ],
            // Q74: S(19) vs R(18)
            [
                'q' => 74,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya dikenal sebagai orang yang pekerja keras dan tidak mudah menyerah.'],
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya sangat mementingkan perencanaan yang baik dalam setiap aspek pekerjaan.'],
                ],
            ],
            // Q75: E(5) vs A(1)
            [
                'q' => 75,
                'options' => [
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya dapat menangani konflik dengan kepala dingin tanpa terbawa emosi.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya tidak ragu untuk mengambil alih kepemimpinan jika situasi membutuhkan.'],
                ],
            ],
            // Q76: P(16) vs I(9)
            [
                'q' => 76,
                'options' => [
                    ['id' => 16, 'role' => 'P', 'text' => 'Saya ingin kerja keras saya diakui dan mendapat penghargaan yang setimpal.'],
                    ['id' => 9,  'role' => 'I', 'text' => 'Saya sangat berhati-hati dalam memeriksa fakta dan data sebelum membuat kesimpulan.'],
                ],
            ],
            // Q77: T(20) vs J(10)
            [
                'q' => 77,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya lebih suka mengikuti metode kerja yang telah terbukti efektif.'],
                    ['id' => 10, 'role' => 'J', 'text' => 'Saya tertarik untuk menggali teori dan dasar pemikiran di balik suatu permasalahan.'],
                ],
            ],
            // Q78: T(20) vs L(12)
            [
                'q' => 78,
                'options' => [
                    ['id' => 20, 'role' => 'T', 'text' => 'Saya menyelesaikan pekerjaan secara bertahap dan tidak suka melangkahi prosedur.'],
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya percaya diri dalam mengambil keputusan, bahkan dalam kondisi yang tidak pasti.'],
                ],
            ],
            // Q79: L(12) vs E(5)
            [
                'q' => 79,
                'options' => [
                    ['id' => 12, 'role' => 'L', 'text' => 'Saya dapat memilih solusi terbaik dengan cepat dari berbagai pilihan yang ada.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya dapat menghadapi situasi yang menegangkan tanpa kehilangan ketenangan.'],
                ],
            ],
            // Q80: H(8) vs N(14)
            [
                'q' => 80,
                'options' => [
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya secara konsisten berusaha melampaui standar yang ditetapkan untuk saya.'],
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya merasa paling efektif saat diberi wewenang untuk mengelola tim dan proyek.'],
                ],
            ],
            // Q81: R(18) vs E(5)
            [
                'q' => 81,
                'options' => [
                    ['id' => 18, 'role' => 'R', 'text' => 'Saya merencanakan setiap detail sebelum melaksanakan suatu pekerjaan.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya mampu mempertahankan objektivitas saya meskipun situasi penuh tekanan emosional.'],
                ],
            ],
            // Q82: N(14) vs M(13)
            [
                'q' => 82,
                'options' => [
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya suka memegang kendali dan mengatur jalannya suatu proyek atau tim.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya didorong oleh keinginan untuk mencapai hasil yang luar biasa dalam pekerjaan saya.'],
                ],
            ],
            // Q83: D(4) vs H(8)
            [
                'q' => 83,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya mudah bergaul dan memiliki banyak kenalan dari berbagai kalangan.'],
                    ['id' => 8,  'role' => 'H', 'text' => 'Saya bekerja dengan penuh semangat dan tidak mudah berhenti sampai tujuan tercapai.'],
                ],
            ],
            // Q84: D(4) vs K(11)
            [
                'q' => 84,
                'options' => [
                    ['id' => 4,  'role' => 'D', 'text' => 'Saya aktif berpartisipasi dalam kegiatan sosial dan komunitas.'],
                    ['id' => 11, 'role' => 'K', 'text' => 'Saya fleksibel dan tidak kaku dalam menghadapi perubahan situasi kerja.'],
                ],
            ],
            // Q85: N(14) vs Q(17)
            [
                'q' => 85,
                'options' => [
                    ['id' => 14, 'role' => 'N', 'text' => 'Saya siap mengambil alih tanggung jawab besar dan memimpin orang menuju tujuan bersama.'],
                    ['id' => 17, 'role' => 'Q', 'text' => 'Saya mudah merasa cemas jika ada hal-hal yang di luar kendali saya.'],
                ],
            ],
            // Q86: S(19) vs A(1)
            [
                'q' => 86,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya terkenal sebagai pekerja yang gigih dan tidak pernah setengah-setengah.'],
                    ['id' => 1,  'role' => 'A', 'text' => 'Saya sering menjadi orang yang menentukan arah dan menggerakkan orang lain untuk bertindak.'],
                ],
            ],
            // Q87: B(2) vs O(15)
            [
                'q' => 87,
                'options' => [
                    ['id' => 2,  'role' => 'B', 'text' => 'Saya merasa lebih tenang bekerja dalam sistem yang sudah terstruktur dengan baik.'],
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya ingin karir saya diakui sebagai simbol kesuksesan dan pencapaian.'],
                ],
            ],
            // Q88: S(19) vs C(3)
            [
                'q' => 88,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya pantang menyerah dan akan terus berusaha sampai pekerjaan tuntas.'],
                    ['id' => 3,  'role' => 'C', 'text' => 'Saya merasa lebih bersemangat ketika ada teman-teman atau kolega di sekitar saya.'],
                ],
            ],
            // Q89: O(15) vs M(13)
            [
                'q' => 89,
                'options' => [
                    ['id' => 15, 'role' => 'O', 'text' => 'Saya sangat menginginkan pengakuan atas status dan kedudukan saya di dalam organisasi.'],
                    ['id' => 13, 'role' => 'M', 'text' => 'Saya tidak pernah puas dengan hasil biasa; saya selalu mendorong diri untuk lebih tinggi.'],
                ],
            ],
            // Q90: S(19) vs E(5)
            [
                'q' => 90,
                'options' => [
                    ['id' => 19, 'role' => 'S', 'text' => 'Saya bekerja dengan intensitas tinggi dan berkomitmen penuh hingga tugas selesai.'],
                    ['id' => 5,  'role' => 'E', 'text' => 'Saya tidak membiarkan perasaan negatif mempengaruhi kualitas pekerjaan saya.'],
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
                    'section_duration' => 2700, // 45 minutes for 90 questions
                    'content'          => [
                        'text'                => 'Dari dua pernyataan berikut, pilih SATU yang paling menggambarkan diri Anda.',
                        'section_title'       => 'PAPI-Kostic Personality Test',
                        'section_description' => 'Tes ini terdiri dari 90 pasang pernyataan yang berkaitan dengan situasi kerja. Dari setiap pasang, pilih satu pernyataan yang paling mencerminkan kepribadian atau preferensi kerja Anda. Tidak ada jawaban benar atau salah. Kerjakan dengan jujur dan spontan.',
                    ],
                    'options'          => $data['options'],
                    'correct_answer'   => null,
                ]
            );
        }
    }
}
