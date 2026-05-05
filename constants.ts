
import { ProficiencyLevel, Recommendation } from './types';

export const RECOMMENDATIONS: Record<ProficiencyLevel, Recommendation> = {
  [ProficiencyLevel.NEEDS_IMPROVEMENT]: {
    scoreRange: '60 - 69',
    level: ProficiencyLevel.NEEDS_IMPROVEMENT,
    characteristics: [
      'Kesulitan memahami ide pokok',
      'Terbatas dalam kosakata sulit',
      'Hanya mampu menjawab pertanyaan literal (apa, siapa, di mana)',
      'Membutuhkan waktu lama untuk membaca teks pendek'
    ],
    followUp: 'Berikan bimbingan intensif 1-on-1. Gunakan teks pendek dengan bahasa sederhana dan ilustrasi visual yang kuat. Fokus pada penguasaan kosakata dasar dan penemuan informasi tersurat.',
    readingMaterials: ['Komik edukasi', 'Cerita pendek 2 paragraf', 'Teks deskripsi benda sekitar']
  },
  [ProficiencyLevel.BASIC]: {
    scoreRange: '70 - 79',
    level: ProficiencyLevel.BASIC,
    characteristics: [
      'Mampu menemukan ide pokok teks sederhana',
      'Mampu melakukan inferensi sederhana (mengapa, bagaimana)',
      'Terkadang salah dalam menyimpulkan isi paragraf yang kompleks',
      'Mampu mengaitkan teks dengan pengalaman pribadi secara terbatas'
    ],
    followUp: 'Berikan latihan membaca terbimbing (Guided Reading). Gunakan teknik scaffolding seperti "Think-Aloud" untuk melatih cara menyimpulkan. Fokus pada pemahaman hubungan sebab-akibat.',
    readingMaterials: ['Dongeng fabel', 'Artikel berita pendek anak', 'Teks narasi sejarah sederhana']
  },
  [ProficiencyLevel.PROFICIENT]: {
    scoreRange: '80 - 89',
    level: ProficiencyLevel.PROFICIENT,
    characteristics: [
      'Mampu menganalisis karakter dan alur cerita',
      'Mampu membedakan fakta dan opini',
      'Lancar dalam membuat ringkasan yang koheren',
      'Mampu menarik kesimpulan dari informasi tersirat'
    ],
    followUp: 'Perluas jangkauan bacaan ke teks non-fiksi yang lebih kompleks. Berikan tantangan untuk mengevaluasi maksud penulis. Libatkan dalam diskusi kelompok untuk bertukar perspektif.',
    readingMaterials: ['Artikel sains populer', 'Biografi tokoh', 'Teks opini/editorial sederhana']
  },
  [ProficiencyLevel.ADVANCED]: {
    scoreRange: '90 - 100',
    level: ProficiencyLevel.ADVANCED,
    characteristics: [
      'Sangat baik dalam mengevaluasi teks secara kritis',
      'Mampu membandingkan dua teks berbeda dengan tema yang sama',
      'Memiliki kosakata yang luas dan mampu memahami nuansa bahasa',
      'Mampu mensintesis informasi untuk membuat karya baru'
    ],
    followUp: 'Berikan program pengayaan. Tantang siswa untuk menulis kritik sastra sederhana atau melakukan riset mandiri berbasis bacaan. Jadikan mereka tutor sebaya untuk membantu teman yang masih kesulitan.',
    readingMaterials: ['Esai sastra', 'Jurnal sains anak tingkat lanjut', 'Teks pidato klasik']
  }
};

export const getProficiencyLevel = (score: number): ProficiencyLevel => {
  if (score >= 90) return ProficiencyLevel.ADVANCED;
  if (score >= 80) return ProficiencyLevel.PROFICIENT;
  if (score >= 70) return ProficiencyLevel.BASIC;
  return ProficiencyLevel.NEEDS_IMPROVEMENT;
};
