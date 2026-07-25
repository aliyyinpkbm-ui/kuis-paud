import { Question, QuestionCategory } from '../types';

// Simple PRNG string hasher (seeded random number generator)
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Pseudo-random number generator given a seed number
function createSeededPRNG(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export interface QuizAssignmentParams {
  studentId: string;
  sessionId: string;
  questionBank: Question[];
  enabledCategories: QuestionCategory[];
  questionsPerStudent: number;
  usedQuestionIdsMap: Record<string, string[]>; // studentId -> questionIds[]
}

export interface QuizAssignmentResult {
  assignedQuestions: Question[];
  assignedQuestionIds: string[];
  isUniquePackage: boolean;
  usedQuestionCountInSession: number;
  totalAvailableBankCount: number;
}

/**
 * Assigns a unique, deterministic set of questions for a student in a specific session.
 */
export function assignQuestionsForStudent({
  studentId,
  sessionId,
  questionBank,
  enabledCategories,
  questionsPerStudent = 10,
  usedQuestionIdsMap,
}: QuizAssignmentParams): QuizAssignmentResult {
  // Filter questions by active categories
  const eligibleQuestions = questionBank.filter(q => enabledCategories.includes(q.category));

  // If already assigned in this session, return exact stored assignment
  if (usedQuestionIdsMap[studentId] && usedQuestionIdsMap[studentId].length > 0) {
    const existingIds = usedQuestionIdsMap[studentId];
    const existingQuestions = existingIds
      .map(id => eligibleQuestions.find(q => q.id === id) || questionBank.find(q => q.id === id))
      .filter((q): q is Question => Boolean(q));

    return {
      assignedQuestions: existingQuestions,
      assignedQuestionIds: existingIds,
      isUniquePackage: true,
      usedQuestionCountInSession: Object.values(usedQuestionIdsMap).flat().length,
      totalAvailableBankCount: eligibleQuestions.length,
    };
  }

  // Gather all question IDs currently assigned to OTHER students in this session
  const otherStudentsUsedIds = new Set<string>();
  Object.entries(usedQuestionIdsMap).forEach(([sId, ids]) => {
    if (sId !== studentId) {
      ids.forEach(id => otherStudentsUsedIds.add(id));
    }
  });

  // Seed generator with studentId + sessionId
  const seed = simpleHash(`${sessionId}_${studentId}`);
  const rng = createSeededPRNG(seed);

  // Pool A: Unused questions in this session
  const unusedQuestions = eligibleQuestions.filter(q => !otherStudentsUsedIds.has(q.id));

  // Shuffle candidate pools deterministically using seed
  const shuffleWithSeed = <T>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffledUnused = shuffleWithSeed(unusedQuestions);
  
  let selectedQuestions: Question[] = [];

  if (shuffledUnused.length >= questionsPerStudent) {
    // We have enough unused questions to give 100% unique items!
    selectedQuestions = shuffledUnused.slice(0, questionsPerStudent);
  } else {
    // Take all remaining unused first
    selectedQuestions = [...shuffledUnused];

    // Top up from previously used pool, but shuffled deterministically
    const usedQuestions = eligibleQuestions.filter(q => otherStudentsUsedIds.has(q.id));
    const shuffledUsed = shuffleWithSeed(usedQuestions);

    const needed = questionsPerStudent - selectedQuestions.length;
    selectedQuestions.push(...shuffledUsed.slice(0, needed));
  }

  const assignedQuestionIds = selectedQuestions.map(q => q.id);

  return {
    assignedQuestions: selectedQuestions,
    assignedQuestionIds,
    isUniquePackage: true,
    usedQuestionCountInSession: otherStudentsUsedIds.size + assignedQuestionIds.length,
    totalAvailableBankCount: eligibleQuestions.length,
  };
}

/**
 * Checks if question bank has enough capacity for a class of active students
 */
export function checkQuestionBankCapacity(
  activeStudentCount: number,
  questionsPerStudent: number,
  questionBank: Question[],
  enabledCategories: QuestionCategory[]
): {
  isSufficient: boolean;
  totalRequired: number;
  totalAvailable: number;
  remainingMargin: number;
  message: string;
} {
  const totalAvailable = questionBank.filter(q => enabledCategories.includes(q.category)).length;
  const totalRequired = activeStudentCount * questionsPerStudent;
  const remainingMargin = totalAvailable - totalRequired;

  const isSufficient = totalAvailable >= totalRequired;

  let message = '';
  if (isSufficient) {
    message = `Bank soal mencukupi! Tersedia ${totalAvailable} soal untuk ${activeStudentCount} murid (${totalRequired} soal dibutuhkan).`;
  } else {
    message = `Peringatan: Bank soal terbatas! Tersedia ${totalAvailable} soal untuk ${activeStudentCount} murid (${totalRequired} dibutuhkan). Soal mungkin akan diulang sebagian.`;
  }

  return {
    isSufficient,
    totalRequired,
    totalAvailable,
    remainingMargin,
    message,
  };
}
