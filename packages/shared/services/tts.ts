import * as Speech from 'expo-speech';

export type TTSSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<TTSSpeed, number> = {
  slow: 0.7,
  normal: 1.0,
  fast: 1.3,
};

const BEDTIME_RATE = 0.6;

export interface TTSOptions {
  language: string;
  speed: TTSSpeed;
  isBedtimeMode: boolean;
  onDone?: () => void;
  onStart?: () => void;
}

export async function speak(text: string, options: TTSOptions): Promise<void> {
  await stop();

  const rate = options.isBedtimeMode ? BEDTIME_RATE : SPEED_RATES[options.speed];

  return new Promise<void>((resolve) => {
    Speech.speak(text, {
      language: options.language,
      rate,
      pitch: 1.0,
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
