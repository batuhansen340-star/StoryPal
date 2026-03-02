import { Platform } from 'react-native';

type ImpactStyle = 'light' | 'medium' | 'heavy';

let Haptics: typeof import('expo-haptics') | null = null;

async function loadHaptics() {
  if (Platform.OS === 'web') return null;
  if (Haptics) return Haptics;
  try {
    Haptics = await import('expo-haptics');
    return Haptics;
  } catch {
    return null;
  }
}

export async function impact(style: ImpactStyle = 'light') {
  const h = await loadHaptics();
  if (!h) return;
  const map = {
    light: h.ImpactFeedbackStyle.Light,
    medium: h.ImpactFeedbackStyle.Medium,
    heavy: h.ImpactFeedbackStyle.Heavy,
  };
  await h.impactAsync(map[style]);
}

export async function selection() {
  const h = await loadHaptics();
  if (!h) return;
  await h.selectionAsync();
}

export async function notification(type: 'success' | 'warning' | 'error') {
  const h = await loadHaptics();
  if (!h) return;
  const map = {
    success: h.NotificationFeedbackType.Success,
    warning: h.NotificationFeedbackType.Warning,
    error: h.NotificationFeedbackType.Error,
  };
  await h.notificationAsync(map[type]);
}
