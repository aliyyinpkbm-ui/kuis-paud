import { Question, QuestionCategory } from '../types';

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  angka: 'Mengenal Angka',
  berhitung: 'Berhitung Sederhana',
  warna: 'Mengenal Warna',
  bentuk: 'Mengenal Bentuk',
  huruf: 'Mengenal Huruf',
  hewan: 'Mengenal Hewan',
  buah: 'Mengenal Buah',
  benda: 'Benda di Sekitar',
  besar_kecil: 'Besar dan Kecil',
  banyak_sedikit: 'Banyak dan Sedikit',
};

// Helper to shuffle options and keep track of correct answer index
function buildQuestionOptions(
  correct: string,
  wrongs: string[]
): { options: string[]; correctAnswerIndex: number } {
  // Take 3 wrong options max or exact available
  const selectedWrongs = [...wrongs].sort(() => 0.5 - Math.random()).slice(0, 3);
  const all = [correct, ...selectedWrongs];
  // Deterministic or clean shuffle
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  const correctAnswerIndex = shuffled.indexOf(correct);
  return { options: shuffled, correctAnswerIndex };
}

export function generateQuestionBank(): Question[] {
  const bank: Question[] = [];

  // 1. MENGENAL ANGKA (25 questions)
  const numberNames = ['Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'];
  
  for (let n = 1; n <= 10; n++) {
    const correct = String(n);
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== n).map(String);
    const { options, correctAnswerIndex } = buildQuestionOptions(correct, wrongs);

    bank.push({
      id: `ANGKA_RECOG_${n}`,
      category: 'angka',
      categoryLabel: CATEGORY_LABELS.angka,
      questionText: `Manakah angka ${n}?`,
      visualData: {
        type: 'text',
        mainEmoji: '🔢',
        subText: `Pilih simbol angka ${n}`
      },
      options,
      correctAnswerIndex,
      explanation: `Angka ${n} ditunjukkan dengan simbol ${n}.`,
      speechText: `Manakah angka ${n}?`
    });

    // Word to number
    const nameStr = numberNames[n - 1];
    const { options: opts2, correctAnswerIndex: idx2 } = buildQuestionOptions(correct, wrongs);
    bank.push({
      id: `ANGKA_WORD_${n}`,
      category: 'angka',
      categoryLabel: CATEGORY_LABELS.angka,
      questionText: `Angka manakah yang dibaca "${nameStr}"?`,
      visualData: {
        type: 'text',
        mainEmoji: '🗣️',
        subText: nameStr
      },
      options: opts2,
      correctAnswerIndex: idx2,
      explanation: `Kata "${nameStr}" melambangkan angka ${n}.`,
      speechText: `Angka manakah yang dibaca ${nameStr}?`
    });
  }

  // Sequence questions
  for (let n = 1; n <= 5; n++) {
    const nextNum = n + 1;
    const correct = String(nextNum);
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== nextNum).map(String);
    const { options, correctAnswerIndex } = buildQuestionOptions(correct, wrongs);

    bank.push({
      id: `ANGKA_SEQ_${n}`,
      category: 'angka',
      categoryLabel: CATEGORY_LABELS.angka,
      questionText: `Setelah angka ${n}, angka berapakah berikutnya?`,
      visualData: {
        type: 'text',
        mainEmoji: '➡️',
        subText: `${n} ➔ ?`
      },
      options,
      correctAnswerIndex,
      explanation: `Urutan berhitung setelah ${n} adalah ${nextNum}.`,
      speechText: `Setelah angka ${n}, angka berapakah berikutnya?`
    });
  }

  // 2. BERHITUNG SEDERHANA (30 questions)
  const countableItems = [
    { emoji: '🍎', name: 'apel' },
    { emoji: '🦆', name: 'bebek' },
    { emoji: '⭐', name: 'bintang' },
    { emoji: '🎈', name: 'balon' },
    { emoji: '🚗', name: 'mobil' },
    { emoji: '🍬', name: 'permen' },
    { emoji: '🌸', name: 'bunga' },
    { emoji: '🐟', name: 'ikan' },
    { emoji: '🍊', name: 'jeruk' },
    { emoji: '🐱', name: 'kucing' }
  ];

  for (let count = 1; count <= 10; count++) {
    const item = countableItems[(count - 1) % countableItems.length];
    const correct = String(count);
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== count).map(String);
    const { options, correctAnswerIndex } = buildQuestionOptions(correct, wrongs);

    bank.push({
      id: `HITUNG_COUNT_${item.name}_${count}`,
      category: 'berhitung',
      categoryLabel: CATEGORY_LABELS.berhitung,
      questionText: `Ada berapa ${item.name} pada gambar di bawah?`,
      visualData: {
        type: 'count',
        count: count,
        itemEmoji: item.emoji,
        itemName: item.name
      },
      options,
      correctAnswerIndex,
      explanation: `Ayo hitung bersama: ada ${count} ${item.name}!`,
      speechText: `Ada berapa ${item.name} pada gambar di bawah?`
    });
  }

  // Simple addition questions (Visual sums up to 10)
  const sumPairs = [
    { a: 1, b: 1, emoji: '🎈', name: 'balon' },
    { a: 2, b: 1, emoji: '🍎', name: 'apel' },
    { a: 2, b: 2, emoji: '⭐', name: 'bintang' },
    { a: 3, b: 2, emoji: '🦆', name: 'bebek' },
    { a: 3, b: 3, emoji: '🌸', name: 'bunga' },
    { a: 4, b: 1, emoji: '🍬', name: 'permen' },
    { a: 4, b: 2, emoji: '🍊', name: 'jeruk' },
    { a: 5, b: 1, emoji: '🚗', name: 'mobil' },
    { a: 5, b: 2, emoji: '🐟', name: 'ikan' },
    { a: 5, b: 5, emoji: '🖐️', name: 'jari' },
  ];

  sumPairs.forEach((pair, idx) => {
    const sum = pair.a + pair.b;
    const correct = String(sum);
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== sum).map(String);
    const { options, correctAnswerIndex } = buildQuestionOptions(correct, wrongs);

    bank.push({
      id: `HITUNG_SUM_${idx}`,
      category: 'berhitung',
      categoryLabel: CATEGORY_LABELS.berhitung,
      questionText: `${pair.a} ${pair.name} ditambah ${pair.b} ${pair.name} menjadi berapa?`,
      visualData: {
        type: 'comparison',
        itemA: { name: `${pair.a} ${pair.name}`, emoji: pair.emoji, count: pair.a },
        itemB: { name: `${pair.b} ${pair.name}`, emoji: pair.emoji, count: pair.b }
      },
      options,
      correctAnswerIndex,
      explanation: `${pair.a} + ${pair.b} = ${sum}. Jawaban yang benar adalah ${sum}!`,
      speechText: `${pair.a} ${pair.name} ditambah ${pair.b} ${pair.name} menjadi berapa?`
    });
  });

  // 3. MENGENAL WARNA (25 questions)
  const colorsList = [
    { name: 'Merah', hex: '#EF4444', emoji: '🔴', item: 'Apel / Stroberi' },
    { name: 'Biru', hex: '#3B82F6', emoji: '🔵', item: 'Langit / Laut' },
    { name: 'Kuning', hex: '#EAB308', emoji: '🟡', item: 'Matahari / Pisang' },
    { name: 'Hijau', hex: '#22C55E', emoji: '🟢', item: 'Daun / Rumput' },
    { name: 'Jingga (Oranye)', hex: '#F97316', emoji: '🟠', item: 'Jeruk / Wortel' },
    { name: 'Ungu', hex: '#A855F7', emoji: '🟣', item: 'Anggur / Terung' },
    { name: 'Merah Muda (Pink)', hex: '#EC4899', emoji: '🌸', item: 'Bunga Pink' },
    { name: 'Cokelat', hex: '#8B4513', emoji: '🐻', item: 'Cokelat / Batang Pohon' },
    { name: 'Hitam', hex: '#1F2937', emoji: '⬛', item: 'Malam / Ban Mobil' },
    { name: 'Putih', hex: '#FFFFFF', emoji: '⬜', item: 'Awan / Susu' }
  ];

  colorsList.forEach((col, idx) => {
    // Identify color name
    const allNames = colorsList.map(c => c.name);
    const wrongs = allNames.filter(n => n !== col.name);
    const { options, correctAnswerIndex } = buildQuestionOptions(col.name, wrongs);

    bank.push({
      id: `WARNA_RECOG_${idx}`,
      category: 'warna',
      categoryLabel: CATEGORY_LABELS.warna,
      questionText: `Warna apakah yang ditampilkan pada lingkaran ini?`,
      visualData: {
        type: 'color_shape',
        shape: 'lingkaran',
        colorHex: col.hex,
        colorName: col.name
      },
      options,
      correctAnswerIndex,
      explanation: `Gambar lingkaran ini berwarna ${col.name}.`,
      speechText: `Warna apakah yang ditampilkan pada lingkaran ini?`
    });

    // Pick color for object
    const { options: opts2, correctAnswerIndex: idx2 } = buildQuestionOptions(col.name, wrongs);
    bank.push({
      id: `WARNA_OBJ_${idx}`,
      category: 'warna',
      categoryLabel: CATEGORY_LABELS.warna,
      questionText: `Benda seperti ${col.item} biasanya berwarna apa?`,
      visualData: {
        type: 'text',
        mainEmoji: col.emoji,
        subText: col.item
      },
      options: opts2,
      correctAnswerIndex: idx2,
      explanation: `${col.item} umumnya memiliki warna ${col.name}.`,
      speechText: `Benda seperti ${col.item} biasanya berwarna apa?`
    });
  });

  // 4. MENGENAL BENTUK (20 questions)
  const shapesList = [
    { key: 'lingkaran', name: 'Lingkaran', emoji: '⚪', example: 'Roda Sepeda / Bola' },
    { key: 'persegi', name: 'Persegi', emoji: '⏹️', example: 'Jendela Rumah / Papan Catur' },
    { key: 'segitiga', name: 'Segitiga', emoji: '🔺', example: 'Atap Rumah / Potongan Pizza' },
    { key: 'bintang', name: 'Bintang', emoji: '⭐', example: 'Bintang di Langit' },
    { key: 'hati', name: 'Hati / Love', emoji: '❤️', example: 'Simbol Kasih Sayang' },
    { key: 'oval', name: 'Oval / Lonjong', emoji: '🥚', example: 'Telur Ayam' },
    { key: 'persegi_panjang', name: 'Persegi Panjang', emoji: '🚪', example: 'Pintu / Papan Tulis' }
  ] as const;

  shapesList.forEach((shp) => {
    const allShapeNames = shapesList.map(s => s.name);
    const wrongs = allShapeNames.filter(n => n !== shp.name);
    const { options, correctAnswerIndex } = buildQuestionOptions(shp.name, wrongs);

    bank.push({
      id: `BENTUK_RECOG_${shp.key}`,
      category: 'bentuk',
      categoryLabel: CATEGORY_LABELS.bentuk,
      questionText: `Bentuk apakah gambar di bawah ini?`,
      visualData: {
        type: 'color_shape',
        shape: shp.key,
        colorHex: '#3B82F6',
        colorName: 'Biru'
      },
      options,
      correctAnswerIndex,
      explanation: `Bentuk bangun ini adalah ${shp.name}.`,
      speechText: `Bentuk apakah gambar di bawah ini?`
    });

    const { options: opts2, correctAnswerIndex: idx2 } = buildQuestionOptions(shp.name, wrongs);
    bank.push({
      id: `BENTUK_EX_${shp.key}`,
      category: 'bentuk',
      categoryLabel: CATEGORY_LABELS.bentuk,
      questionText: `${shp.example} memiliki bentuk seperti apa?`,
      visualData: {
        type: 'text',
        mainEmoji: shp.emoji,
        subText: shp.example
      },
      options: opts2,
      correctAnswerIndex: idx2,
      explanation: `${shp.example} berbentuk ${shp.name}.`,
      speechText: `${shp.example} memiliki bentuk seperti apa?`
    });
  });

  // 5. MENGENAL HURUF (25 questions)
  const alphabetList = [
    { letter: 'A', word: 'Apel', emoji: '🍎' },
    { letter: 'B', word: 'Bebek', emoji: '🦆' },
    { letter: 'C', word: 'Cacing', emoji: '🐛' },
    { letter: 'D', word: 'Domba', emoji: '🐑' },
    { letter: 'E', word: 'Elang', emoji: '🦅' },
    { letter: 'G', word: 'Gajah', emoji: '🐘' },
    { letter: 'I', word: 'Ikan', emoji: '🐟' },
    { letter: 'J', word: 'Jagung', emoji: '🌽' },
    { letter: 'K', word: 'Kucing', emoji: '🐱' },
    { letter: 'M', word: 'Monyet', emoji: '🐒' },
    { letter: 'N', word: 'Nanas', emoji: '🍍' },
    { letter: 'P', word: 'Pisang', emoji: '🍌' },
    { letter: 'S', word: 'Sapi', emoji: '🐄' },
    { letter: 'T', word: 'Topi', emoji: '🧢' },
    { letter: 'U', word: 'Udang', emoji: '🦐' },
    { letter: 'W', word: 'Wortel', emoji: '🥕' }
  ];

  alphabetList.forEach((item) => {
    // Starting letter question
    const allLetters = alphabetList.map(a => a.letter);
    const wrongs = allLetters.filter(l => l !== item.letter);
    const { options, correctAnswerIndex } = buildQuestionOptions(item.letter, wrongs);

    bank.push({
      id: `HURUF_FIRST_${item.letter}`,
      category: 'huruf',
      categoryLabel: CATEGORY_LABELS.huruf,
      questionText: `Huruf awal dari kata "${item.word}" adalah?`,
      visualData: {
        type: 'letter',
        letter: item.letter,
        word: item.word,
        wordEmoji: item.emoji
      },
      options,
      correctAnswerIndex,
      explanation: `Kata "${item.word}" diawali dengan huruf ${item.letter}.`,
      speechText: `Huruf awal dari kata ${item.word} adalah?`
    });

    // Recognize letter
    const { options: opts2, correctAnswerIndex: idx2 } = buildQuestionOptions(item.letter, wrongs);
    bank.push({
      id: `HURUF_RECOG_${item.letter}`,
      category: 'huruf',
      categoryLabel: CATEGORY_LABELS.huruf,
      questionText: `Manakah huruf kapital "${item.letter}"?`,
      visualData: {
        type: 'text',
        mainEmoji: '🔤',
        subText: `Huruf ${item.letter}`
      },
      options: opts2,
      correctAnswerIndex: idx2,
      explanation: `Huruf yang benar adalah huruf ${item.letter}.`,
      speechText: `Manakah huruf kapital ${item.letter}?`
    });
  });

  // 6. MENGENAL HEWAN (25 questions)
  const animalsList = [
    { name: 'Kucing', sound: 'Meong meong', trait: 'suka mengejar tikus', emoji: '🐱' },
    { name: 'Anjing', sound: 'Guk guk', trait: 'penjaga rumah yang setia', emoji: '🐶' },
    { name: 'Sapi', sound: 'Moo moo', trait: 'menghasilkan susu segar', emoji: '🐄' },
    { name: 'Bebek', sound: 'Kwek kwek', trait: 'pandai berenang di kolam', emoji: '🦆' },
    { name: 'Ayam', sound: 'Kukuruyuk', trait: 'menghasilkan telur', emoji: '🐔' },
    { name: 'Kelinci', sound: 'Melompat-lompat', trait: 'suka makan wortel', emoji: '🐰' },
    { name: 'Gajah', sound: 'Mengaum tinggi', trait: 'memiliki belalai panjang', emoji: '🐘' },
    { name: 'Monyet', sound: 'Uu aa', trait: 'suka memanjat dan makan pisang', emoji: '🐒' },
    { name: 'Burung', sound: 'Cicit cuit', trait: 'bisa terbang tinggi di udara', emoji: '🐦' },
    { name: 'Ikan', sound: 'Berenang', trait: 'hidup dan berenang di dalam air', emoji: '🐟' },
    { name: 'Jerapah', sound: 'Tinggi', trait: 'memiliki leher yang sangat panjang', emoji: '🦒' },
    { name: 'Singa', sound: 'Auman keras', trait: 'raja hutan yang pemberani', emoji: '🦁' }
  ];

  animalsList.forEach((anm) => {
    const allNames = animalsList.map(a => a.name);
    const wrongs = allNames.filter(n => n !== anm.name);

    // Identify by sound/trait
    const { options, correctAnswerIndex } = buildQuestionOptions(anm.name, wrongs);
    bank.push({
      id: `HEWAN_SOUND_${anm.name}`,
      category: 'hewan',
      categoryLabel: CATEGORY_LABELS.hewan,
      questionText: `Suara "${anm.sound}" atau hewan yang ${anm.trait} adalah?`,
      visualData: {
        type: 'animal',
        mainEmoji: anm.emoji,
        subText: anm.name
      },
      options,
      correctAnswerIndex,
      explanation: `${anm.name} adalah hewan yang ${anm.trait}.`,
      speechText: `Hewan yang bersuara ${anm.sound} adalah?`
    });

    // Identify image
    const { options: opts2, correctAnswerIndex: idx2 } = buildQuestionOptions(anm.name, wrongs);
    bank.push({
      id: `HEWAN_RECOG_${anm.name}`,
      category: 'hewan',
      categoryLabel: CATEGORY_LABELS.hewan,
      questionText: `Manakah hewan "${anm.name}"?`,
      visualData: {
        type: 'animal',
        mainEmoji: anm.emoji,
        subText: `Gambar ${anm.name}`
      },
      options: opts2,
      correctAnswerIndex: idx2,
      explanation: `Ini adalah gambar ${anm.name} ${anm.emoji}.`,
      speechText: `Manakah hewan ${anm.name}?`
    });
  });

  // 7. MENGENAL BUAH (20 questions)
  const fruitsList = [
    { name: 'Apel', color: 'Merah', emoji: '🍎', desc: 'buah manis berwarna merah' },
    { name: 'Pisang', color: 'Kuning', emoji: '🍌', desc: 'buah manis disukai monyet' },
    { name: 'Jeruk', color: 'Jingga / Oranye', emoji: '🍊', desc: 'buah kaya vitamin C' },
    { name: 'Stroberi', color: 'Merah dengan bintik', emoji: '🍓', desc: 'buah manis asam kecil' },
    { name: 'Anggur', color: 'Ungu', emoji: '🍇', desc: 'buah bulat manis bergerombol' },
    { name: 'Semangka', color: 'Hijau di luar, Merah di dalam', emoji: '🍉', desc: 'buah segar banyak air' },
    { name: 'Nanas', color: 'Kuning bersisik', emoji: '🍍', desc: 'buah bermahkota daun' },
    { name: 'Mangga', color: 'Hijau / Kuning', emoji: '🥭', desc: 'buah manis berbiji besar' },
    { name: 'Pepaya', color: 'Jingga manis', emoji: '🫐', desc: 'buah manis berbiji hitam kecil' },
    { name: 'Alpukat', color: 'Hijau gurih', emoji: '🥑', desc: 'buah lezat bernutrisi' }
  ];

  fruitsList.forEach((frt) => {
    const allNames = fruitsList.map(f => f.name);
    const wrongs = allNames.filter(n => n !== frt.name);

    const { options, correctAnswerIndex } = buildQuestionOptions(frt.name, wrongs);
    bank.push({
      id: `BUAH_RECOG_${frt.name}`,
      category: 'buah',
      categoryLabel: CATEGORY_LABELS.buah,
      questionText: `Manakah gambar buah ${frt.name}?`,
      visualData: {
        type: 'fruit',
        mainEmoji: frt.emoji,
        subText: frt.name
      },
      options,
      correctAnswerIndex,
      explanation: `Ini adalah buah ${frt.name} ${frt.emoji}.`,
      speechText: `Manakah gambar buah ${frt.name}?`
    });
  });

  // 8. BENDA DI SEKITAR (20 questions)
  const objectsList = [
    { name: 'Pensil', use: 'Menulis dan menggambar di kertas', emoji: '✏️' },
    { name: 'Tas Sekolah', use: 'Menyimpan buku dan perlengkapan sekolah', emoji: '🎒' },
    { name: 'Sepatu', use: 'Pelindung kaki saat berjalan dan bersekolah', emoji: '👟' },
    { name: 'Topi', use: 'Melindungi kepala dari terik matahari', emoji: '🧢' },
    { name: 'Jam Dinding', use: 'Menunjukkan waktu', emoji: '⏰' },
    { name: 'Buku', use: 'Membaca dan mencatat pelajaran', emoji: '📚' },
    { name: 'Gunting', use: 'Memotong kertas kerajinan tangan', emoji: '✂️' },
    { name: 'Meja', use: 'Alas untuk belajar dan menulis', emoji: '🪑' },
    { name: 'Payung', use: 'Melindungi diri saat hujan', emoji: '☂️' },
    { name: 'Sikat Gigi', use: 'Membersihkan dan merawat gigi', emoji: '🪥' }
  ];

  objectsList.forEach((obj) => {
    const allNames = objectsList.map(o => o.name);
    const wrongs = allNames.filter(n => n !== obj.name);

    const { options, correctAnswerIndex } = buildQuestionOptions(obj.name, wrongs);
    bank.push({
      id: `BENDA_USE_${obj.name}`,
      category: 'benda',
      categoryLabel: CATEGORY_LABELS.benda,
      questionText: `Benda yang digunakan untuk "${obj.use}" adalah?`,
      visualData: {
        type: 'object',
        mainEmoji: obj.emoji,
        subText: obj.name
      },
      options,
      correctAnswerIndex,
      explanation: `${obj.name} digunakan untuk ${obj.use}.`,
      speechText: `Benda yang digunakan untuk ${obj.use} adalah?`
    });
  });

  // 9. BESAR DAN KECIL (20 questions)
  const sizePairs = [
    { big: 'Gajah', small: 'Semut', bigEmoji: '🐘', smallEmoji: '🐜' },
    { big: 'Rumah', small: 'Mobil Mainan', bigEmoji: '🏠', smallEmoji: '🏎️' },
    { big: 'Matahari', small: 'Bintang Kecil', bigEmoji: '☀️', smallEmoji: '⭐' },
    { big: 'Pohon', small: 'Bunga Kecil', bigEmoji: '🌳', smallEmoji: '🌸' },
    { big: 'Bus Sekolah', small: 'Sepeda Anak', bigEmoji: '🚌', smallEmoji: '🚲' },
    { big: 'Paus', small: 'Ikan Mas Kecil', bigEmoji: '🐳', smallEmoji: '🐟' },
    { big: 'Beruang', small: 'Kupu-kupu', bigEmoji: '🐻', smallEmoji: '🦋' },
    { big: 'Gunung', small: 'Batu Kecil', bigEmoji: '⛰️', smallEmoji: '🪨' },
    { big: 'Pesawat', small: 'Burung Kecil', bigEmoji: '✈️', smallEmoji: '🐦' },
    { big: 'Sapi', small: 'Kelinci', bigEmoji: '🐄', smallEmoji: '🐰' }
  ];

  sizePairs.forEach((pair, idx) => {
    // Question: Which is BIGGER?
    const { options: optBig, correctAnswerIndex: idxBig } = buildQuestionOptions(pair.big, [pair.small]);
    bank.push({
      id: `SIZE_BIG_${idx}`,
      category: 'besar_kecil',
      categoryLabel: CATEGORY_LABELS.besar_kecil,
      questionText: `Antara ${pair.big} dan ${pair.small}, manakah yang lebih BESAR?`,
      visualData: {
        type: 'comparison',
        itemA: { name: pair.big, emoji: pair.bigEmoji, size: 'large' },
        itemB: { name: pair.small, emoji: pair.smallEmoji, size: 'small' }
      },
      options: optBig,
      correctAnswerIndex: idxBig,
      explanation: `${pair.big} jauh lebih besar daripada ${pair.small}.`,
      speechText: `Antara ${pair.big} dan ${pair.small}, manakah yang lebih BESAR?`
    });

    // Question: Which is SMALLER?
    const { options: optSmall, correctAnswerIndex: idxSmall } = buildQuestionOptions(pair.small, [pair.big]);
    bank.push({
      id: `SIZE_SMALL_${idx}`,
      category: 'besar_kecil',
      categoryLabel: CATEGORY_LABELS.besar_kecil,
      questionText: `Antara ${pair.big} dan ${pair.small}, manakah yang lebih KECIL?`,
      visualData: {
        type: 'comparison',
        itemA: { name: pair.big, emoji: pair.bigEmoji, size: 'large' },
        itemB: { name: pair.small, emoji: pair.smallEmoji, size: 'small' }
      },
      options: optSmall,
      correctAnswerIndex: idxSmall,
      explanation: `${pair.small} lebih kecil daripada ${pair.big}.`,
      speechText: `Antara ${pair.big} dan ${pair.small}, manakah yang lebih KECIL?`
    });
  });

  // 10. BANYAK DAN SEDIKIT (20 questions)
  const qtyPairs = [
    { item: 'Permen', emoji: '🍬', countA: 7, countB: 2 },
    { item: 'Bintang', emoji: '⭐', countA: 8, countB: 3 },
    { item: 'Apel', emoji: '🍎', countA: 6, countB: 1 },
    { item: 'Bebek', emoji: '🦆', countA: 5, countB: 2 },
    { item: 'Balon', emoji: '🎈', countA: 9, countB: 4 },
    { item: 'Mobil', emoji: '🚗', countA: 6, countB: 3 },
    { item: 'Bunga', emoji: '🌸', countA: 10, countB: 2 },
    { item: 'Ikan', emoji: '🐟', countA: 7, countB: 3 },
    { item: 'Jeruk', emoji: '🍊', countA: 5, countB: 1 },
    { item: 'Kue', emoji: '🧁', countA: 8, countB: 4 }
  ];

  qtyPairs.forEach((pair, idx) => {
    // Which group has MORE?
    const correctMore = `Kelompok A (${pair.countA} ${pair.item})`;
    const wrongMore = `Kelompok B (${pair.countB} ${pair.item})`;

    bank.push({
      id: `QTY_MORE_${idx}`,
      category: 'banyak_sedikit',
      categoryLabel: CATEGORY_LABELS.banyak_sedikit,
      questionText: `Kelompok ${pair.item} mana yang jumlahnya lebih BANYAK?`,
      visualData: {
        type: 'comparison',
        itemA: { name: `Kelompok A (${pair.countA})`, emoji: pair.emoji, count: pair.countA },
        itemB: { name: `Kelompok B (${pair.countB})`, emoji: pair.emoji, count: pair.countB }
      },
      options: [correctMore, wrongMore],
      correctAnswerIndex: 0,
      explanation: `Kelompok A berisi ${pair.countA} ${pair.item}, lebih banyak dari ${pair.countB}.`,
      speechText: `Kelompok ${pair.item} mana yang jumlahnya lebih BANYAK?`
    });

    // Which group has LESS?
    const correctLess = `Kelompok B (${pair.countB} ${pair.item})`;
    const wrongLess = `Kelompok A (${pair.countA} ${pair.item})`;

    bank.push({
      id: `QTY_LESS_${idx}`,
      category: 'banyak_sedikit',
      categoryLabel: CATEGORY_LABELS.banyak_sedikit,
      questionText: `Kelompok ${pair.item} mana yang jumlahnya lebih SEDIKIT?`,
      visualData: {
        type: 'comparison',
        itemA: { name: `Kelompok A (${pair.countA})`, emoji: pair.emoji, count: pair.countA },
        itemB: { name: `Kelompok B (${pair.countB})`, emoji: pair.emoji, count: pair.countB }
      },
      options: [wrongLess, correctLess],
      correctAnswerIndex: 1,
      explanation: `Kelompok B berisi ${pair.countB} ${pair.item}, lebih sedikit dari ${pair.countA}.`,
      speechText: `Kelompok ${pair.item} mana yang jumlahnya lebih SEDIKIT?`
    });
  });

  return bank;
}
