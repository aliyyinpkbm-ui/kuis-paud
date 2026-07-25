import React, { useState, useRef, useEffect } from 'react';

interface PressAndHoldButtonProps {
  onTrigger: () => void;
  holdDurationMs?: number; // Default 2000ms
  className?: string;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

export const PressAndHoldButton: React.FC<PressAndHoldButtonProps> = ({
  onTrigger,
  holdDurationMs = 2000,
  className = '',
  children,
  title,
  disabled = false,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearHoldState = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
    setIsHolding(false);
    setProgress(0);
  };

  const startHold = (e: React.SyntheticEvent) => {
    if (disabled) return;
    // Prevent context menus / selection on touch devices
    e.stopPropagation();

    clearHoldState();
    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const tickInterval = 50; // update progress every 50ms
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, Math.round((elapsed / holdDurationMs) * 100));
      setProgress(currentProgress);
    }, tickInterval);

    timerRef.current = setTimeout(() => {
      clearHoldState();
      // Provide haptic feedback if available
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      onTrigger();
    }, holdDurationMs);
  };

  const endHold = () => {
    clearHoldState();
  };

  useEffect(() => {
    return () => {
      clearHoldState();
    };
  }, []);

  return (
    <button
      type="button"
      title={title || 'Tekan dan tahan selama 2 detik'}
      disabled={disabled}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      className={`relative overflow-hidden select-none touch-none transition-transform active:scale-95 ${className}`}
    >
      {/* Background progress fill layer */}
      {isHolding && (
        <div
          className="absolute inset-0 bg-rose-600/30 dark:bg-rose-500/40 transition-all duration-75 pointer-events-none z-0"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
        {isHolding && (
          <span className="text-[11px] font-black font-mono bg-slate-900/80 text-amber-300 px-2 py-0.5 rounded-full animate-pulse ml-1">
            {progress}%
          </span>
        )}
      </div>
    </button>
  );
};
