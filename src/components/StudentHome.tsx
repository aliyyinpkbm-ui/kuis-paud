import React, { useState, useEffect } from 'react';
import { Play, ShieldCheck, Sparkles, Star, Heart, Sun, Smile, Maximize, Minimize, Users, User } from 'lucide-react';
import { QuizSettings } from '../types';
import { isFullscreenActive, toggleFullscreen, onFullscreenChange } from '../utils/fullscreen';

interface StudentHomeProps {
  settings: QuizSettings;
  activeStudentCount: number;
  completedStudentCount: number;
  onStartPlay: () => void;
  onOpenTeacherMode: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  settings,
  activeStudentCount,
  completedStudentCount,
  onStartPlay,
  onOpenTeacherMode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsFullscreen(isFullscreenActive());
    const cleanup = onFullscreenChange(active => setIsFullscreen(active));
    return cleanup;
  }, []);

  const handleToggleFullscreen = async () => {
    await toggleFullscreen();
  };

  return (
    <div className="min-h-[calc(100vh-75px)] bg-gradient-to-b from-amber-50 via-orange-50/50 to-amber-100 flex flex-col justify-between p-6 sm:p-8 max-w-6xl mx-auto relative overflow-hidden my-auto rounded-3xl my-2 border-2 border-amber-200/50 shadow-xs">
      {/* Background Floating Decoratives */}
      <div className="absolute top-8 left-8 text-amber-300/80 animate-bounce">
        <Sun size={64} />
      </div>
      <div className="absolute top-12 right-12 text-orange-300/80 animate-pulse">
        <Star size={56} />
      </div>
      <div className="absolute bottom-12 left-12 text-rose-300/80 animate-bounce">
        <Heart size={48} />
      </div>

      {/* Main IFP Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto z-10 py-4">
        {/* Large Cheerful Preschool Hero Visual */}
        <div className="relative mb-6 cursor-pointer group" onClick={onStartPlay}>
          <div className="w-48 h-48 sm:w-60 sm:h-60 bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center p-3 shadow-2xl animate-pulse group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center p-4 relative overflow-hidden border-4 border-amber-200">
              <div className="flex items-center gap-3 text-5xl sm:text-6xl animate-bounce">
                <span>🐱</span>
                <span>🦁</span>
                <span>🐰</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-3xl sm:text-4xl">
                <span>⭐</span>
                <span>🍎</span>
                <span>🎨</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-3 -right-3 bg-rose-500 text-white px-3.5 py-1.5 rounded-2xl shadow-lg transform rotate-12 flex items-center gap-1.5 text-sm font-black">
            <Sparkles size={18} />
            <span>PAUD Ceria</span>
          </div>
          <div className="absolute -bottom-3 -left-3 bg-amber-500 text-white px-3.5 py-1.5 rounded-2xl shadow-lg transform -rotate-12 flex items-center gap-1.5 text-sm font-black">
            <Smile size={18} />
            <span>100% Offline IFP</span>
          </div>
        </div>

        {/* Large Headlines for 2-5m Viewing Distance */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-amber-950 tracking-tight leading-none mb-3">
          {settings.quizTitle || 'Kuis Ceria PAUD'}
        </h1>
        <p className="text-xl sm:text-3xl font-extrabold text-amber-700 mb-6 bg-white/80 backdrop-blur-xs px-6 py-2 rounded-full border-2 border-amber-300 shadow-2xs inline-block">
          ✨ Belajar Sambil Bermain ✨
        </p>

        {/* Class Session Stats Pill */}
        <div className="mb-8 bg-white/90 px-6 py-2.5 rounded-3xl border-2 border-amber-200 shadow-xs flex flex-wrap justify-center items-center gap-4 text-sm sm:text-lg font-black text-amber-950">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span>{completedStudentCount} Murid Sudah Bermain</span>
          </div>
          <span className="text-amber-300">•</span>
          <div className="text-amber-800">
            <span>{activeStudentCount} Total Murid</span>
          </div>
          <span className="text-amber-300">•</span>
          <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-0.5 rounded-xl border border-purple-200">
            {settings.playMode === 'bersama' ? (
              <>
                <Users size={18} />
                <span>Mode Kelas Bersama</span>
              </>
            ) : (
              <>
                <User size={18} />
                <span>Mode Individu</span>
              </>
            )}
          </div>
        </div>

        {/* Large IFP Action Buttons */}
        <div className="w-full max-w-xl space-y-4 px-2">
          {/* Main Huge Start Button */}
          <button
            onClick={onStartPlay}
            className="w-full min-h-[90px] py-5 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white rounded-3xl font-black text-2xl sm:text-3xl shadow-xl shadow-emerald-500/30 border-b-6 border-emerald-700 hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Play size={32} className="fill-white ml-1" />
            </div>
            <span>MULAI BERMAIN</span>
          </button>

          {/* Secondary IFP Buttons (Full screen & Teacher mode) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleToggleFullscreen}
              className={`min-h-[64px] py-3.5 px-5 rounded-2xl font-black text-base border-2 shadow-xs flex items-center justify-center gap-2.5 transition-all active:scale-95 ${
                isFullscreen
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
              }`}
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              <span>{isFullscreen ? 'Keluar Layar Penuh' : 'Tampilkan Layar Penuh'}</span>
            </button>

            <button
              onClick={onOpenTeacherMode}
              className="min-h-[64px] py-3.5 px-5 bg-white text-slate-800 rounded-2xl font-black text-base border-2 border-slate-300 shadow-xs hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <ShieldCheck size={22} className="text-amber-500" />
              <span>MODE GURU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-2 text-xs sm:text-sm font-extrabold text-amber-800/80 z-10">
        Khusus Anak Usia Dini (PAUD & TK) • Layar Sentuh Interaktif (IFP)
      </div>
    </div>
  );
};
