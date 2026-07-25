import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface QuizResultViewProps {
  studentName: string;
  studentAvatar: string;
  score: number; // 0 - 100
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  soundEnabled: boolean;
  onFinish: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  studentName,
  studentAvatar,
  score,
  correctCount,
  totalQuestions,
  durationSeconds,
  soundEnabled,
  onFinish,
}) => {
  useEffect(() => {
    // Play Fanfare
    soundEngine.playFanfareSound(soundEnabled);

    // Trigger Canvas Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // Ignore confetti errors if canvas fails
    }
  }, [soundEnabled]);

  // Determine positive message and star rating
  let positiveMessage = 'Tetap Semangat! 😊';
  let starsCount = 1;

  if (score >= 90) {
    positiveMessage = 'Luar Biasa! Kamu Hebat Sekali! 🌟';
    starsCount = 5;
  } else if (score >= 70) {
    positiveMessage = 'Bagus Banget! Pintar Sekali! 🎉';
    starsCount = 4;
  } else if (score >= 50) {
    positiveMessage = 'Bagus, Terus Belajar Ya! 💪';
    starsCount = 3;
  } else {
    positiveMessage = 'Hebat Sudah Berusaha! Ayo Belajar Lagi! 🎈';
    starsCount = 2;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m} menit ${s} detik` : `${s} detik`;
  };

  return (
    <div className="min-h-[calc(100vh-75px)] bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 p-6 max-w-4xl mx-auto flex flex-col items-center justify-between my-auto">
      <div className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto">
        {/* Celebration Header Card */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-2xl border-4 border-amber-300 relative overflow-hidden space-y-5">
          {/* Confetti Background Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

          {/* Avatar Icon */}
          <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center text-6xl mx-auto shadow-inner border-2 border-amber-300">
            {studentAvatar || '🐱'}
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 mb-1">{studentName}</h2>
            <p className="text-base sm:text-lg font-extrabold text-amber-700">
              Telah Menyelesaikan Kuis Ceria!
            </p>
          </div>

          {/* Star Rating Display */}
          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3, 4, 5].map(starNum => (
              <Star
                key={starNum}
                size={48}
                className={`transition-all transform hover:scale-110 ${
                  starNum <= starsCount
                    ? 'fill-amber-400 text-amber-400 drop-shadow-md animate-bounce'
                    : 'text-slate-200 fill-slate-100'
                }`}
                style={{ animationDelay: `${starNum * 0.1}s` }}
              />
            ))}
          </div>

          {/* Positive Message Badge */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xl sm:text-2xl py-3 px-8 rounded-3xl shadow-lg inline-block transform -rotate-1">
            {positiveMessage}
          </div>

          {/* Score Display Cards */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-300 text-emerald-950 shadow-xs">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-700">
                Nilai Akhir
              </p>
              <p className="text-5xl sm:text-6xl font-black text-emerald-600 mt-1">{score}</p>
            </div>

            <div className="bg-sky-50 p-5 rounded-3xl border-2 border-sky-300 text-sky-950 shadow-xs">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-sky-700">
                Jawaban Benar
              </p>
              <p className="text-5xl sm:text-6xl font-black text-sky-600 mt-1">
                {correctCount} <span className="text-2xl font-bold text-sky-400">/ {totalQuestions}</span>
              </p>
            </div>
          </div>

          {/* Duration Badge */}
          <p className="text-xs sm:text-sm font-extrabold text-slate-500 pt-2">
            Waktu Pengerjaan: <span className="text-slate-800">{formatTime(durationSeconds)}</span>
          </p>
        </div>
      </div>

      {/* Action Finish Button */}
      <div className="w-full max-w-xl mt-6">
        <button
          onClick={onFinish}
          className="w-full py-5 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white rounded-3xl font-black text-2xl shadow-xl border-b-6 border-emerald-700 hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <CheckCircle size={28} />
          <span>SELESAI & GANTI MURID</span>
        </button>
      </div>
    </div>
  );
};
