import React from 'react';
import { QuestionVisualData } from '../types';

interface VisualQuestionCardProps {
  visualData: QuestionVisualData;
}

export const VisualQuestionCard: React.FC<VisualQuestionCardProps> = ({ visualData }) => {
  const { type } = visualData;

  // 1. COUNTABLE ITEMS VISUAL
  if (type === 'count') {
    const count = visualData.count || 1;
    const emoji = visualData.itemEmoji || '🍎';
    const items = Array.from({ length: count }, (_, i) => i);

    return (
      <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-3xl border-3 border-amber-200 shadow-sm w-full min-h-[200px] lg:min-h-[240px]">
        <div className="flex flex-wrap justify-center items-center gap-4 max-w-md my-2">
          {items.map(idx => (
            <div
              key={idx}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-md border-2 border-amber-200 flex items-center justify-center text-3xl sm:text-5xl animate-bounce-short"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
        <p className="text-base sm:text-lg font-black text-amber-900 mt-2">
          Hitung semua {visualData.itemName || 'benda'} di atas ✨
        </p>
      </div>
    );
  }

  // 2. COLOR SHAPE VISUAL
  if (type === 'color_shape') {
    const shape = visualData.shape || 'lingkaran';
    const colorHex = visualData.colorHex || '#3B82F6';

    return (
      <div className="flex flex-col items-center justify-center p-6 bg-sky-50 rounded-3xl border-3 border-sky-200 shadow-sm w-full min-h-[200px] lg:min-h-[240px]">
        <div className="relative flex items-center justify-center my-3">
          {shape === 'lingkaran' && (
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-lg transition-transform"
              style={{ backgroundColor: colorHex }}
            />
          )}

          {shape === 'persegi' && (
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-lg transition-transform"
              style={{ backgroundColor: colorHex }}
            />
          )}

          {shape === 'persegi_panjang' && (
            <div
              className="w-44 h-28 sm:w-56 sm:h-36 rounded-3xl shadow-lg transition-transform"
              style={{ backgroundColor: colorHex }}
            />
          )}

          {shape === 'segitiga' && (
            <div
              className="w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[120px] shadow-sm transition-transform"
              style={{ borderBottomColor: colorHex }}
            />
          )}

          {shape === 'oval' && (
            <div
              className="w-44 h-28 sm:w-56 sm:h-36 rounded-[50%] shadow-lg transition-transform"
              style={{ backgroundColor: colorHex }}
            />
          )}

          {shape === 'bintang' && (
            <svg
              className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-lg transition-transform"
              viewBox="0 0 24 24"
              fill={colorHex}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}

          {shape === 'hati' && (
            <svg
              className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-lg transition-transform"
              viewBox="0 0 24 24"
              fill={colorHex}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </div>
      </div>
    );
  }

  // 3. LETTER VISUAL
  if (type === 'letter') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-3xl border-3 border-purple-200 shadow-sm w-full min-h-[200px] lg:min-h-[240px]">
        <div className="flex items-center gap-6 my-2">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl text-white font-black text-6xl sm:text-8xl flex items-center justify-center shadow-xl transform -rotate-3">
            {visualData.letter || 'A'}
          </div>
          <div className="flex flex-col items-center bg-white px-6 py-4 rounded-3xl shadow-md border-2 border-purple-100">
            <span className="text-5xl sm:text-7xl">{visualData.wordEmoji || '🍎'}</span>
            <span className="text-xl sm:text-2xl font-black text-purple-950 mt-2">
              {visualData.word || 'Apel'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. COMPARISON VISUAL
  if (type === 'comparison') {
    const itemA = visualData.itemA;
    const itemB = visualData.itemB;

    return (
      <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-3xl border-3 border-emerald-200 shadow-sm w-full min-h-[200px] lg:min-h-[240px]">
        {/* Item A Card */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs">
          <span className="text-sm sm:text-base font-black text-emerald-950 mb-2">
            {itemA?.name || 'Pilihan A'}
          </span>
          {itemA?.count ? (
            <div className="flex flex-wrap justify-center gap-2 max-w-[160px]">
              {Array.from({ length: itemA.count }).map((_, i) => (
                <span key={i} className="text-3xl sm:text-4xl">{itemA.emoji || '⭐'}</span>
              ))}
            </div>
          ) : (
            <span
              className={`transition-all ${
                itemA?.size === 'large' ? 'text-6xl sm:text-8xl' : 'text-3xl sm:text-5xl'
              }`}
            >
              {itemA?.emoji || '🐘'}
            </span>
          )}
        </div>

        {/* Item B Card */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs">
          <span className="text-sm sm:text-base font-black text-emerald-950 mb-2">
            {itemB?.name || 'Pilihan B'}
          </span>
          {itemB?.count ? (
            <div className="flex flex-wrap justify-center gap-2 max-w-[160px]">
              {Array.from({ length: itemB.count }).map((_, i) => (
                <span key={i} className="text-3xl sm:text-4xl">{itemB.emoji || '⭐'}</span>
              ))}
            </div>
          ) : (
            <span
              className={`transition-all ${
                itemB?.size === 'large' ? 'text-6xl sm:text-8xl' : 'text-3xl sm:text-5xl'
              }`}
            >
              {itemB?.emoji || '🐜'}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 5. ANIMAL / FRUIT / OBJECT CARD VISUAL
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-rose-50 rounded-3xl border-3 border-rose-200 shadow-sm w-full min-h-[200px] lg:min-h-[240px]">
      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl shadow-lg border-2 border-rose-100 flex flex-col items-center justify-center my-2">
        <span className="text-7xl sm:text-8xl">{visualData.mainEmoji || '🐱'}</span>
      </div>
      {visualData.subText && (
        <span className="text-base font-black text-rose-900 mt-2 bg-white px-4 py-1 rounded-full shadow-2xs border border-rose-200">
          {visualData.subText}
        </span>
      )}
    </div>
  );
};
