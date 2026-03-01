export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  speechLang: string;
}

export const LANGUAGES: Language[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Turkce', flag: '\u{1F1F9}\u{1F1F7}', rtl: false, speechLang: 'tr-TR' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '\u{1F1FA}\u{1F1F8}', rtl: false, speechLang: 'en-US' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol', flag: '\u{1F1EA}\u{1F1F8}', rtl: false, speechLang: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Francais', flag: '\u{1F1EB}\u{1F1F7}', rtl: false, speechLang: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}', rtl: false, speechLang: 'de-DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}', rtl: false, speechLang: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugues', flag: '\u{1F1E7}\u{1F1F7}', rtl: false, speechLang: 'pt-BR' },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\u{1F1F8}\u{1F1E6}', rtl: true, speechLang: 'ar-SA' },
  { code: 'ja', name: 'Japanese', nativeName: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}', rtl: false, speechLang: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}', rtl: false, speechLang: 'ko-KR' },
  { code: 'zh', name: 'Chinese', nativeName: '\u4E2D\u6587', flag: '\u{1F1E8}\u{1F1F3}', rtl: false, speechLang: 'zh-CN' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}', rtl: false, speechLang: 'hi-IN' },
  { code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}', rtl: false, speechLang: 'ru-RU' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '\u{1F1F3}\u{1F1F1}', rtl: false, speechLang: 'nl-NL' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '\u{1F1F5}\u{1F1F1}', rtl: false, speechLang: 'pl-PL' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '\u{1F1F8}\u{1F1EA}', rtl: false, speechLang: 'sv-SE' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '\u{1F1F3}\u{1F1F4}', rtl: false, speechLang: 'nb-NO' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '\u{1F1E9}\u{1F1F0}', rtl: false, speechLang: 'da-DK' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '\u{1F1EB}\u{1F1EE}', rtl: false, speechLang: 'fi-FI' },
  { code: 'el', name: 'Greek', nativeName: '\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC', flag: '\u{1F1EC}\u{1F1F7}', rtl: false, speechLang: 'el-GR' },
  { code: 'cs', name: 'Czech', nativeName: 'Cestina', flag: '\u{1F1E8}\u{1F1FF}', rtl: false, speechLang: 'cs-CZ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Romana', flag: '\u{1F1F7}\u{1F1F4}', rtl: false, speechLang: 'ro-RO' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '\u{1F1ED}\u{1F1FA}', rtl: false, speechLang: 'hu-HU' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '\u{1F1EE}\u{1F1E9}', rtl: false, speechLang: 'id-ID' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '\u{1F1F2}\u{1F1FE}', rtl: false, speechLang: 'ms-MY' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tieng Viet', flag: '\u{1F1FB}\u{1F1F3}', rtl: false, speechLang: 'vi-VN' },
  { code: 'th', name: 'Thai', nativeName: '\u0E44\u0E17\u0E22', flag: '\u{1F1F9}\u{1F1ED}', rtl: false, speechLang: 'th-TH' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '\u{1F1F5}\u{1F1ED}', rtl: false, speechLang: 'fil-PH' },
  { code: 'uk', name: 'Ukrainian', nativeName: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430', flag: '\u{1F1FA}\u{1F1E6}', rtl: false, speechLang: 'uk-UA' },
  { code: 'he', name: 'Hebrew', nativeName: '\u05E2\u05D1\u05E8\u05D9\u05EA', flag: '\u{1F1EE}\u{1F1F1}', rtl: true, speechLang: 'he-IL' },
];

export const RTL_LANGUAGES = LANGUAGES.filter(l => l.rtl).map(l => l.code);

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[1]; // default English
}

export function isRTL(languageCode: string): boolean {
  return RTL_LANGUAGES.includes(languageCode);
}
