// Screen Wake Lock API Helper for IFP Classroom Use

let wakeLockSentinel: any = null;
let isWakeLockDisabled = false;

export async function requestScreenWakeLock(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !('wakeLock' in navigator) ||
    isWakeLockDisabled
  ) {
    return false;
  }

  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
    return false;
  }

  if (wakeLockSentinel) {
    return true;
  }

  try {
    wakeLockSentinel = await (navigator as any).wakeLock.request('screen');

    wakeLockSentinel.addEventListener(
      'release',
      () => {
        wakeLockSentinel = null;
      },
      { once: true }
    );

    return true;
  } catch {
    wakeLockSentinel = null;
    // Permanently disable wakeLock for this session if permissions policy or browser blocks it
    isWakeLockDisabled = true;
    return false;
  }
}

export async function releaseScreenWakeLock(): Promise<void> {
  if (!wakeLockSentinel) {
    return;
  }

  try {
    await wakeLockSentinel.release();
  } catch {
    // Wake lock is optional, ignore release errors
  } finally {
    wakeLockSentinel = null;
  }
}

export function handleVisibilityWakeLock(isQuizActive: boolean): () => void {
  if (typeof document === 'undefined') return () => {};

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && isQuizActive && !isWakeLockDisabled) {
      await requestScreenWakeLock();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
