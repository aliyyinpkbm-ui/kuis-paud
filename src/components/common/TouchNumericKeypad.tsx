import React from 'react';
import { Delete, Check, RotateCcw } from 'lucide-react';

interface TouchNumericKeypadProps {
  value: string;
  maxLength?: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
}

export const TouchNumericKeypad: React.FC<TouchNumericKeypadProps> = ({
  value,
  maxLength = 6,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = 'Masuk',
  title = 'Masukan PIN Guru',
}) => {
  const handleDigit = (digit: string) => {
    if (value.length < maxLength) {
      onChange(value + digit);
    }
  };

  const handleDelete = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-auto shadow-2xl border-4 border-amber-300 text-center">
      <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
        Gunakan papan angka di bawah untuk memasukkan PIN
      </p>

      {/* PIN Display Boxes */}
      <div className="flex justify-center items-center gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 flex items-center justify-center text-3xl font-black font-mono transition-all ${
              idx < value.length
                ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-inner'
                : 'bg-slate-50 border-slate-300 text-slate-300'
            }`}
          >
            {idx < value.length ? '•' : ''}
          </div>
        ))}
      </div>

      {/* Touch Keypad Grid (Min 80x80px touch targets) */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            className="min-h-[80px] min-w-[80px] rounded-2xl bg-slate-100 hover:bg-amber-100 active:bg-amber-400 border-2 border-slate-200 text-3xl font-black text-slate-800 shadow-xs active:scale-95 transition-all flex items-center justify-center"
          >
            {num}
          </button>
        ))}

        {/* Bottom Row: Clear, 0, Backspace */}
        <button
          type="button"
          onClick={handleClear}
          className="min-h-[80px] min-w-[80px] rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-200 text-rose-700 font-black text-lg shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
          title="Hapus Semua"
        >
          <RotateCcw size={24} />
          <span className="text-sm">Hapus</span>
        </button>

        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="min-h-[80px] min-w-[80px] rounded-2xl bg-slate-100 hover:bg-amber-100 active:bg-amber-400 border-2 border-slate-200 text-3xl font-black text-slate-800 shadow-xs active:scale-95 transition-all flex items-center justify-center"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="min-h-[80px] min-w-[80px] rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-200 text-amber-800 font-black text-lg shadow-xs active:scale-95 transition-all flex items-center justify-center"
          title="Hapus 1 Angka"
        >
          <Delete size={28} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[64px] rounded-2xl bg-slate-100 hover:bg-slate-200 font-black text-base text-slate-700 active:scale-95 transition-all"
          >
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={value.length === 0}
          className={`flex-1 min-h-[64px] rounded-2xl font-black text-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
            value.length >= 4
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-amber-500 text-white hover:bg-amber-600 opacity-60'
          }`}
        >
          <Check size={24} />
          <span>{submitLabel}</span>
        </button>
      </div>
    </div>
  );
};
