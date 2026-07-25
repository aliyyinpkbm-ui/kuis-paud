import React, { useState, useRef } from 'react';
import { Search, Play, RotateCcw, ArrowLeft, CheckCircle2, ChevronUp, ChevronDown, Users, User } from 'lucide-react';
import { Student, QuizSettings } from '../types';

interface StudentSelectProps {
  students: Student[];
  settings: QuizSettings;
  onSelectStudent: (student: Student) => void;
  onStartClassroomPlay?: () => void;
  onResetStudentStatus: (studentId: string) => void;
  onBackToHome: () => void;
}

export const StudentSelect: React.FC<StudentSelectProps> = ({
  students,
  settings,
  onSelectStudent,
  onStartClassroomPlay,
  onResetStudentStatus,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompletedStudent, setSelectedCompletedStudent] = useState<Student | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const activeStudents = students.filter(s => s.isActive);
  const filteredStudents = activeStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScrollUp = () => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollBy({ top: -300, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollBy({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-75px)] bg-amber-50/60 p-4 sm:p-6 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Top Bar Navigation & Title */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3 bg-white p-4 rounded-3xl border-2 border-amber-200/80 shadow-xs">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-base shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft size={22} />
          <span>Kembali</span>
        </button>

        <div className="text-center sm:text-left flex-1 px-2">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            {settings.playMode === 'bersama' ? 'Mode Kelas (Bersama)' : 'Pilih Namamu'}
          </h2>
          <p className="text-sm sm:text-base font-bold text-amber-700/90">
            {settings.playMode === 'bersama'
              ? 'Seluruh murid menjawab kuis bersama di layar IFP'
              : 'Sentuh nama dan avatarmu untuk mulai pengerjaan'}
          </p>
        </div>

        {/* Mode Bersama Quick Launch Button if enabled */}
        {onStartClassroomPlay && (
          <button
            onClick={onStartClassroomPlay}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <Users size={22} />
            <span>Kuis Satu Kelas (Bersama)</span>
          </button>
        )}
      </div>

      {/* Search Input & IFP Scroll Buttons Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nama murid di sini..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-amber-300 rounded-2xl text-base sm:text-lg font-bold text-amber-950 placeholder-amber-400 focus:outline-none focus:border-amber-500 shadow-2xs"
          />
        </div>

        {/* Big Touch Navigation Up/Down Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScrollUp}
            className="p-3.5 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-100 active:scale-95 transition-all shadow-xs"
            title="Gulir Ke Atas"
          >
            <ChevronUp size={28} />
          </button>
          <button
            onClick={handleScrollDown}
            className="p-3.5 rounded-2xl bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-100 active:scale-95 transition-all shadow-xs"
            title="Gulir Ke Bawah"
          >
            <ChevronDown size={28} />
          </button>
        </div>
      </div>

      {/* Touch Student Grid */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-y-auto pr-1 scroll-smooth max-h-[calc(100vh-280px)]"
      >
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-4 border-dashed border-amber-200 text-amber-800 mt-6 max-w-md mx-auto">
            <p className="font-black text-lg">Tidak ada nama murid yang cocok.</p>
            <p className="text-sm font-semibold text-amber-600 mt-1">
              Coba kata kunci pencarian lain atau tambahkan murid di Mode Guru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredStudents.map(student => {
              const hasPlayed = student.hasPlayedCurrentSession;

              return (
                <div
                  key={student.id}
                  onClick={() => {
                    if (hasPlayed) {
                      setSelectedCompletedStudent(student);
                    } else {
                      onSelectStudent(student);
                    }
                  }}
                  className={`relative min-h-[170px] flex flex-col items-center justify-between p-4 rounded-3xl border-3 transition-all cursor-pointer shadow-sm active:scale-95 touch-none ${
                    hasPlayed
                      ? 'bg-blue-50 border-blue-300 text-slate-800 opacity-90'
                      : 'bg-white border-amber-200 text-amber-950 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="w-full flex justify-end mb-1">
                    {hasPlayed ? (
                      <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-2xs">
                        <CheckCircle2 size={12} />
                        <span>Sudah Bermain</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-2xs">
                        <Play size={12} className="fill-white" />
                        <span>Belum Bermain</span>
                      </span>
                    )}
                  </div>

                  {/* Avatar Icon */}
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-inner my-1 ${
                      hasPlayed ? 'bg-blue-100' : 'bg-amber-100'
                    }`}
                  >
                    {student.avatar || '🐱'}
                  </div>

                  {/* Student Name */}
                  <span className="font-black text-base sm:text-lg text-center line-clamp-1 mt-1">
                    {student.name}
                  </span>

                  {/* Latest Score if played */}
                  {hasPlayed && student.latestScore !== undefined && (
                    <span className="text-xs font-black text-blue-800 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 mt-1">
                      Nilai: {student.latestScore}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Student Notice Modal */}
      {selectedCompletedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-blue-300 text-center relative space-y-4">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              🌟
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedCompletedStudent.name}
              </h3>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Sudah menyelesaikan kuis pada sesi kelas ini.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 text-sm font-black text-blue-900">
              Nilai Terakhir: {selectedCompletedStudent.latestScore ?? 100} / 100
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onResetStudentStatus(selectedCompletedStudent.id);
                  onSelectStudent(selectedCompletedStudent);
                  setSelectedCompletedStudent(null);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 text-white font-black text-sm shadow-md hover:bg-amber-600 flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw size={18} />
                <span>Reset & Mainkan Lagi</span>
              </button>

              <button
                onClick={() => setSelectedCompletedStudent(null)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 font-extrabold text-sm text-slate-700 hover:bg-slate-200 active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
