import type { Character } from '../../../packages/shared/types';

const LANGUAGE_TO_REGION: Record<string, string> = {
  tr: 'tr',
  es: 'es',
  ar: 'ar',
  ja: 'ja',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  ko: 'ko',
  hi: 'hi',
};

export const REGIONAL_CHARACTERS: Character[] = [
  // Turkish
  {
    id: 'keloglan',
    name: 'Keloglan',
    emoji: '\u{1F9D2}',
    trait: 'Zeki Kelpaklı Çocuk',
    description: 'Anadolu halk masallarından gelen, devlerini alt eden, imkansız bulmacaları çözen ve her zaman mazluma yardım eden hızlı zekâlı kelpaklı bir çocuk',
    region: 'tr',
  },
  {
    id: 'nasreddin',
    name: 'Nasreddin Hoca',
    emoji: '\u{1F9D4}',
    trait: 'Bilge Hile Ustası',
    description: 'Eşeğine ters bindirip herkesin iki kere düşünmesini sağlayan komik hikâyelerle hayat dersleri öğreten eğlenceli bilge bir adam',
    region: 'tr',
  },
  {
    id: 'karagoz',
    name: 'Karag\u00F6z',
    emoji: '\u{1F3AD}',
    trait: 'Gölge Oyunu Kahramanı',
    description: 'Perdeden gerçek maceralara zıplayan, arkadaşı Hacivat ile zekice alaşmaları yapan renkli bir gölge oyunu karakteri',
    region: 'tr',
  },

  // Japanese
  {
    id: 'momotaro',
    name: 'Momotar\u014D',
    emoji: '\u{1F351}',
    trait: 'モモの英雄',
    description: '巨大なモモから生まれた勇敢な少年。犬、猿、キジと友達になり、いたずら好きな鬼から村を守るために冒険する',
    region: 'ja',
  },
  {
    id: 'tanuki',
    name: 'Tanuki',
    emoji: '\u{1F43E}',
    trait: '形を変えるタヌキ',
    description: 'やんちゃなタヌキで、何にでも変身できる（急須、木、お寺まで！）。でも丸いお腹がいつも正体を暴露する',
    region: 'ja',
  },
  {
    id: 'kaguya',
    name: 'Kaguya',
    emoji: '\u{1F319}',
    trait: '月の姫君',
    description: 'ぼんやり輝く竹の中で見つかった謎の女の子。魔力を持ち、月と秘密の繋がりがある',
    region: 'ja',
  },

  // Spanish
  {
    id: 'quixote-kid',
    name: 'Don Quijotito',
    emoji: '\u{1FA96}',
    trait: 'Pequeño Caballero Soñador',
    description: 'Un niño que lee tantos libros de aventuras que se construye armadura de cartón y monta en su bicicleta hacia aventuras imaginarias con su mejor amigo Sanchito',
    region: 'es',
  },
  {
    id: 'duende',
    name: 'Duendecito',
    emoji: '\u{1F3E0}',
    trait: 'Elfos Juguetón',
    description: 'Un pequeño elfo travieso que esconde cosas, hace ruidos divertidos por la noche, pero secretamente protege a la familia y ayuda a los niños perdidos a encontrar hogar',
    region: 'es',
  },
  {
    id: 'alebrije',
    name: 'Alebrije',
    emoji: '\u{1F432}',
    trait: 'Criatura Guía Espiritual',
    description: 'Una criatura de fantasía colorida con alas de mariposa, cola de dragón y manchas de jaguar que guía a los niños por el mundo mágico de los sueños',
    region: 'es',
  },

  // Arabic
  {
    id: 'sinbad-kid',
    name: 'Sinbad Junior',
    emoji: '\u26F5',
    trait: 'بحار شاب',
    description: 'بحار شاب فضولي يرث بوصلة جده السحرية التي تشير ليس إلى الشمال، بل إلى المغامرة العظيمة التالية',
    region: 'ar',
  },
  {
    id: 'jinn-friend',
    name: 'Jinni',
    emoji: '\u{1FA94}',
    trait: 'جني ودي',
    description: 'جني شاب مرح لا يزال يتعلم السحر في مدرسة الجن - تذهب تعاويذه عادة إلى الخطأ بطريقة مضحكة، وتحول الجمال إلى كب كيك',
    region: 'ar',
  },
  {
    id: 'scheherazade-kid',
    name: 'Little Shahrazad',
    emoji: '\u{1F4D6}',
    trait: 'حكاءة ماهرة',
    description: 'فتاة تتمتع بموهبة سرد القصص قوية جداً بحيث تأتي حكاياتها إلى الحياة، مملوءة بالسجاجيد الطائرة والطيور الناطقة',
    region: 'ar',
  },

  // French
  {
    id: 'petit-prince',
    name: 'Le Petit \u00C9toile',
    emoji: '\u2B50',
    trait: 'Voyageur des Étoiles',
    description: 'Un garçon venant d\'une minuscule astéroïde qui visite différentes planètes, se lie d\'amitié avec un renard sage, et apprend que l\'essentiel est invisible aux yeux',
    region: 'fr',
  },
  {
    id: 'amelie-kid',
    name: 'Am\u00E9lie',
    emoji: '\u{1F33B}',
    trait: 'Aventurière de la Gentillesse',
    description: 'Une fille d\'un petit quartier parisien qui se lance dans des missions secrètes pour faire sourire les étrangers par de petits actes de magie et de bienveillance',
    region: 'fr',
  },
  {
    id: 'puss-kitten',
    name: 'Chat Bott\u00E9',
    emoji: '\u{1F97E}',
    trait: 'Chat Botté Rusé',
    description: 'Un petit chat astucieux qui porte de minuscules bottes et un chapeau à plumes, utilisant des astuces intelligentes et du charme pour aider les enfants à déjouer les intimidateurs',
    region: 'fr',
  },

  // German
  {
    id: 'hansel-gretel',
    name: 'Hans & Greta',
    emoji: '\u{1F36A}',
    trait: 'Tapfere Geschwister',
    description: 'Ein kluges Geschwisterpaar, das Brotkrümelspuren in magische Wälder folgt und seinen Weg nach Hause durch Teamwork immer findet',
    region: 'de',
  },
  {
    id: 'heinzelmann',
    name: 'Heinzelm\u00E4nnchen',
    emoji: '\u{1F9DD}',
    trait: 'Fleißiger Elf',
    description: 'Ein winziger, fleißiger Elf aus Köln, der nachts in Häuser einschleicht, um Aufgaben zu erledigen, Brot zu backen und kleine Überraschungen zu hinterlassen',
    region: 'de',
  },
  {
    id: 'till',
    name: 'Till Eulenspiegel',
    emoji: '\u{1F3AA}',
    trait: 'Lustiger Scherzbold',
    description: 'Ein fröhlicher Schelmenjunge, der von Stadt zu Stadt reist, harmlose Streiche spielt, die wichtige Lektionen über Ehrlichkeit und Demut lehren',
    region: 'de',
  },

  // Portuguese (Brazilian)
  {
    id: 'saci',
    name: 'Saci',
    emoji: '\u{1F326}\uFE0F',
    trait: 'Travesso de Uma Perna',
    description: 'Um menino travesso de uma perna com um boné vermelho mágico que gira em redemoinhos, esconde coisas por diversão e protege a floresta de danos',
    region: 'pt',
  },
  {
    id: 'iara',
    name: 'Iara',
    emoji: '\u{1F3B6}',
    trait: 'Encantadora do Rio',
    description: 'Uma bela sereia do rio Amazonas que canta melodias encantadoras e guia viajantes perdidos com segurança pela floresta tropical',
    region: 'pt',
  },
  {
    id: 'curupira',
    name: 'Curupira',
    emoji: '\u{1F525}',
    trait: 'Guardião da Floresta',
    description: 'Um menino com cabelos vermelhos flameantes e pés para trás que protege os animais do Amazonas e ensina as crianças a amar e respeitar a natureza',
    region: 'pt',
  },

  // Korean
  {
    id: 'haetae',
    name: 'Haetae',
    emoji: '\u{1F981}',
    trait: '정의의 수호자',
    description: '선과 악을 구분할 수 있는 온화한 마음의 신화적 사자-개. 아이들을 악몽과 무서운 그림자로부터 보호한다',
    region: 'ko',
  },
  {
    id: 'sun-moon',
    name: 'Haenim & Dalnim',
    emoji: '\u2600\uFE0F',
    trait: '태양과 달 아이들',
    description: '하늘로 올라가기 위해 밧줄을 탄 용감한 형제자매로 태양과 달이 되었으며, 이제 아이들을 지키는 것을 번갈아 한다',
    region: 'ko',
  },
  {
    id: 'dokkaebi',
    name: 'Dokkaebi',
    emoji: '\u{1F479}',
    trait: '장난꾸러기 도깨비',
    description: '모든 것을 만들 수 있는 마법의 방망이를 가진 우스꽝스럽고 다채로운 도깨비. 수수께끼, 씨름, 착한 마음의 아이들에게 보상하는 것을 좋아한다',
    region: 'ko',
  },

  // Hindi
  {
    id: 'ganesha-kid',
    name: 'Little Ganesha',
    emoji: '\u{1F418}',
    trait: 'बुद्धि का दाता',
    description: 'एक खुशमिजाज हाथी के सिर वाला लड़का जो बाधाओं को दूर करता है, मोदक नामक मिठाइयां पसंद करता है, और मुशिका नाम के एक छोटे चूहे पर भव्य साहसिक कार्य पर सवारी करता है',
    region: 'hi',
  },
  {
    id: 'hanuman-kid',
    name: 'Young Hanuman',
    emoji: '\u{1F435}',
    trait: 'बहादुर बंदर नायक',
    description: 'एक बेहद मजबूत बंदर लड़का जिसने एक बार सूरज को आम समझकर खाने की कोशिश की - वह जरूरत में दोस्तों की मदद करने के लिए उड़ सकता है, सिकुड़ सकता है और बढ़ सकता है',
    region: 'hi',
  },
  {
    id: 'panchatantra',
    name: 'Vishnu Sharma',
    emoji: '\u{1F4DA}',
    trait: 'कहानी शिक्षक',
    description: 'एक बुद्धिमान और कोमल शिक्षक जो वफादार दोस्तों, चालाक कौओं और बहादुर चूहों के बारे में चतुर जानवरों की कहानियों के माध्यम से जीवन के पाठ सिखाता है',
    region: 'hi',
  },
];

export function getRegionalCharacters(languageCode: string): Character[] {
  const region = LANGUAGE_TO_REGION[languageCode];
  if (!region) return [];
  return REGIONAL_CHARACTERS.filter(c => c.region === region);
}

export function getCharactersForLanguage(allCharacters: Character[], languageCode: string): Character[] {
  const regional = getRegionalCharacters(languageCode);
  if (regional.length === 0) return allCharacters;
  return [...regional, ...allCharacters];
}
