import React, { useState } from 'react';
import { LayoutDashboard, Users, History, Settings, LogOut } from 'lucide-react';
import { Student, ClassSession, QuizResult, QuizSettings, Question } from '../../types';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentManagement } from './StudentManagement';
import { QuizHistoryView } from './QuizHistoryView';
import { TeacherSettings } from './TeacherSettings';

interface TeacherModeContainerProps {
  students: Student[];
  currentSession: ClassSession;
  historySessions: ClassSession[];
  results: QuizResult[];
  settings: QuizSettings;
  questionBank: Question[];
  onStartNewSession: () => void;
  onSaveStudents: (updated: Student[]) => void;
  onResetStudent: (studentId: string) => void;
  onResetAllStatus: () => void;
  onSaveSettings: (updated: QuizSettings) => void;
  onFactoryReset: () => void;
  onExitTeacherMode: () => void;
  onRefreshData: () => void;
}

export const TeacherModeContainer: React.FC<TeacherModeContainerProps> = ({
  students,
  currentSession,
  historySessions,
  results,
  settings,
  questionBank,
  onStartNewSession,
  onSaveStudents,
  onResetStudent,
  onResetAllStatus,
  onSaveSettings,
  onFactoryReset,
  onExitTeacherMode,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'history' | 'settings'>(
    'dashboard'
  );

  const activeStudentCount = students.filter(s => s.isActive).length;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50/80 p-3 sm:p-4 max-w-2xl mx-auto flex flex-col justify-between">
      {/* Sub Navigation Bar */}
      <div className="bg-white rounded-2xl p-1.5 border-2 border-slate-200/80 shadow-2xs mb-4 flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={16} />
          <span>Data Murid</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History size={16} />
          <span>Riwayat</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={16} />
          <span>Pengaturan</span>
        </button>
      </div>

      {/* Main Tab View Content */}
      <div className="flex-1">
        {activeTab === 'dashboard' && (
          <TeacherDashboard
            students={students}
            currentSession={currentSession}
            results={results}
            questionBank={questionBank}
            onStartNewSession={onStartNewSession}
            onResetStudent={onResetStudent}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            onSaveStudents={onSaveStudents}
            onResetAllStatus={onResetAllStatus}
          />
        )}

        {activeTab === 'history' && (
          <QuizHistoryView historySessions={historySessions} results={results} />
        )}

        {activeTab === 'settings' && (
          <TeacherSettings
            settings={settings}
            questionBank={questionBank}
            activeStudentCount={activeStudentCount}
            onSaveSettings={onSaveSettings}
            onFactoryReset={onFactoryReset}
          />
        )}
      </div>

      {/* Bottom Exit Bar */}
      <div className="mt-6 pt-3 border-t border-slate-200 text-center">
        <button
          onClick={onExitTeacherMode}
          className="px-5 py-2.5 bg-slate-800 text-white font-black text-xs rounded-2xl shadow-xs hover:bg-slate-900 inline-flex items-center gap-1.5"
        >
          <LogOut size={16} />
          <span>Kembali ke Mode Murid</span>
        </button>
      </div>
    </div>
  );
};
