import React, { useState } from 'react';
import { Volume2, Play, Pause, SkipForward, Eye, X, Home, Lock, RefreshCcw } from 'lucide-react';
import { PressAndHoldButton } from '../common/PressAndHoldButton';

interface TeacherAssistanceModalProps {
  onClose: () => void;
  onRepeatAudio: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  onSkipQuestion: () => void;
  onShowAnswer: () => void;
  onCancelQuiz: () => void;
  onReturnToStudentSelect: () => void;
}

export const TeacherAssistanceModal: React.FC<TeacherAssistanceModalProps> = ({
  onClose,
  onRepeatAudio,
  onTogglePause,
  isPaused,
  onSkipQuestion,
  onShowAnswer,
  onCancelQuiz,
  onReturnToStudentSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border-4 border-purple-400 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl text-xl font-black">
              👩‍🏫
            </span>
            <div>
              <h3 className="font-black text-xl text-slate-900">Panel Bantuan Guru (IFP)</h3>
              <p className="text-xs font-semibold text-slate-500">
                Kontrol sesi kuis berjalan untuk mendampingi murid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Primary Quick Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onRepeatAudio();
              onClose();
            }}
            className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-900 font-extrabold text-base flex items-center gap-3 active:scale-95 transition-all"
          >
            <Volume2 size={28} className="text-amber-600 flex-shrink-0" />
            <div className="text-left">
              <div>Putar Suara Soal</div>
              <div className="text-xs font-normal text-amber-700">Ulangi pembacaan audio</div>
            </div>
          </button>

          <button
            onClick={() => {
              onTogglePause();
              onClose();
            }}
            className={`p-4 rounded-2xl border-2 font-extrabold text-base flex items-center gap-3 active:scale-95 transition-all ${
              isPaused
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            {isPaused ? (
              <Play size={28} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <Pause size={28} className="text-blue-600 flex-shrink-0" />
            )}
            <div className="text-left">
              <div>{isPaused ? 'Lanjutkan Kuis' : 'Jeda Kuis'}</div>
              <div className="text-xs font-normal opacity-80">
                {isPaused ? 'Mulai kembali timer/pengerjaan' : 'Hentikan sementara'}
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onSkipQuestion();
              onClose();
            }}
            className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-900 font-extrabold text-base flex items-center gap-3 active:scale-95 transition-all"
          >
            <SkipForward size={28} className="text-purple-600 flex-shrink-0" />
            <div className="text-left">
              <div>Lewati Soal Ini</div>
              <div className="text-xs font-normal text-purple-700">Lanjut ke nomor berikutnya</div>
            </div>
          </button>

          <button
            onClick={() => {
              onShowAnswer();
              onClose();
            }}
            className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 text-teal-900 font-extrabold text-base flex items-center gap-3 active:scale-95 transition-all"
          >
            <Eye size={28} className="text-teal-600 flex-shrink-0" />
            <div className="text-left">
              <div>Tunjukkan Jawaban</div>
              <div className="text-xs font-normal text-teal-700">Beri petunjuk jawaban benar</div>
            </div>
          </button>
        </div>

        {/* Protected Actions (Press and Hold 2 Seconds) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Lock size={12} className="text-rose-500" />
            <span>Tindakan Sensitif (Tekan & Tahan 2 Detik)</span>
          </p>

          <div className="grid grid-cols-2 gap-3">
            <PressAndHoldButton
              onTrigger={() => {
                onReturnToStudentSelect();
                onClose();
              }}
              holdDurationMs={2000}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 rounded-2xl font-bold text-sm"
            >
              <Home size={18} />
              <span>Ganti Murid</span>
            </PressAndHoldButton>

            <PressAndHoldButton
              onTrigger={() => {
                onCancelQuiz();
                onClose();
              }}
              holdDurationMs={2000}
              className="p-3.5 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-800 rounded-2xl font-bold text-sm"
            >
              <X size={18} className="text-rose-600" />
              <span>Batalkan Kuis</span>
            </PressAndHoldButton>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white font-extrabold text-sm rounded-2xl hover:bg-slate-800"
        >
          Tutup Panel
        </button>
      </div>
    </div>
  );
};
