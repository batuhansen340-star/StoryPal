import type { Theme, Character, AgeGroup, AgeGroupConfig } from '../../../packages/shared/types';

export const THEMES: Theme[] = [
  {
    id: 'space',
    name: 'Space Adventure',
    emoji: '🚀',
    gradient: ['#2C3E50', '#4CA1AF'],
    description: 'Blast off to the stars!',
  },
  {
    id: 'ocean',
    name: 'Ocean Discovery',
    emoji: '🌊',
    gradient: ['#0077B6', '#00B4D8'],
    description: 'Dive into the deep blue sea!',
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    emoji: '🌳',
    gradient: ['#2D6A4F', '#52B788'],
    description: 'Explore magical woodlands!',
  },
  {
    id: 'castle',
    name: 'Royal Castle',
    emoji: '🏰',
    gradient: ['#7B2D8E', '#C77DFF'],
    description: 'Enter a kingdom of wonder!',
  },
  {
    id: 'dinosaur',
    name: 'Dinosaur World',
    emoji: '🦕',
    gradient: ['#BC6C25', '#DDA15E'],
    description: 'Travel back in time!',
  },
  {
    id: 'fairy',
    name: 'Fairy Garden',
    emoji: '🧚',
    gradient: ['#FF69B4', '#FFB6C1'],
    description: 'Enter a world of tiny magic!',
  },
  {
    id: 'pirate',
    name: 'Pirate Treasure',
    emoji: '🏴‍☠️',
    gradient: ['#8B4513', '#DAA520'],
    description: 'Set sail for adventure!',
  },
  {
    id: 'robot',
    name: 'Robot City',
    emoji: '🤖',
    gradient: ['#4A4E69', '#9A8C98'],
    description: 'Build and create in the future!',
  },
  {
    id: 'animal',
    name: 'Animal Kingdom',
    emoji: '🦁',
    gradient: ['#F4A261', '#E76F51'],
    description: 'Meet amazing animal friends!',
  },
  {
    id: 'superhero',
    name: 'Superhero Academy',
    emoji: '🦸',
    gradient: ['#E63946', '#457B9D'],
    description: 'Discover your superpowers!',
  },
];

export const CHARACTERS: Character[] = [
  {
    id: 'luna',
    name: 'Luna',
    emoji: '👧',
    trait: 'Brave Girl',
    description: 'A courageous girl who never gives up',
  },
  {
    id: 'max',
    name: 'Max',
    emoji: '👦',
    trait: 'Clever Boy',
    description: 'A smart boy who solves every puzzle',
  },
  {
    id: 'whiskers',
    name: 'Whiskers',
    emoji: '🐱',
    trait: 'Magic Cat',
    description: 'A mysterious cat with magical powers',
  },
  {
    id: 'spark',
    name: 'Spark',
    emoji: '🐉',
    trait: 'Baby Dragon',
    description: 'A tiny dragon learning to fly',
  },
  {
    id: 'professor-hoot',
    name: 'Professor Hoot',
    emoji: '🦉',
    trait: 'Wise Owl',
    description: 'The wisest owl in the whole forest',
  },
  {
    id: 'clover',
    name: 'Clover',
    emoji: '🐰',
    trait: 'Lucky Bunny',
    description: 'A lucky bunny who finds adventure everywhere',
  },
  {
    id: 'beep',
    name: 'Beep',
    emoji: '🤖',
    trait: 'Friendly Robot',
    description: 'A robot who wants to learn about feelings',
  },
  {
    id: 'iris',
    name: 'Iris',
    emoji: '🧚',
    trait: 'Kind Fairy',
    description: 'A fairy who grants wishes with kindness',
  },
  {
    id: 'honey',
    name: 'Honey',
    emoji: '🐻',
    trait: 'Cuddly Bear',
    description: 'A bear cub who loves hugs and honey',
  },
  {
    id: 'zorp',
    name: 'Zorp',
    emoji: '👽',
    trait: 'Friendly Alien',
    description: 'An alien exploring Earth for the first time',
  },
];

export const AGE_GROUPS: Record<AgeGroup, AgeGroupConfig> = {
  '3-5': {
    label: '3-5 Years',
    pages: 5,
    maxWordsPerPage: 30,
    description: 'Simple words, big pictures',
  },
  '5-7': {
    label: '5-7 Years',
    pages: 8,
    maxWordsPerPage: 50,
    description: 'Short stories, fun adventures',
  },
  '7-10': {
    label: '7-10 Years',
    pages: 10,
    maxWordsPerPage: 80,
    description: 'Longer tales, richer details',
  },
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['2 stories per day', 'Basic themes', 'Standard illustrations'],
  },
  {
    id: 'storypal_monthly',
    name: 'Monthly',
    price: '$4.99',
    period: 'month',
    features: ['Unlimited stories', 'All themes & characters', 'HD illustrations', 'Save & share'],
  },
  {
    id: 'storypal_yearly',
    name: 'Yearly',
    price: '$29.99',
    period: 'year',
    features: ['Unlimited stories', 'All themes & characters', 'HD illustrations', 'Save & share', 'Priority generation'],
    isPopular: true,
  },
  {
    id: 'storypal_lifetime',
    name: 'Lifetime',
    price: '$59.99',
    period: 'once',
    features: ['Everything in Yearly', 'One-time payment', 'Future updates included'],
  },
];
