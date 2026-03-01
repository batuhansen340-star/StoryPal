export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  speechLang: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '\u{1F1EC}\u{1F1E7}', rtl: false, speechLang: 'en-US' },
  { code: 'tr', name: 'Turkish', nativeName: 'Turkce', flag: '\u{1F1F9}\u{1F1F7}', rtl: false, speechLang: 'tr-TR' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol', flag: '\u{1F1EA}\u{1F1F8}', rtl: false, speechLang: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Francais', flag: '\u{1F1EB}\u{1F1F7}', rtl: false, speechLang: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}', rtl: false, speechLang: 'de-DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugues', flag: '\u{1F1E7}\u{1F1F7}', rtl: false, speechLang: 'pt-BR' },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\u{1F1F8}\u{1F1E6}', rtl: true, speechLang: 'ar-SA' },
  { code: 'ja', name: 'Japanese', nativeName: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}', rtl: false, speechLang: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}', rtl: false, speechLang: 'ko-KR' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}', rtl: false, speechLang: 'hi-IN' },
];

export const RTL_LANGUAGES = LANGUAGES.filter(l => l.rtl).map(l => l.code);

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0]; // default English
}

export function isRTL(languageCode: string): boolean {
  return RTL_LANGUAGES.includes(languageCode);
}
