import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import type { VoiceCharacter } from '../types';

export type TTSSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<TTSSpeed, number> = {
  slow: 0.7,
  normal: 1.0,
  fast: 1.3,
};

const BEDTIME_RATE = 0.6;

const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? '';
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // "Sarah" — warm, friendly female voice

export interface TTSOptions {
  language: string;
  speed: TTSSpeed;
  isBedtimeMode: boolean;
  voiceCharacter?: VoiceCharacter;
  onDone?: () => void;
  onStart?: () => void;
}

let currentSound: Audio.Sound | null = null;
let currentWebAudio: HTMLAudioElement | null = null;

async function elevenLabsSpeak(text: string, options: TTSOptions): Promise<boolean> {
  if (!ELEVENLABS_API_KEY) return false;

  try {
    const stability = options.isBedtimeMode ? 0.8 : 0.5;
    const similarityBoost = 0.75;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) return false;

    if (Platform.OS === 'web') {
      // Web: use HTML5 Audio with blob URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (currentWebAudio) {
        currentWebAudio.pause();
        currentWebAudio = null;
      }

      const audio = new window.Audio(url);
      currentWebAudio = audio;

      options.onStart?.();

      return new Promise<boolean>((resolve) => {
        audio.onended = () => {
          options.onDone?.();
          URL.revokeObjectURL(url);
          if (currentWebAudio === audio) currentWebAudio = null;
          resolve(true);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (currentWebAudio === audio) currentWebAudio = null;
          resolve(false);
        };
        audio.play().catch(() => resolve(false));
      });
    }

    // Native: use expo-av with base64
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    if (currentSound) {
      await currentSound.unloadAsync().catch(() => {});
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: `data:audio/mpeg;base64,${base64}` },
      { shouldPlay: false }
    );
    currentSound = sound;

    options.onStart?.();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        options.onDone?.();
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
      }
    });

    await sound.playAsync();
    return true;
  } catch {
    return false;
  }
}

export async function speak(text: string, options: TTSOptions): Promise<void> {
  await stop();

  // Try ElevenLabs first
  const success = await elevenLabsSpeak(text, options);
  if (success) return;

  // Fallback to device speech
  let rate: number;
  let pitch: number;

  if (options.isBedtimeMode) {
    rate = BEDTIME_RATE;
    pitch = 1.0;
  } else if (options.voiceCharacter) {
    rate = options.voiceCharacter.rate * SPEED_RATES[options.speed];
    pitch = options.voiceCharacter.pitch;
  } else {
    rate = SPEED_RATES[options.speed];
    pitch = 1.0;
  }

  return new Promise<void>((resolve) => {
    Speech.speak(text, {
      language: options.language,
      rate,
      pitch,
      onStart: () => {
        options.onStart?.();
      },
      onDone: () => {
        options.onDone?.();
        resolve();
      },
      onError: () => {
        resolve();
      },
      onStopped: () => {
        resolve();
      },
    });
  });
}

export async function stop(): Promise<void> {
  if (currentWebAudio) {
    currentWebAudio.pause();
    currentWebAudio.currentTime = 0;
    currentWebAudio = null;
  }
  if (currentSound) {
    await currentSound.stopAsync().catch(() => {});
    await currentSound.unloadAsync().catch(() => {});
    currentSound = null;
  }
  await Speech.stop();
}

export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}

export function getSpeechLanguageCode(languageCode: string): string {
  const langMap: Record<string, string> = {
    tr: 'tr-TR',
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-BR',
    ar: 'ar-SA',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    hi: 'hi-IN',
    ru: 'ru-RU',
    nl: 'nl-NL',
    pl: 'pl-PL',
    sv: 'sv-SE',
    no: 'nb-NO',
    da: 'da-DK',
    fi: 'fi-FI',
    el: 'el-GR',
    cs: 'cs-CZ',
    ro: 'ro-RO',
    hu: 'hu-HU',
    id: 'id-ID',
    ms: 'ms-MY',
    vi: 'vi-VN',
    th: 'th-TH',
    fil: 'fil-PH',
    uk: 'uk-UA',
    he: 'he-IL',
  };

  return langMap[languageCode] ?? 'en-US';
}
