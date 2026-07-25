import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Mic, MicOff, Key, Save, AlertTriangle, RefreshCw, Check, Sparkles, Users, User, ShieldAlert } from 'lucide-react';
import { QuizSettings, QuestionCategory, Question } from '../../types';
import { CATEGORY_LABELS } from '../../data/questionBank';
import { checkQuestionBankCapacity } from '../../utils/quizAssigner';
import { PressAndHoldButton } from '../common/PressAndHoldButton';

interface TeacherSettingsProps {
  settings: QuizSettings;
  questionBank: Question[];
  activeStudentCount: number;
  onSaveSettings: (updated: QuizSettings) => void;
  onFactoryReset: () => void;
}

export const TeacherSettings: React.FC<TeacherSettingsProps> = ({
  settings,
  questionBank,
  activeStudentCount,
  onSaveSettings,
  onFactoryReset,
}) => {
  const [questionsPerStudent, setQuestionsPerStudent] = useState(settings.questionsPerStudent || 10);
  const [enabledCategories, setEnabledCategories] = useState<QuestionCategory[]>(
    settings.enabledCategories || []
  );
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [ttsEnabled, setTtsEnabled] = useState(settings.ttsEnabled);
  const [allowSecondAttempt, setAllowSecondAttempt] = useState(settings.allowSecondAttempt);
  const [quizTitle, setQuizTitle] = useState(settings.quizTitle || 'Kuis Ceria PAUD');
  const [playMode, setPlayMode] = useState<'individu' | 'bersama'>(settings.playMode || 'individu');
  const [autoReadQuestion, setAutoReadQuestion] = useState(settings.autoReadQuestion ?? true);

  // Change PIN states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Capacity Check
  const capacityCheck = checkQuestionBankCapacity(
    activeStudentCount,
    questionsPerStudent,
    questionBank,
    enabledCategories
  );

  const handleToggleCategory = (cat: QuestionCategory) => {
    if (enabledCategories.includes(cat)) {
      if (enabledCategories.length <= 1) {
        alert('Minimal harus ada 1 kategori aktif!');
        return;
      }
      setEnabledCategories(enabledCategories.filter(c => c !== cat));
    } else {
      setEnabledCategories([...enabledCategories, cat]);
    }
  };

  const handleSaveGeneralSettings = () => {
    const updated: QuizSettings = {
      ...settings,
      questionsPerStudent,
      enabledCategories,
      soundEnabled,
      ttsEnabled,
      allowSecondAttempt,
      quizTitle,
      playMode,
      autoReadQuestion,
    };
    onSaveSettings(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== settings.teacherPin) {
      setPinMessage({ type: 'error', text: 'PIN Lama salah!' });
      return;
    }
    if (newPinInput.length < 4) {
      setPinMessage({ type: 'error', text: 'PIN baru minimal 4 angka!' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinMessage({ type: 'error', text: 'Konfirmasi PIN Baru tidak cocok!' });
      return;
    }

    const updated: QuizSettings = {
      ...settings,
      teacherPin: newPinInput,
    };
    onSaveSettings(updated);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinMessage({ type: 'success', text: 'PIN Guru berhasil diperbarui!' });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      {/* Question Bank Capacity Warning Alert */}
      {!capacityCheck.isSufficient && (
        <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-5 flex items-start gap-4 shadow-2xs">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-black text-base text-amber-950">Peringatan Kapasitas Bank Soal</h4>
            <p className="text-sm font-semibold text-amber-800 mt-1 leading-relaxed">
              {capacityCheck.message}
            </p>
          </div>
        </div>
      )}

      {/* Mode Permainan Kelas Card */}
      <div className="bg-white rounded-3xl p-6 border-3 border-purple-200 shadow-xs space-y-4">
        <h3 className="font-black text-lg text-purple-950 pb-2 border-b border-purple-100 flex items-center gap-2">
          <Users size={22} className="text-purple-600" />
          <span>Mode Permainan Kelas (IFP)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPlayMode('individu')}
            className={`p-4 rounded-2xl border-3 text-left transition-all ${
              playMode === 'individu'
                ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-base mb-1">
              <User size={20} className="text-purple-600" />
              <span>Mode Individu (Default)</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Setiap murid memilih namanya sendiri dan mengerjakan paket kuis berbeda.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPlayMode('bersama')}
            className={`p-4 rounded-2xl border-3 text-left transition-all ${
              playMode === 'bersama'
                ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-base mb-1">
              <Users size={20} className="text-purple-600" />
              <span>Mode Bersama (Satu Kelas)</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Satu paket kuis ditampilkan di layar IFP untuk dijawab bersama seluruh murid.
            </p>
          </button>
        </div>
      </div>

      {/* General Settings Card */}
      <div className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-xs space-y-5">
        <h3 className="font-black text-lg text-amber-950 pb-2 border-b border-amber-100">
          Pengaturan Kuis
        </h3>

        {/* Quiz Title */}
        <div>
          <label className="text-sm font-black text-slate-800 block mb-1.5">Judul Aplikasi Kuis</label>
          <input
            type="text"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Questions per student */}
        <div>
          <label className="text-sm font-black text-slate-800 block mb-1.5">
            Jumlah Soal per Murid (Default: 10)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionsPerStudent(num)}
                className={`py-3 rounded-2xl text-sm font-black transition-all ${
                  questionsPerStudent === num
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num} Soal
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Toggles */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-sm font-extrabold text-slate-800">Efek Suara (Musik/Chime)</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-1.5 rounded-2xl text-xs font-black transition-all ${
                soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {soundEnabled ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-sm font-extrabold text-slate-800">Pembaca Soal Otomatis (TTS)</span>
            <button
              onClick={() => setAutoReadQuestion(!autoReadQuestion)}
              className={`px-4 py-1.5 rounded-2xl text-xs font-black transition-all ${
                autoReadQuestion ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {autoReadQuestion ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-sm font-extrabold text-slate-800">Izinkan Kesempatan ke-2</span>
            <button
              onClick={() => setAllowSecondAttempt(!allowSecondAttempt)}
              className={`px-4 py-1.5 rounded-2xl text-xs font-black transition-all ${
                allowSecondAttempt ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {allowSecondAttempt ? 'Aktif (2x)' : '1x Saja'}
            </button>
          </div>
        </div>

        {/* Enabled Categories Toggles */}
        <div className="pt-3 border-t border-slate-100">
          <label className="text-sm font-black text-slate-800 block mb-2">
            Kategori Soal Aktif ({enabledCategories.length}/10)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map(catKey => {
              const isChecked = enabledCategories.includes(catKey);

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => handleToggleCategory(catKey)}
                  className={`p-3 rounded-2xl border-2 text-xs font-extrabold text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="truncate">{CATEGORY_LABELS[catKey]}</span>
                  {isChecked && <Check size={16} className="text-amber-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSaveGeneralSettings}
          className="w-full py-4 bg-amber-500 text-white font-black text-base rounded-2xl shadow-md hover:bg-amber-600 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Save size={20} />
          <span>Simpan Pengaturan Kuis</span>
        </button>

        {saveSuccessNotice && (
          <p className="text-sm font-black text-emerald-600 text-center animate-fade-in">
            ✅ Pengaturan berhasil disimpan!
          </p>
        )}
      </div>

      {/* Change PIN Card */}
      <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-xs space-y-4">
        <h3 className="font-black text-lg text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Key size={20} className="text-amber-600" />
          <span>Ubah PIN Guru</span>
        </h3>

        <form onSubmit={handleChangePin} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">PIN Lama</label>
              <input
                type="password"
                required
                maxLength={6}
                value={currentPinInput}
                onChange={e => setCurrentPinInput(e.target.value)}
                placeholder="1234"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">PIN Baru</label>
              <input
                type="password"
                required
                maxLength={6}
                value={newPinInput}
                onChange={e => setNewPinInput(e.target.value)}
                placeholder="Misal: 5678"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Konfirmasi PIN Baru</label>
              <input
                type="password"
                required
                maxLength={6}
                value={confirmPinInput}
                onChange={e => setConfirmPinInput(e.target.value)}
                placeholder="Ketik ulang PIN baru"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
              />
            </div>
          </div>

          {pinMessage && (
            <p
              className={`text-xs font-bold text-center ${
                pinMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {pinMessage.text}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-slate-800 text-white font-black text-sm rounded-2xl hover:bg-slate-900 active:scale-95"
          >
            Update PIN Guru
          </button>
        </form>
      </div>

      {/* Protected Factory Reset Card (Press & Hold 2 Seconds) */}
      <div className="bg-rose-50 rounded-3xl p-6 border-3 border-rose-300 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-rose-800 font-black text-base">
          <ShieldAlert size={22} className="text-rose-600" />
          <span>Reset Ke Data Default (Pabrik)</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-rose-800/90 leading-relaxed max-w-md mx-auto">
          Menghapus semua data murid, riwayat kuis, dan mengembalikan PIN ke 1234. Dilengkapi perlindungan tekan & tahan agar tidak tersenggol anak.
        </p>

        <div className="max-w-xs mx-auto">
          <PressAndHoldButton
            onTrigger={() => {
              onFactoryReset();
            }}
            holdDurationMs={2000}
            className="w-full py-3.5 bg-rose-600 text-white font-black text-sm rounded-2xl shadow-md hover:bg-rose-700"
          >
            <span>Tahan 2 Detik Untuk Reset Pabrik</span>
          </PressAndHoldButton>
        </div>
      </div>
    </div>
  );
};
