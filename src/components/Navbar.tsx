import React, { useState, useEffect } from 'react';
import { ShieldCheck, Volume2, VolumeX, LogOut, Maximize, Minimize, Users, User, Lock } from 'lucide-react';
import { QuizSettings } from '../types';
import { isFullscreenActive, toggleFullscreen, onFullscreenChange } from '../utils/fullscreen';
import { TouchNumericKeypad } from './common/TouchNumericKeypad';

interface NavbarProps {
  currentView: 'home' | 'student_select' | 'quiz' | 'result' | 'teacher';
  isTeacherMode: boolean;
  settings: QuizSettings;
  activeStudentName?: string;
  activeStudentAvatar?: string;
  onToggleSound: () => void;
  onEnterTeacherMode: (pin: string) => boolean;
  onExitTeacherMode: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isTeacherMode,
  settings,
  activeStudentName,
  activeStudentAvatar,
  onToggleSound,
  onEnterTeacherMode,
  onExitTeacherMode,
  onGoHome,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsFullscreen(isFullscreenActive());
    const cleanup = onFullscreenChange(active => {
      setIsFullscreen(active);
    });
    return cleanup;
  }, []);

  const handlePinSubmit = () => {
    const success = onEnterTeacherMode(pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleToggleFullscreen = async () => {
    await toggleFullscreen();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 shadow-xs px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand logo & title */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 text-left focus:outline-none group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-2xl shadow-md group-hover:rotate-6 transition-transform">
              🎈
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-amber-950 leading-tight tracking-tight flex items-center gap-2">
                <span>{settings.quizTitle || 'Kuis Ceria PAUD'}</span>
                <span className="hidden md:inline-block text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                  IFP Mode
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-700/90">
                Belajar Sambil Bermain
              </p>
            </div>
          </button>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play Mode Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-black">
              {settings.playMode === 'bersama' ? (
                <>
                  <Users size={16} className="text-purple-600" />
                  <span>Mode Bersama</span>
                </>
              ) : (
                <>
                  <User size={16} className="text-purple-600" />
                  <span>Mode Individu</span>
                </>
              )}
            </div>

            {/* Active Student Badge if playing */}
            {activeStudentName && currentView === 'quiz' && (
              <div className="flex items-center gap-2 bg-amber-100 text-amber-950 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black border border-amber-300 shadow-2xs">
                <span className="text-lg">{activeStudentAvatar || '🐱'}</span>
                <span className="truncate max-w-[120px]">{activeStudentName}</span>
              </div>
            )}

            {/* Fullscreen IFP Toggle Button */}
            <button
              onClick={handleToggleFullscreen}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black border shadow-2xs active:scale-95 transition-all ${
                isFullscreen
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
              }`}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Tampilkan Layar Penuh'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              <span className="hidden lg:inline">
                {isFullscreen ? 'Keluar Layar Penuh' : 'Tampilkan Layar Penuh'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2.5 rounded-2xl transition-colors border shadow-2xs ${
                settings.soundEnabled
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
              }`}
              title={settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Teacher Mode Switcher */}
            {isTeacherMode ? (
              <button
                onClick={onExitTeacherMode}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm shadow-xs hover:bg-rose-700 active:scale-95 transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Keluar Guru</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setPinError(false);
                  setPinInput('');
                  setShowPinModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 text-white font-black text-xs sm:text-sm shadow-xs hover:bg-slate-900 active:scale-95 transition-all"
              >
                <ShieldCheck size={18} className="text-amber-400" />
                <span>Mode Guru</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Touch Numeric Keypad Modal for Teacher PIN */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full my-auto">
            <TouchNumericKeypad
              value={pinInput}
              onChange={val => {
                setPinInput(val);
                setPinError(false);
              }}
              onSubmit={handlePinSubmit}
              onCancel={() => setShowPinModal(false)}
              submitLabel="Masuk Mode Guru"
              title="Akses Mode Guru (IFP)"
            />
            {pinError && (
              <p className="text-center text-sm font-black text-rose-400 mt-3 animate-bounce">
                PIN Salah! Coba lagi (Default: 1234)
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
