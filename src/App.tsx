import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { StudentSelect } from './components/StudentSelect';
import { QuizRunner } from './components/QuizRunner';
import { QuizResultView } from './components/QuizResultView';
import { TeacherModeContainer } from './components/teacher/TeacherModeContainer';

import {
  Student,
  ClassSession,
  QuizResult,
  QuizSettings,
  Question,
  AnswerDetail,
  ActiveQuizState,
} from './types';
import { StorageService } from './utils/storage';
import { generateQuestionBank } from './data/questionBank';
import { assignQuestionsForStudent } from './utils/quizAssigner';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentSession, setCurrentSession] = useState<ClassSession | null>(null);
  const [historySessions, setHistorySessions] = useState<ClassSession[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [settings, setSettings] = useState<QuizSettings>(StorageService.getSettings());

  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [currentView, setCurrentView] = useState<
    'home' | 'student_select' | 'quiz' | 'result' | 'teacher'
  >('home');

  // Active playing state
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [activeQuizState, setActiveQuizState] = useState<ActiveQuizState | null>(null);

  // Completed result state
  const [lastCompletedResult, setLastCompletedResult] = useState<{
    studentName: string;
    studentAvatar: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    durationSeconds: number;
  } | null>(null);

  const [hasError, setHasError] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    try {
      const bank = generateQuestionBank();
      setQuestionBank(bank);

      const loadedStudents = StorageService.getStudents();
      setStudents(loadedStudents);

      const session = StorageService.getCurrentSession();
      setCurrentSession(session);

      const histSessions = StorageService.getHistorySessions();
      setHistorySessions(histSessions);

      const loadedResults = StorageService.getQuizResults();
      setResults(loadedResults);

      const loadedSettings = StorageService.getSettings();
      setSettings(loadedSettings);

      // Check for unfinished active quiz to restore
      const activeState = StorageService.getActiveQuiz();
      if (activeState && !activeState.isFinished) {
        const student = loadedStudents.find(s => s.id === activeState.studentId);
        if (student) {
          setActiveStudent(student);
          setActiveQuizState(activeState);

          // Restore assigned questions
          const questions = activeState.assignedQuestionIds
            .map(id => bank.find(q => q.id === id))
            .filter((q): q is Question => Boolean(q));

          if (questions.length > 0) {
            setAssignedQuestions(questions);
            setCurrentView('quiz');
          }
        }
      }
    } catch (err) {
      console.error('Failed to initialize app data:', err);
      setHasError(true);
    }
  }, []);

  const refreshAppData = () => {
    setStudents(StorageService.getStudents());
    setCurrentSession(StorageService.getCurrentSession());
    setHistorySessions(StorageService.getHistorySessions());
    setResults(StorageService.getQuizResults());
    setSettings(StorageService.getSettings());
  };

  // Toggle Sound FX
  const handleToggleSound = () => {
    const updated: QuizSettings = {
      ...settings,
      soundEnabled: !settings.soundEnabled,
    };
    StorageService.saveSettings(updated);
    setSettings(updated);
  };

  // Enter Teacher Mode with PIN
  const handleEnterTeacherMode = (pinInput: string): boolean => {
    if (pinInput === settings.teacherPin) {
      setIsTeacherMode(true);
      setCurrentView('teacher');
      return true;
    }
    return false;
  };

  // Exit Teacher Mode
  const handleExitTeacherMode = () => {
    setIsTeacherMode(false);
    setCurrentView('home');
  };

  // Start Quiz for a Selected Student
  const handleSelectStudentToPlay = (student: Student) => {
    if (!currentSession) return;

    setActiveStudent(student);

    // Run Unique Quiz Assignment Engine
    const assignment = assignQuestionsForStudent({
      studentId: student.id,
      sessionId: currentSession.sessionId,
      questionBank,
      enabledCategories: settings.enabledCategories,
      questionsPerStudent: settings.questionsPerStudent,
      usedQuestionIdsMap: currentSession.assignedQuestionsMap,
    });

    setAssignedQuestions(assignment.assignedQuestions);

    // Save student assignment to current session tracking
    const updatedMap = {
      ...currentSession.assignedQuestionsMap,
      [student.id]: assignment.assignedQuestionIds,
    };

    const updatedUsedIds = Array.from(
      new Set([...currentSession.usedQuestionIds, ...assignment.assignedQuestionIds])
    );

    const updatedSession: ClassSession = {
      ...currentSession,
      assignedQuestionsMap: updatedMap,
      usedQuestionIds: updatedUsedIds,
    };

    StorageService.saveCurrentSession(updatedSession);
    setCurrentSession(updatedSession);

    // Initialize or restore active quiz state
    const initialState: ActiveQuizState = {
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      sessionId: currentSession.sessionId,
      assignedQuestionIds: assignment.assignedQuestionIds,
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      answersDetails: [],
      attemptsRemaining: settings.allowSecondAttempt ? 2 : 1,
      startTime: Date.now(),
      isFinished: false,
    };

    StorageService.saveActiveQuiz(initialState);
    setActiveQuizState(initialState);
    setCurrentView('quiz');
  };

  // Save Quiz Progress in real-time
  const handleSaveProgress = (state: ActiveQuizState) => {
    setActiveQuizState(state);
    StorageService.saveActiveQuiz(state);
  };

  // Complete Quiz Execution
  const handleCompleteQuiz = (
    finalScore: number,
    correctCount: number,
    answersDetails: AnswerDetail[],
    durationSeconds: number
  ) => {
    if (!activeStudent || !currentSession) return;

    const quizResult: QuizResult = {
      id: `res-${Date.now()}`,
      sessionId: currentSession.sessionId,
      sessionName: currentSession.sessionName,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      studentAvatar: activeStudent.avatar,
      score: finalScore,
      totalQuestions: assignedQuestions.length,
      correctCount,
      durationSeconds,
      date: new Date().toISOString(),
      answersDetails,
    };

    StorageService.saveQuizResult(quizResult);

    setLastCompletedResult({
      studentName: activeStudent.name,
      studentAvatar: activeStudent.avatar,
      score: finalScore,
      correctCount,
      totalQuestions: assignedQuestions.length,
      durationSeconds,
    });

    refreshAppData();
    setCurrentView('result');
  };

  // Exit Active Quiz safely
  const handleExitQuiz = () => {
    setCurrentView('student_select');
  };

  // Start New Class Session ("Mulai Sesi Kelas Baru")
  const handleStartNewClassSession = () => {
    const { session, resetStudents } = StorageService.startNewClassSession();
    setCurrentSession(session);
    setStudents(resetStudents);
    setResults(StorageService.getQuizResults());
    setHistorySessions(StorageService.getHistorySessions());
  };

  // Reset Student Status
  const handleResetStudentStatus = (studentId: string) => {
    StorageService.resetStudentPlayingStatus(studentId);
    refreshAppData();
  };

  // Reset All Students Status
  const handleResetAllStatus = () => {
    if (confirm('Reset status bermain semua murid untuk sesi ini?')) {
      const updated = students.map(s => ({ ...s, hasPlayedCurrentSession: false }));
      StorageService.saveStudents(updated);
      setStudents(updated);
    }
  };

  // Save Settings
  const handleSaveSettings = (updated: QuizSettings) => {
    StorageService.saveSettings(updated);
    setSettings(updated);
  };

  // Factory Reset
  const handleFactoryReset = () => {
    StorageService.resetToDefaultData();
    refreshAppData();
    setIsTeacherMode(false);
    setCurrentView('home');
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-xs text-center border-4 border-amber-300 shadow-xl">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-2" />
          <h3 className="font-black text-lg text-slate-800 mb-1">Terjadi Kesalahan Data</h3>
          <p className="text-xs text-slate-600 mb-4">
            Aplikasi mengalami masalah saat memuat data lokal.
          </p>
          <button
            onClick={() => {
              StorageService.resetToDefaultData();
              window.location.reload();
            }}
            className="w-full py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-md"
          >
            Pulihkan Data Default
          </button>
        </div>
      </div>
    );
  }

  const completedStudentCount = students.filter(s => s.hasPlayedCurrentSession).length;
  const activeStudentCount = students.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 select-none antialiased">
      <Navbar
        currentView={currentView}
        isTeacherMode={isTeacherMode}
        settings={settings}
        activeStudentName={activeStudent?.name}
        activeStudentAvatar={activeStudent?.avatar}
        onToggleSound={handleToggleSound}
        onEnterTeacherMode={handleEnterTeacherMode}
        onExitTeacherMode={handleExitTeacherMode}
        onGoHome={() => {
          if (isTeacherMode) {
            setCurrentView('teacher');
          } else {
            setCurrentView('home');
          }
        }}
      />

      <main>
        {currentView === 'home' && (
          <StudentHome
            settings={settings}
            activeStudentCount={activeStudentCount}
            completedStudentCount={completedStudentCount}
            onStartPlay={() => setCurrentView('student_select')}
            onOpenTeacherMode={() => {
              if (isTeacherMode) {
                setCurrentView('teacher');
              } else {
                // Open teacher mode PIN via navbar trigger or prompt
                const pin = prompt('Masukkan PIN Guru (Default: 1234):');
                if (pin && handleEnterTeacherMode(pin)) {
                  // Entered successfully
                } else if (pin) {
                  alert('PIN salah!');
                }
              }
            }}
          />
        )}

        {currentView === 'student_select' && (
          <StudentSelect
            students={students}
            settings={settings}
            onSelectStudent={handleSelectStudentToPlay}
            onStartClassroomPlay={() => {
              // Mode Bersama - Play as a class
              const classroomStudent: Student = {
                id: 'std-kelas-bersama',
                name: 'Satu Kelas PAUD',
                avatar: '🏫',
                isActive: true,
                hasPlayedCurrentSession: false,
              };
              handleSelectStudentToPlay(classroomStudent);
            }}
            onResetStudentStatus={handleResetStudentStatus}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'quiz' && (
          <QuizRunner
            studentName={activeStudent?.name || 'Murid'}
            studentAvatar={activeStudent?.avatar || '🐱'}
            assignedQuestions={assignedQuestions}
            settings={settings}
            activeQuizState={activeQuizState}
            onSaveProgress={handleSaveProgress}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={handleExitQuiz}
          />
        )}

        {currentView === 'result' && lastCompletedResult && (
          <QuizResultView
            studentName={lastCompletedResult.studentName}
            studentAvatar={lastCompletedResult.studentAvatar}
            score={lastCompletedResult.score}
            correctCount={lastCompletedResult.correctCount}
            totalQuestions={lastCompletedResult.totalQuestions}
            durationSeconds={lastCompletedResult.durationSeconds}
            soundEnabled={settings.soundEnabled}
            onFinish={() => setCurrentView('student_select')}
          />
        )}

        {currentView === 'teacher' && isTeacherMode && currentSession && (
          <TeacherModeContainer
            students={students}
            currentSession={currentSession}
            historySessions={historySessions}
            results={results}
            settings={settings}
            questionBank={questionBank}
            onStartNewSession={handleStartNewClassSession}
            onSaveStudents={updated => {
              StorageService.saveStudents(updated);
              setStudents(updated);
            }}
            onResetStudent={handleResetStudentStatus}
            onResetAllStatus={handleResetAllStatus}
            onSaveSettings={handleSaveSettings}
            onFactoryReset={handleFactoryReset}
            onExitTeacherMode={handleExitTeacherMode}
            onRefreshData={refreshAppData}
          />
        )}
      </main>
    </div>
  );
}
