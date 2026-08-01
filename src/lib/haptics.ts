/** A short haptic tap for touch confirmations (pin, refresh). No-op where the
 *  Vibration API is unavailable (iOS Safari, desktop) or blocked. */
export function haptic(ms = 10): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // vibration unsupported or denied — silently ignore
  }
}
