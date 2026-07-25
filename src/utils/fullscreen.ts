// Fullscreen API Helper for Interactive Flat Panel (IFP)

export function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).msFullscreenEnabled
  );
}

export function isFullscreenActive(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
  );
}

export async function requestFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const docEl = document.documentElement as any;

  try {
    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
      return true;
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
      return true;
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Fullscreen request deferred or unsupported:', err);
  }
  return false;
}

export async function exitFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const doc = document as any;

  try {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return true;
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
      return true;
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('Exit fullscreen error:', err);
  }
  return false;
}

export function toggleFullscreen(): Promise<boolean> {
  if (isFullscreenActive()) {
    return exitFullscreen().then(() => false);
  } else {
    return requestFullscreen();
  }
}

export function onFullscreenChange(callback: (active: boolean) => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const handle = () => {
    callback(isFullscreenActive());
  };

  document.addEventListener('fullscreenchange', handle);
  document.addEventListener('webkitfullscreenchange', handle);
  document.addEventListener('msfullscreenchange', handle);

  return () => {
    document.removeEventListener('fullscreenchange', handle);
    document.removeEventListener('webkitfullscreenchange', handle);
    document.removeEventListener('msfullscreenchange', handle);
  };
}
