import * as Speech from 'expo-speech';
import { createAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';
import type { VoiceCharacter } from '../types';

export type TTSSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<TTSSpeed, number> = {
  slow: 0.65,
  normal: 0.88,
  fast: 1.1,
};

const BEDTIME_RATE = 0.55;

const PAUSE_AFTER_SENTENCE = 300;
const PAUSE_AFTER_COMMA = 150;

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const DEFAULT_VOICE = 'nova';

export interface TTSOptions {
  language: string;
  speed: TTSSpeed;
  isBedtimeMode: boolean;
  voiceCharacter?: VoiceCharacter;
  onDone?: () => void;
  onStart?: () => void;
}

let currentPlayer: AudioPlayer | null = null;
let currentWebAudio: HTMLAudioElement | null = null;
let abortSpeech = false;

function splitTextWithPauses(text: string): { text: string; pauseMs: number }[] {
  const segments: { text: string; pauseMs: number }[] = [];
  const parts = text.split(/(?<=[.!?،,])\s+/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    let pauseMs = 0;
    if (/[.!?]$/.test(trimmed)) {
      pauseMs = PAUSE_AFTER_SENTENCE;
    } else if (/[,،]$/.test(trimmed)) {
      pauseMs = PAUSE_AFTER_COMMA;
    }

    segments.push({ text: trimmed, pauseMs });
  }

  if (segments.length === 0 && text.trim()) {
    segments.push({ text: text.trim(), pauseMs: 0 });
  }

  return segments;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function prepareTextForTTS(text: string): string {
  return text
    .replace(/\.\s/g, '... ')
    .replace(/!\s/g, '!... ')
    .replace(/\?\s/g, '?... ');
}

async function openaiTTSSpeak(text: string, options: TTSOptions): Promise<boolean> {
  if (!OPENAI_API_KEY) return false;

  try {
    const voice = options.voiceCharacter?.openaiVoice ?? DEFAULT_VOICE;
    const preparedText = prepareTextForTTS(text);
    const speed = options.isBedtimeMode ? 0.85 : SPEED_RATES[options.speed];

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: preparedText,
        voice,
        speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) return false;

    if (Platform.OS === 'web') {
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

    // Native: use expo-audio with base64
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    if (currentPlayer) {
      currentPlayer.remove();
      currentPlayer = null;
    }

    const player = createAudioPlayer({ uri: `data:audio/mpeg;base64,${base64}` });
    currentPlayer = player;

    options.onStart?.();

    player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        options.onDone?.();
        player.remove();
        if (currentPlayer === player) currentPlayer = null;
      }
    });

    player.play();
    return true;
  } catch {
    return false;
  }
}

export async function speak(text: string, options: TTSOptions): Promise<void> {
  await stop();

  // Try OpenAI TTS first
  const success = await openaiTTSSpeak(text, options);
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
    pitch = 1.08;
  }

  const segments = splitTextWithPauses(text);
  abortSpeech = false;
  options.onStart?.();

  for (let i = 0; i < segments.length; i++) {
    if (abortSpeech) break;

    await new Promise<void>((resolve) => {
      Speech.speak(segments[i].text, {
        language: options.language,
        rate,
        pitch,
        onDone: () => resolve(),
        onError: () => resolve(),
        onStopped: () => resolve(),
      });
    });

    if (i < segments.length - 1 && segments[i].pauseMs > 0 && !abortSpeech) {
      await sleep(segments[i].pauseMs);
    }
  }

  if (!abortSpeech) {
    options.onDone?.();
  }
}

export async function stop(): Promise<void> {
  abortSpeech = true;
  if (currentWebAudio) {
    currentWebAudio.pause();
    currentWebAudio.currentTime = 0;
    currentWebAudio = null;
  }
  if (currentPlayer) {
    currentPlayer.pause();
    currentPlayer.remove();
    currentPlayer = null;
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
