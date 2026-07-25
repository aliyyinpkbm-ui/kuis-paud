import React, { useState, useEffect, useRef } from 'react';
import { Volume2, LogOut, Sparkles, Star, HelpCircle, ArrowRight, RotateCcw, User, UserCheck } from 'lucide-react';
import { Question, QuizSettings, AnswerDetail, ActiveQuizState } from '../types';
import { VisualQuestionCard } from './VisualQuestionCard';
import { soundEngine, speakText } from '../utils/audio';
import { requestScreenWakeLock, releaseScreenWakeLock, handleVisibilityWakeLock } from '../utils/wakeLock';
import { TeacherAssistanceModal } from './teacher/TeacherAssistanceModal';

interface QuizRunnerProps {
  studentName: string;
  studentAvatar: string;
  assignedQuestions: Question[];
  settings: QuizSettings;
  activeQuizState: ActiveQuizState | null;
  onSaveProgress: (state: ActiveQuizState) => void;
  onCompleteQuiz: (
    score: number,
    correctCount: number,
    answersDetails: AnswerDetail[],
    durationSeconds: number
  ) => void;
  onExitQuiz: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  studentName,
  studentAvatar,
  assignedQuestions,
  settings,
  activeQuizState,
  onSaveProgress,
  onCompleteQuiz,
  onExitQuiz,
}) => {
  // Restore from active state or start fresh
  const [currentIndex, setCurrentIndex] = useState(activeQuizState?.currentIndex || 0);
  const [score, setScore] = useState(activeQuizState?.score || 0);
  const [correctCount, setCorrectCount] = useState(activeQuizState?.correctCount || 0);
  const [answersDetails, setAnswersDetails] = useState<AnswerDetail[]>(
    activeQuizState?.answersDetails || []
  );
  const [attemptsRemaining, setAttemptsRemaining] = useState(
    activeQuizState?.attemptsRemaining || (settings.allowSecondAttempt ? 2 : 1)
  );

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'wrong_retry' | 'wrong_done' | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTeacherAssistance, setShowTeacherAssistance] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [clickLocked, setClickLocked] = useState(false);
  const [startTime] = useState(activeQuizState?.startTime || Date.now());

  const currentQuestion = assignedQuestions[currentIndex];

  // Screen Wake Lock Effect
  useEffect(() => {
    requestScreenWakeLock();
    const cleanupVisibility = handleVisibilityWakeLock(true);
    return () => {
      releaseScreenWakeLock();
      cleanupVisibility();
    };
  }, []);

  // Auto speak text on question change if autoReadQuestion or ttsEnabled
  useEffect(() => {
    if (currentQuestion && settings.ttsEnabled && (settings.autoReadQuestion ?? true) && !isPaused) {
      speakText(currentQuestion.speechText || currentQuestion.questionText, settings.ttsEnabled);
    }
  }, [currentIndex, currentQuestion, settings.ttsEnabled, settings.autoReadQuestion, isPaused]);

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl max-w-md mx-auto my-12 border-4 border-amber-300 shadow-xl">
        <p className="font-black text-amber-950 text-xl">Menyiapkan soal kuis...</p>
      </div>
    );
  }

  const totalQuestions = assignedQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Handle Option Click with Tap Lock
  const handleSelectOption = (index: number) => {
    if (feedbackStatus === 'correct' || feedbackStatus === 'wrong_done' || clickLocked || isPaused) {
      return; // Prevent accidental double tapping
    }

    setClickLocked(true);
    setSelectedOptionIndex(index);
    const isCorrect = index === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      // Correct Answer!
      soundEngine.playSuccessSound(settings.soundEnabled);
      soundEngine.playStarSound(settings.soundEnabled);
      setFeedbackStatus('correct');

      const points = 10;
      const newScore = score + points;
      const newCorrect = correctCount + 1;
      const attemptsUsed = (settings.allowSecondAttempt ? 2 : 1) - attemptsRemaining + 1;

      const newDetail: AnswerDetail = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText,
        chosenIndex: index,
        correctIndex: currentQuestion.correctAnswerIndex,
        isCorrect: true,
        attemptsUsed,
        pointsEarned: points,
      };

      const updatedAnswers = [...answersDetails, newDetail];
      setScore(newScore);
      setCorrectCount(newCorrect);
      setAnswersDetails(updatedAnswers);

      // Save state to localStorage for refresh safety
      onSaveProgress({
        studentId: activeQuizState?.studentId || '',
        studentName,
        studentAvatar,
        sessionId: activeQuizState?.sessionId || '',
        assignedQuestionIds: assignedQuestions.map(q => q.id),
        currentIndex,
        score: newScore,
        correctCount: newCorrect,
        answersDetails: updatedAnswers,
        attemptsRemaining: 2,
        startTime,
        isFinished: false,
      });

      // Auto advance after 1.4s
      setTimeout(() => {
        advanceToNextQuestion(newScore, newCorrect, updatedAnswers);
      }, 1400);
    } else {
      // Incorrect Answer!
      soundEngine.playRetrySound(settings.soundEnabled);

      if (settings.allowSecondAttempt && attemptsRemaining > 1) {
        // Can retry!
        setFeedbackStatus('wrong_retry');
        setAttemptsRemaining(1);
        setTimeout(() => setClickLocked(false), 600);
      } else {
        // Out of attempts
        setFeedbackStatus('wrong_done');

        const newDetail: AnswerDetail = {
          questionId: currentQuestion.id,
          questionText: currentQuestion.questionText,
          chosenIndex: index,
          correctIndex: currentQuestion.correctAnswerIndex,
          isCorrect: false,
          attemptsUsed: settings.allowSecondAttempt ? 2 : 1,
          pointsEarned: 0,
        };

        const updatedAnswers = [...answersDetails, newDetail];
        setAnswersDetails(updatedAnswers);

        // Auto advance after showing correct answer
        setTimeout(() => {
          advanceToNextQuestion(score, correctCount, updatedAnswers);
        }, 1800);
      }
    }
  };

  const advanceToNextQuestion = (
    currentScore: number,
    currentCorrect: number,
    details: AnswerDetail[]
  ) => {
    setFeedbackStatus(null);
    setSelectedOptionIndex(null);
    setClickLocked(false);
    setAttemptsRemaining(settings.allowSecondAttempt ? 2 : 1);

    if (currentIndex + 1 < totalQuestions) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      onSaveProgress({
        studentId: activeQuizState?.studentId || '',
        studentName,
        studentAvatar,
        sessionId: activeQuizState?.sessionId || '',
        assignedQuestionIds: assignedQuestions.map(q => q.id),
        currentIndex: nextIdx,
        score: currentScore,
        correctCount: currentCorrect,
        answersDetails: details,
        attemptsRemaining: settings.allowSecondAttempt ? 2 : 1,
        startTime,
        isFinished: false,
      });
    } else {
      // Finished Quiz!
      const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const finalScorePercent = Math.round((currentCorrect / totalQuestions) * 100);
      onCompleteQuiz(finalScorePercent, currentCorrect, details, durationSeconds);
    }
  };

  const handleSkipQuestion = () => {
    const skippedDetail: AnswerDetail = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.questionText,
      chosenIndex: -1,
      correctIndex: currentQuestion.correctAnswerIndex,
      isCorrect: false,
      attemptsUsed: 0,
      pointsEarned: 0,
    };
    const updatedAnswers = [...answersDetails, skippedDetail];
    advanceToNextQuestion(score, correctCount, updatedAnswers);
  };

  return (
    <div className="min-h-[calc(100vh-75px)] bg-amber-50/60 p-4 sm:p-6 max-w-7xl mx-auto flex flex-col justify-between relative my-auto">
      {/* Quiz Top Header Bar */}
      <div className="bg-white rounded-3xl p-4 border-3 border-amber-300 shadow-xs mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          {/* Active Student Info Badge */}
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-amber-100 p-2 rounded-2xl border border-amber-300 shadow-2xs">
              {studentAvatar || '🐱'}
            </span>
            <div>
              <p className="text-lg sm:text-xl font-black text-amber-950 leading-tight">
                {studentName}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-amber-700">
                Poin: <span className="text-emerald-700 font-black">{score}</span>
              </p>
            </div>
          </div>

          {/* Question Category & Mode Tag */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-amber-100 text-amber-950 px-4 py-1.5 rounded-2xl border-2 border-amber-300">
              {currentQuestion.categoryLabel}
            </span>
            {settings.allowSecondAttempt && (
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                Kesempatan: {attemptsRemaining}x
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Read Aloud Button */}
            <button
              onClick={() => speakText(currentQuestion.speechText || currentQuestion.questionText, true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 font-extrabold text-sm shadow-xs transition-all flex items-center gap-2 active:scale-95"
              title="Baca Soal Keras"
            >
              <Volume2 size={22} />
              <span className="hidden sm:inline">Baca Soal</span>
            </button>

            {/* Teacher Assistance Button */}
            <button
              onClick={() => setShowTeacherAssistance(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 text-white hover:bg-slate-900 font-extrabold text-sm shadow-xs transition-all flex items-center gap-2 active:scale-95"
              title="Panel Bantuan Guru"
            >
              👩‍🏫 <span className="hidden sm:inline">Bantuan Guru</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={() => setShowExitConfirm(true)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold transition-all"
              title="Keluar Kuis"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs sm:text-sm font-black text-amber-900 mb-1">
            <span>Soal {currentIndex + 1} dari {totalQuestions}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-amber-100 h-3.5 rounded-full overflow-hidden border-2 border-amber-300">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main IFP Landscape Question & Answer Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-md mb-4 items-center">
        {/* Left Side: Question Text & Visual Card (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight text-center lg:text-left">
            {currentQuestion.questionText}
          </h3>

          <div className="w-full my-auto">
            <VisualQuestionCard visualData={currentQuestion.visualData} />
          </div>
        </div>

        {/* Right Side: Large Touch Answer Options Grid (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
          <p className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider text-center lg:text-left">
            Pilih Jawaban Yang Benar (Sentuh Layar)
          </p>

          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectChoice = idx === currentQuestion.correctAnswerIndex;

              let buttonStyle =
                'bg-slate-50 border-3 border-slate-200 text-slate-900 hover:bg-amber-50 hover:border-amber-400 shadow-2xs';

              if (feedbackStatus === 'correct' && isSelected) {
                buttonStyle =
                  'bg-emerald-500 border-4 border-emerald-700 text-white shadow-xl animate-bounce';
              } else if (feedbackStatus === 'wrong_done' && isCorrectChoice) {
                buttonStyle = 'bg-emerald-500 border-4 border-emerald-700 text-white shadow-lg';
              } else if ((feedbackStatus === 'wrong_retry' || feedbackStatus === 'wrong_done') && isSelected) {
                buttonStyle = 'bg-rose-100 border-3 border-rose-400 text-rose-900 opacity-90';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={feedbackStatus === 'correct' || feedbackStatus === 'wrong_done' || clickLocked || isPaused}
                  className={`w-full min-h-[85px] sm:min-h-[100px] py-4 px-6 rounded-3xl font-black text-xl sm:text-2xl lg:text-3xl transition-all active:scale-95 flex items-center justify-center text-center touch-none select-none ${buttonStyle}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answer Feedback Banners */}
      {feedbackStatus === 'correct' && (
        <div className="bg-emerald-500 text-white rounded-3xl p-4 shadow-xl border-4 border-emerald-700 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles size={32} />
            <div>
              <p className="font-black text-xl sm:text-2xl">Hebat! Jawabanmu Benar! 🌟</p>
              <p className="text-sm font-bold opacity-90">+10 Poin</p>
            </div>
          </div>
          <Star className="fill-yellow-300 text-yellow-300" size={36} />
        </div>
      )}

      {feedbackStatus === 'wrong_retry' && (
        <div className="bg-amber-100 text-amber-950 rounded-3xl p-4 shadow-md border-3 border-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw size={28} className="text-amber-700" />
            <div>
              <p className="font-black text-lg sm:text-xl">Ayo Coba Lagi 😊</p>
              <p className="text-sm font-extrabold text-amber-800">Kamu punya 1 kesempatan lagi!</p>
            </div>
          </div>
        </div>
      )}

      {feedbackStatus === 'wrong_done' && (
        <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-md border-3 border-slate-950 flex items-center justify-between">
          <div>
            <p className="font-black text-sm text-slate-400">Jawaban yang benar adalah:</p>
            <p className="text-xl font-black text-amber-300">
              {currentQuestion.options[currentQuestion.correctAnswerIndex]}
            </p>
          </div>
          <ArrowRight size={28} />
        </div>
      )}

      {/* Teacher Assistance Modal Overlay */}
      {showTeacherAssistance && (
        <TeacherAssistanceModal
          onClose={() => setShowTeacherAssistance(false)}
          onRepeatAudio={() =>
            speakText(currentQuestion.speechText || currentQuestion.questionText, true)
          }
          onTogglePause={() => setIsPaused(!isPaused)}
          isPaused={isPaused}
          onSkipQuestion={handleSkipQuestion}
          onShowAnswer={() => {
            setFeedbackStatus('wrong_done');
          }}
          onCancelQuiz={onExitQuiz}
          onReturnToStudentSelect={onExitQuiz}
        />
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-amber-300 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
              <HelpCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Kembali ke Menu Utama?</h3>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Kemajuan pengerjaan kuis murid akan tersimpan otomatis.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 font-extrabold text-sm text-slate-700 hover:bg-slate-200 active:scale-95"
              >
                Lanjutkan
              </button>
              <button
                type="button"
                onClick={onExitQuiz}
                className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-black text-sm shadow-md hover:bg-rose-700 active:scale-95"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
