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
    trait: 'Clever Bald Boy',
    description: 'A quick-witted bald boy from Anatolian folk tales who outsmarts giants, solves impossible riddles, and always helps the underdog',
    region: 'tr',
  },
  {
    id: 'nasreddin',
    name: 'Nasreddin Hoca',
    emoji: '\u{1F9D4}',
    trait: 'Wise Trickster',
    description: 'A funny wise man who rides his donkey backwards and teaches life lessons through hilarious stories that make everyone think twice',
    region: 'tr',
  },
  {
    id: 'karagoz',
    name: 'Karag\u00F6z',
    emoji: '\u{1F3AD}',
    trait: 'Shadow Puppet Hero',
    description: 'A colorful shadow puppet who leaps off the screen into real adventures, bringing his friend Hacivat along for witty banter',
    region: 'tr',
  },

  // Japanese
  {
    id: 'momotaro',
    name: 'Momotar\u014D',
    emoji: '\u{1F351}',
    trait: 'Peach Boy Hero',
    description: 'A brave boy born from a giant peach who befriends a dog, monkey, and pheasant on a quest to protect his village from mischievous oni',
    region: 'ja',
  },
  {
    id: 'tanuki',
    name: 'Tanuki',
    emoji: '\u{1F43E}',
    trait: 'Shape-Shifting Raccoon',
    description: 'A playful raccoon dog who can transform into anything \u2014 a teapot, a tree, even a temple \u2014 but his round belly always gives him away',
    region: 'ja',
  },
  {
    id: 'kaguya',
    name: 'Kaguya',
    emoji: '\u{1F319}',
    trait: 'Moon Princess',
    description: 'A mysterious girl found inside a glowing bamboo stalk who has magical powers and a secret connection to the moon',
    region: 'ja',
  },

  // Spanish
  {
    id: 'quixote-kid',
    name: 'Don Quijotito',
    emoji: '\u{1FA96}',
    trait: 'Little Knight Dreamer',
    description: 'A kid who reads so many adventure books that he builds cardboard armor and rides his bicycle into imaginary quests with his best friend Sanchito',
    region: 'es',
  },
  {
    id: 'duende',
    name: 'Duendecito',
    emoji: '\u{1F3E0}',
    trait: 'Playful Elf',
    description: 'A tiny mischievous house elf who hides things, makes funny noises at night, but secretly protects the family and helps lost children find home',
    region: 'es',
  },
  {
    id: 'alebrije',
    name: 'Alebrije',
    emoji: '\u{1F432}',
    trait: 'Spirit Guide Creature',
    description: 'A colorful fantasy creature with butterfly wings, a dragon tail, and jaguar spots who guides children through the magical world of dreams',
    region: 'es',
  },

  // Arabic
  {
    id: 'sinbad-kid',
    name: 'Sinbad Junior',
    emoji: '\u26F5',
    trait: 'Young Sailor',
    description: 'A curious young sailor who inherits his grandfather\'s magical compass that points not to north, but to the next great adventure',
    region: 'ar',
  },
  {
    id: 'jinn-friend',
    name: 'Jinni',
    emoji: '\u{1FA94}',
    trait: 'Friendly Genie',
    description: 'A cheerful young genie still learning magic at genie school \u2014 his spells often go amusingly wrong, turning camels into cupcakes',
    region: 'ar',
  },
  {
    id: 'scheherazade-kid',
    name: 'Little Shahrazad',
    emoji: '\u{1F4D6}',
    trait: 'Master Storyteller',
    description: 'A girl with the gift of storytelling so powerful that her tales come to life, filling the room with flying carpets and talking birds',
    region: 'ar',
  },

  // French
  {
    id: 'petit-prince',
    name: 'Le Petit \u00C9toile',
    emoji: '\u2B50',
    trait: 'Star Traveler',
    description: 'A boy from a tiny asteroid who visits different planets, makes friends with a wise fox, and learns that what is essential is invisible to the eye',
    region: 'fr',
  },
  {
    id: 'amelie-kid',
    name: 'Am\u00E9lie',
    emoji: '\u{1F33B}',
    trait: 'Kindness Adventurer',
    description: 'A girl from a little Parisian neighborhood who goes on secret missions to make strangers smile through tiny acts of magic and kindness',
    region: 'fr',
  },
  {
    id: 'puss-kitten',
    name: 'Chat Bott\u00E9',
    emoji: '\u{1F97E}',
    trait: 'Clever Boots Cat',
    description: 'A witty kitten who wears tiny boots and a feathered hat, using clever tricks and charm to help children outsmart bullies and solve problems',
    region: 'fr',
  },

  // German
  {
    id: 'hansel-gretel',
    name: 'Hans & Greta',
    emoji: '\u{1F36A}',
    trait: 'Brave Siblings',
    description: 'A clever brother and sister duo who follow breadcrumb trails into magical forests and always find their way home through teamwork',
    region: 'de',
  },
  {
    id: 'heinzelmann',
    name: 'Heinzelm\u00E4nnchen',
    emoji: '\u{1F9DD}',
    trait: 'Helpful Elf',
    description: 'A tiny, hardworking elf from Cologne who sneaks into houses at night to finish chores, bake bread, and leave little surprises',
    region: 'de',
  },
  {
    id: 'till',
    name: 'Till Eulenspiegel',
    emoji: '\u{1F3AA}',
    trait: 'Jolly Prankster',
    description: 'A merry trickster boy who travels from town to town playing harmless pranks that teach important lessons about honesty and humility',
    region: 'de',
  },

  // Portuguese (Brazilian)
  {
    id: 'saci',
    name: 'Saci',
    emoji: '\u{1F326}\uFE0F',
    trait: 'One-Legged Trickster',
    description: 'A playful one-legged boy with a magic red cap who spins into dust devils, hides things for fun, and protects the forest from harm',
    region: 'pt',
  },
  {
    id: 'iara',
    name: 'Iara',
    emoji: '\u{1F3B6}',
    trait: 'River Enchantress',
    description: 'A beautiful river mermaid from the Amazon who sings enchanting melodies and guides lost travelers safely through the rainforest',
    region: 'pt',
  },
  {
    id: 'curupira',
    name: 'Curupira',
    emoji: '\u{1F525}',
    trait: 'Forest Guardian',
    description: 'A boy with flaming red hair and backwards feet who protects the Amazon animals and teaches children to love and respect nature',
    region: 'pt',
  },

  // Korean
  {
    id: 'haetae',
    name: 'Haetae',
    emoji: '\u{1F981}',
    trait: 'Justice Guardian',
    description: 'A mythical lion-dog with a gentle heart who can tell right from wrong and protects children from bad dreams and scary shadows',
    region: 'ko',
  },
  {
    id: 'sun-moon',
    name: 'Haenim & Dalnim',
    emoji: '\u2600\uFE0F',
    trait: 'Sun & Moon Kids',
    description: 'A brave brother and sister who climbed a rope to the sky to become the sun and moon, now they take turns watching over children',
    region: 'ko',
  },
  {
    id: 'dokkaebi',
    name: 'Dokkaebi',
    emoji: '\u{1F479}',
    trait: 'Playful Goblin',
    description: 'A silly, colorful goblin with a magic club that can create anything \u2014 he loves riddles, wrestling, and rewarding kind-hearted children',
    region: 'ko',
  },

  // Hindi
  {
    id: 'ganesha-kid',
    name: 'Little Ganesha',
    emoji: '\u{1F418}',
    trait: 'Wisdom Bringer',
    description: 'A cheerful elephant-headed boy who removes obstacles, loves sweets called modaks, and rides a tiny mouse named Mushika on grand adventures',
    region: 'hi',
  },
  {
    id: 'hanuman-kid',
    name: 'Young Hanuman',
    emoji: '\u{1F435}',
    trait: 'Brave Monkey Hero',
    description: 'A super-strong monkey boy who once tried to eat the sun thinking it was a mango \u2014 he can fly, shrink, and grow to help friends in need',
    region: 'hi',
  },
  {
    id: 'panchatantra',
    name: 'Vishnu Sharma',
    emoji: '\u{1F4DA}',
    trait: 'Story Teacher',
    description: 'A wise and gentle teacher who teaches life lessons through clever animal stories about loyal friends, tricky crows, and brave mice',
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
