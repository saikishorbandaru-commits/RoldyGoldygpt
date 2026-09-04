import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Subtle haptic feedback for native Capacitor builds with a browser vibration fallback.
export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | number = 'light'
) {
  try {
    if (Capacitor.isNativePlatform()) {
      if (typeof type === 'number') {
        void Haptics.vibrate({ duration: type });
        return;
      }
      if (type === 'success') {
        void Haptics.notification({ type: NotificationType.Success });
        return;
      }
      if (type === 'warning') {
        void Haptics.notification({ type: NotificationType.Warning });
        return;
      }
      void Haptics.impact({
        style: type === 'heavy' ? ImpactStyle.Heavy : type === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light,
      });
      return;
    }

    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    if (typeof type === 'number') {
      navigator.vibrate(type);
      return;
    }
    switch (type) {
      case 'light': navigator.vibrate(15); break;
      case 'medium': navigator.vibrate(35); break;
      case 'heavy': navigator.vibrate([40, 30, 40]); break;
      case 'success': navigator.vibrate([25, 30, 45]); break;
      case 'warning': navigator.vibrate([60, 40, 60]); break;
    }
  } catch {
    // Native plugin/browser vibration may be unavailable; UX continues without haptics.
  }
}
