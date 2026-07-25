export type QuestionCategory =
  | 'angka'
  | 'berhitung'
  | 'warna'
  | 'bentuk'
  | 'huruf'
  | 'hewan'
  | 'buah'
  | 'benda'
  | 'besar_kecil'
  | 'banyak_sedikit';

export interface QuestionVisualData {
  type: 'count' | 'color_shape' | 'letter' | 'animal' | 'fruit' | 'object' | 'comparison' | 'text';
  // Count visual
  count?: number;
  itemEmoji?: string;
  itemShape?: string;
  itemColor?: string;
  itemName?: string;
  
  // Color shape visual
  shape?: 'lingkaran' | 'persegi' | 'segitiga' | 'bintang' | 'hati' | 'oval' | 'persegi_panjang';
  colorHex?: string;
  colorName?: string;
  
  // Letter visual
  letter?: string;
  word?: string;
  wordHighlightIndex?: number;
  wordEmoji?: string;

  // Comparison visual
  itemA?: { name: string; emoji?: string; count?: number; size?: 'small' | 'large'; color?: string };
  itemB?: { name: string; emoji?: string; count?: number; size?: 'small' | 'large'; color?: string };

  // General image / emoji
  mainEmoji?: string;
  subText?: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  questionText: string;
  visualData: QuestionVisualData;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  speechText: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string; // Emoji or SVG avatar identifier
  isActive: boolean;
  hasPlayedCurrentSession: boolean;
  latestScore?: number;
  latestDate?: string;
  latestSessionId?: string;
}

export interface AnswerDetail {
  questionId: string;
  questionText: string;
  chosenIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  attemptsUsed: number;
  pointsEarned: number;
}

export interface QuizResult {
  id: string;
  sessionId: string;
  sessionName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  date: string;
  answersDetails: AnswerDetail[];
}

export interface ClassSession {
  sessionId: string;
  sessionName: string;
  createdAt: string;
  status: 'active' | 'completed';
  assignedQuestionsMap: Record<string, string[]>; // studentId -> questionIds[]
  usedQuestionIds: string[];
}

export interface QuizSettings {
  questionsPerStudent: number; // Default 10
  enabledCategories: QuestionCategory[];
  soundEnabled: boolean;
  ttsEnabled: boolean;
  allowSecondAttempt: boolean;
  quizTitle: string;
  teacherPin: string; // Default '1234'
  playMode: 'individu' | 'bersama'; // Default 'individu'
  autoFullscreen: boolean; // Default false
  teacherAssistanceEnabled: boolean; // Default true
  autoReadQuestion: boolean; // Default true
}

export interface ActiveQuizState {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  sessionId: string;
  assignedQuestionIds: string[];
  currentIndex: number;
  score: number;
  correctCount: number;
  answersDetails: AnswerDetail[];
  attemptsRemaining: number;
  startTime: number;
  isFinished: boolean;
}
