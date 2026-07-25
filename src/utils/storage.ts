import { Student, ClassSession, QuizResult, QuizSettings, ActiveQuizState } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'kuis_paud_students_v1',
  CURRENT_SESSION: 'kuis_paud_current_session_v1',
  HISTORY_RESULTS: 'kuis_paud_history_results_v1',
  HISTORY_SESSIONS: 'kuis_paud_history_sessions_v1',
  SETTINGS: 'kuis_paud_settings_v1',
  ACTIVE_QUIZ: 'kuis_paud_active_quiz_v1',
};

// 20 Initial Sample Students
export const INITIAL_STUDENTS: Student[] = [
  { id: 'm-01', name: 'Murid 01', avatar: '🐱', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-02', name: 'Murid 02', avatar: '🐶', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-03', name: 'Murid 03', avatar: '🐰', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-04', name: 'Murid 04', avatar: '🐼', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-05', name: 'Murid 05', avatar: '🦁', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-06', name: 'Murid 06', avatar: '🐯', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-07', name: 'Murid 07', avatar: '🦊', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-08', name: 'Murid 08', avatar: '🐻', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-09', name: 'Murid 09', avatar: '🐨', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-10', name: 'Murid 10', avatar: '🐮', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-11', name: 'Murid 11', avatar: '🐸', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-12', name: 'Murid 12', avatar: '🐵', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-13', name: 'Murid 13', avatar: '🐷', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-14', name: 'Murid 14', avatar: '🐥', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-15', name: 'Murid 15', avatar: '🐧', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-16', name: 'Murid 16', avatar: '🦉', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-17', name: 'Murid 17', avatar: '🦄', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-18', name: 'Murid 18', avatar: '🐬', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-19', name: 'Murid 19', avatar: '🐝', isActive: true, hasPlayedCurrentSession: false },
  { id: 'm-20', name: 'Murid 20', avatar: '🦋', isActive: true, hasPlayedCurrentSession: false },
];

export const DEFAULT_SETTINGS: QuizSettings = {
  questionsPerStudent: 10,
  enabledCategories: [
    'angka',
    'berhitung',
    'warna',
    'bentuk',
    'huruf',
    'hewan',
    'buah',
    'benda',
    'besar_kecil',
    'banyak_sedikit',
  ],
  soundEnabled: true,
  ttsEnabled: true,
  allowSecondAttempt: true,
  quizTitle: 'Kuis Ceria PAUD',
  teacherPin: '1234',
  playMode: 'individu',
  autoFullscreen: false,
  teacherAssistanceEnabled: true,
  autoReadQuestion: true,
};

export const INITIAL_SESSION_ID = 'SESI-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-01';

// Helper to safely access localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving key ${key} to localStorage:`, e);
  }
}

export class StorageService {
  // Get all students
  static getStudents(): Student[] {
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
    if (!students || students.length === 0) {
      setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return students;
  }

  // Save student array
  static saveStudents(students: Student[]): void {
    setItem(STORAGE_KEYS.STUDENTS, students);
  }

  // Get current active session
  static getCurrentSession(): ClassSession {
    const session = getItem<ClassSession | null>(STORAGE_KEYS.CURRENT_SESSION, null);
    if (!session) {
      const newSession: ClassSession = {
        sessionId: INITIAL_SESSION_ID,
        sessionName: `Sesi Kelas ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        createdAt: new Date().toISOString(),
        status: 'active',
        assignedQuestionsMap: {},
        usedQuestionIds: [],
      };
      setItem(STORAGE_KEYS.CURRENT_SESSION, newSession);
      return newSession;
    }
    return session;
  }

  // Update current session
  static saveCurrentSession(session: ClassSession): void {
    setItem(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  // Start new class session ("Mulai Sesi Kelas Baru")
  static startNewClassSession(): { session: ClassSession; resetStudents: Student[] } {
    const prevSession = this.getCurrentSession();
    const historySessions = this.getHistorySessions();

    // Preserve previous session in history if it had results
    if (Object.keys(prevSession.assignedQuestionsMap).length > 0) {
      if (!historySessions.some(s => s.sessionId === prevSession.sessionId)) {
        historySessions.unshift({ ...prevSession, status: 'completed' });
        setItem(STORAGE_KEYS.HISTORY_SESSIONS, historySessions);
      }
    }

    // Create brand new session ID
    const newSeq = (historySessions.length + 1).toString().padStart(2, '0');
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newSessionId = `SESI-${todayStr}-${newSeq}`;

    const newSession: ClassSession = {
      sessionId: newSessionId,
      sessionName: `Sesi Kelas ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} (${newSeq})`,
      createdAt: new Date().toISOString(),
      status: 'active',
      assignedQuestionsMap: {},
      usedQuestionIds: [],
    };

    this.saveCurrentSession(newSession);

    // Reset all students to hasPlayedCurrentSession = false
    const students = this.getStudents();
    const resetStudents = students.map(s => ({
      ...s,
      hasPlayedCurrentSession: false,
    }));
    this.saveStudents(resetStudents);

    // Clear active ongoing quiz
    this.clearActiveQuiz();

    return { session: newSession, resetStudents };
  }

  // Get Settings
  static getSettings(): QuizSettings {
    const loaded = getItem<Partial<QuizSettings>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...loaded };
  }

  // Save Settings
  static saveSettings(settings: QuizSettings): void {
    setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Get History Results
  static getQuizResults(): QuizResult[] {
    const results = getItem<QuizResult[]>(STORAGE_KEYS.HISTORY_RESULTS, []);
    if (!results || results.length === 0) {
      // Create one sample completed result for "Murid 01" to populate dashboard initial view nicely
      const sampleResult: QuizResult = {
        id: 'res-sample-01',
        sessionId: INITIAL_SESSION_ID,
        sessionName: 'Sesi Kelas Awal',
        studentId: 'm-01',
        studentName: 'Murid 01',
        studentAvatar: '🐱',
        score: 90,
        totalQuestions: 10,
        correctCount: 9,
        durationSeconds: 145,
        date: new Date().toISOString(),
        answersDetails: [
          { questionId: 'ANGKA_RECOG_1', questionText: 'Manakah angka 1?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'HITUNG_COUNT_apel_5', questionText: 'Ada berapa apel pada gambar di bawah?', chosenIndex: 1, correctIndex: 1, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'WARNA_RECOG_0', questionText: 'Warna apakah ini?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'BENTUK_RECOG_lingkaran', questionText: 'Bentuk apakah ini?', chosenIndex: 2, correctIndex: 2, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'HURUF_FIRST_A', questionText: 'Huruf awal dari kata "Apel" adalah?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'HEWAN_RECOG_Kucing', questionText: 'Manakah hewan Kucing?', chosenIndex: 1, correctIndex: 1, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'BUAH_RECOG_Apel', questionText: 'Manakah gambar buah Apel?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'BENDA_USE_Pensil', questionText: 'Benda yang digunakan untuk menulis adalah?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'SIZE_BIG_0', questionText: 'Antara Gajah dan Semut, manakah yang lebih BESAR?', chosenIndex: 0, correctIndex: 0, isCorrect: true, attemptsUsed: 1, pointsEarned: 10 },
          { questionId: 'QTY_MORE_0', questionText: 'Kelompok mana yang lebih BANYAK?', chosenIndex: 1, correctIndex: 0, isCorrect: false, attemptsUsed: 2, pointsEarned: 0 },
        ]
      };
      // Mark Murid 01 as played initially
      const students = this.getStudents();
      const updated = students.map(s => s.id === 'm-01' ? {
        ...s,
        hasPlayedCurrentSession: true,
        latestScore: 90,
        latestDate: sampleResult.date,
        latestSessionId: INITIAL_SESSION_ID
      } : s);
      this.saveStudents(updated);
      setItem(STORAGE_KEYS.HISTORY_RESULTS, [sampleResult]);
      return [sampleResult];
    }
    return results;
  }

  // Save a completed quiz result
  static saveQuizResult(result: QuizResult): void {
    const results = this.getQuizResults();
    // Remove old result for same student & session if any duplicate
    const filtered = results.filter(r => !(r.studentId === result.studentId && r.sessionId === result.sessionId));
    filtered.unshift(result);
    setItem(STORAGE_KEYS.HISTORY_RESULTS, filtered);

    // Update student's status
    const students = this.getStudents();
    const updated = students.map(s => {
      if (s.id === result.studentId) {
        return {
          ...s,
          hasPlayedCurrentSession: true,
          latestScore: result.score,
          latestDate: result.date,
          latestSessionId: result.sessionId,
        };
      }
      return s;
    });
    this.saveStudents(updated);

    // Clear active quiz state since completed
    this.clearActiveQuiz();
  }

  // History Sessions
  static getHistorySessions(): ClassSession[] {
    return getItem<ClassSession[]>(STORAGE_KEYS.HISTORY_SESSIONS, []);
  }

  // Active Quiz State (Interrupted quiz resumption)
  static getActiveQuiz(): ActiveQuizState | null {
    return getItem<ActiveQuizState | null>(STORAGE_KEYS.ACTIVE_QUIZ, null);
  }

  static saveActiveQuiz(state: ActiveQuizState): void {
    setItem(STORAGE_KEYS.ACTIVE_QUIZ, state);
  }

  static clearActiveQuiz(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_QUIZ);
    }
  }

  // Factory Reset
  static resetToDefaultData(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.saveStudents(INITIAL_STUDENTS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.getCurrentSession();
    this.getQuizResults();
  }

  // Reset a single student's playing status in current session
  static resetStudentPlayingStatus(studentId: string): void {
    const students = this.getStudents();
    const updated = students.map(s => s.id === studentId ? { ...s, hasPlayedCurrentSession: false } : s);
    this.saveStudents(updated);

    // Remove from assignedQuestionsMap in current session if needed
    const session = this.getCurrentSession();
    if (session.assignedQuestionsMap[studentId]) {
      delete session.assignedQuestionsMap[studentId];
      this.saveCurrentSession(session);
    }
  }

  // CSV Export helper
  static exportResultsCSV(results: QuizResult[]): void {
    if (typeof window === 'undefined') return;

    const headers = ['Session ID', 'Student ID', 'Student Name', 'Score', 'Correct', 'Total', 'Duration (sec)', 'Date'];
    const rows = results.map(r => [
      `"${r.sessionId}"`,
      `"${r.studentId}"`,
      `"${r.studentName}"`,
      r.score,
      r.correctCount,
      r.totalQuestions,
      r.durationSeconds,
      `"${new Date(r.date).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hasil_Kuis_PAUD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
