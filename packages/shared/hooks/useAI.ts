import { useState, useCallback } from 'react';
import type { AgeGroup, StoryGenerationResponse, PersonalizationData } from '../types';

type AIStatus = 'idle' | 'generating-text' | 'generating-images' | 'complete' | 'error';

interface AIState {
  status: AIStatus;
  progress: number;
  totalSteps: number;
  currentStep: string;
  story: StoryGenerationResponse | null;
  imageUrls: string[];
  coverUrl: string | null;
  error: string | null;
}

type DemoStories = Record<string, Record<string, StoryGenerationResponse>>;

const DEMO_STORIES_EN: DemoStories = {
  space: {
    luna: {
      title: 'Luna and the Star Dragon',
      pages: [
        { text: 'One night, Luna looked up at the sky and saw a shooting star fall behind the moon.', imagePrompt: 'girl looking at shooting star' },
        { text: '"I must find that star!" she said, and hopped into her rocket ship made of cardboard and dreams.', imagePrompt: 'girl in cardboard rocket' },
        { text: 'In space, she met a tiny dragon made of starlight. "Hello! I am Cosmo," it sparkled.', imagePrompt: 'star dragon in space' },
        { text: 'Cosmo was lost and missed the constellation family. Luna said, "I will help you find them!"', imagePrompt: 'luna and dragon flying' },
        { text: 'Together they flew past planets of candy and moons of cheese, laughing all the way.', imagePrompt: 'candy planets in space' },
      ],
    },
    default: {
      title: 'Journey Through the Stars',
      pages: [
        { text: 'Far beyond the clouds, a magical spaceship waited for its next adventure.', imagePrompt: 'magical spaceship' },
        { text: 'The stars twinkled like diamonds, lighting the way through the cosmic ocean.', imagePrompt: 'twinkling stars' },
        { text: 'On Planet Giggles, everyone laughed instead of talking. What a funny place!', imagePrompt: 'funny planet with laughing aliens' },
        { text: 'The bravest explorer made friends with creatures from every corner of the galaxy.', imagePrompt: 'space friends together' },
        { text: 'And when the adventure was done, every star shone a little brighter. The end!', imagePrompt: 'bright stars ending' },
      ],
    },
  },
  ocean: {
    whiskers: {
      title: "Whiskers' Ocean Quest",
      pages: [
        { text: 'Whiskers the magic cat found a golden shell that whispered secrets of the deep sea.', imagePrompt: 'cat with golden shell' },
        { text: 'With a splash and a spin, Whiskers dove under the waves into a world of blue and green.', imagePrompt: 'cat diving underwater' },
        { text: 'A friendly octopus named Ollie wrapped a tentacle around Whiskers for a hug!', imagePrompt: 'octopus hugging cat' },
        { text: '"The coral castle needs your magic!" Ollie said. So off they swam, side by side.', imagePrompt: 'swimming to coral castle' },
        { text: 'Whiskers sprinkled magic sparkles and the coral bloomed in rainbow colors! Everyone cheered!', imagePrompt: 'rainbow coral celebration' },
      ],
    },
    default: {
      title: 'Secrets of the Deep Blue',
      pages: [
        { text: 'Under the ocean waves, a hidden kingdom sparkled with treasures untold.', imagePrompt: 'underwater kingdom' },
        { text: 'Colorful fish danced in circles, creating a rainbow beneath the sea.', imagePrompt: 'dancing colorful fish' },
        { text: 'A gentle whale sang the most beautiful song that echoed through the water.', imagePrompt: 'singing whale' },
        { text: 'Together, all the sea creatures built a friendship bridge from shells and coral.', imagePrompt: 'shell bridge underwater' },
        { text: 'The ocean was full of love, and every wave carried a new story. The end!', imagePrompt: 'happy ocean ending' },
      ],
    },
  },
  forest: {
    clover: {
      title: 'Clover and the Enchanted Tree',
      pages: [
        { text: 'Clover the bunny hopped through the forest and found a tree that glowed golden.', imagePrompt: 'bunny near golden tree' },
        { text: '"Who goes there?" said the tree. "I am Clover, and I am looking for adventure!"', imagePrompt: 'talking tree with bunny' },
        { text: 'The tree opened a secret door in its trunk, revealing a staircase of mushrooms.', imagePrompt: 'mushroom staircase inside tree' },
        { text: 'At the bottom, tiny fairies were having a tea party with acorn cups!', imagePrompt: 'fairy tea party' },
        { text: 'Clover joined the party and made the best friends ever. What a magical day!', imagePrompt: 'bunny at fairy party' },
      ],
    },
    default: {
      title: 'The Enchanted Forest Adventure',
      pages: [
        { text: 'Deep in the forest, where the sunlight danced through the leaves, magic was everywhere.', imagePrompt: 'sunlit magical forest' },
        { text: 'Tiny mushroom houses lined the path, each one home to a different woodland friend.', imagePrompt: 'mushroom houses in forest' },
        { text: 'A wise old fox shared stories of the ancient forest and its wonderful secrets.', imagePrompt: 'wise fox telling stories' },
        { text: 'The fireflies lit up the evening sky like a thousand tiny lanterns.', imagePrompt: 'fireflies lighting forest' },
        { text: 'In this magical forest, every creature had a story, and every story had a happy ending!', imagePrompt: 'happy forest ending' },
      ],
    },
  },
};

const DEMO_STORIES_TR: DemoStories = {
  space: {
    default: {
      title: 'Yildizlara Yolculuk',
      pages: [
        { text: 'Bir gece, gokyuzune bakan kucuk kahraman, ayin arkasina dusen bir yildiz gordu.', imagePrompt: 'child looking at shooting star' },
        { text: '"O yildizi bulmaliyim!" dedi ve kartondan yapilmis roketine atladi.', imagePrompt: 'child in cardboard rocket' },
        { text: 'Uzayda, yildiz isignindan yapilmis minik bir ejderhayla karsilasti. "Merhaba! Ben Cosmo!"', imagePrompt: 'star dragon in space' },
        { text: 'Cosmo kaybolmustu ve takimyildizi ailesini ozlemisti. "Sana onlari bulmanda yardim edecegim!"', imagePrompt: 'friends flying in space' },
        { text: 'Birlikte seker gezegenlerinin ve peynir aylarin yanindan gecip gulduler. Ne guzel bir macera!', imagePrompt: 'candy planets in space' },
      ],
    },
  },
  ocean: {
    default: {
      title: 'Derin Denizin Sirlari',
      pages: [
        { text: 'Okyanus dalgalarinin altinda, anlatilmamis hazinelerle parlayan gizli bir krallik vardi.', imagePrompt: 'underwater kingdom' },
        { text: 'Renkli baliklar daireler cizerek dans ediyor, denizin altinda gokkusagi olusturuyorlardi.', imagePrompt: 'dancing colorful fish' },
        { text: 'Nazik bir balina, suda yankilanan en guzel sarkiyi soyledi.', imagePrompt: 'singing whale' },
        { text: 'Tum deniz canlilari birlikte kabuklar ve mercanlardan bir dostluk koprusu insa ettiler.', imagePrompt: 'shell bridge underwater' },
        { text: 'Okyanus sevgiyle doluydu ve her dalga yeni bir hikaye tasiyordu. Son!', imagePrompt: 'happy ocean ending' },
      ],
    },
  },
  forest: {
    default: {
      title: 'Buyulu Orman Macerasi',
      pages: [
        { text: 'Ormanin derinliklerinde, gunes isiginin yapraklar arasinda dans ettigi yerde, her yer sihirle doluydu.', imagePrompt: 'sunlit magical forest' },
        { text: 'Yol boyunca minik mantar evler dizilmisti, her biri farkli bir orman arkadaasinin eviydi.', imagePrompt: 'mushroom houses in forest' },
        { text: 'Bilge yasli bir tilki, kadim ormanin ve onun harikulade sirlarinin hikayelerini paylasti.', imagePrompt: 'wise fox telling stories' },
        { text: 'Atesbocekleri aksam gokyuzunu bin tane kucuk fener gibi aydinlatti.', imagePrompt: 'fireflies lighting forest' },
        { text: 'Bu buyulu ormanda, her yaratikn bir hikayesi vardi ve her hikayenin mutlu bir sonu!', imagePrompt: 'happy forest ending' },
      ],
    },
  },
};

const DEMO_STORIES_ES: DemoStories = {
  space: {
    default: {
      title: 'Viaje a las Estrellas',
      pages: [
        { text: 'Una noche, mirando al cielo, vio una estrella fugaz caer detras de la luna.', imagePrompt: 'child looking at shooting star' },
        { text: '"Debo encontrar esa estrella!" dijo, y salto a su cohete hecho de carton y suenos.', imagePrompt: 'child in cardboard rocket' },
        { text: 'En el espacio, conocio un pequeno dragon hecho de luz de estrellas. "Hola! Soy Cosmo!"', imagePrompt: 'star dragon in space' },
        { text: 'Cosmo estaba perdido y extranaba a su familia de constelaciones. "Te ayudare a encontrarlos!"', imagePrompt: 'friends flying in space' },
        { text: 'Juntos volaron por planetas de dulces y lunas de queso, riendo todo el camino. Fin!', imagePrompt: 'candy planets in space' },
      ],
    },
  },
  ocean: {
    default: {
      title: 'Secretos del Azul Profundo',
      pages: [
        { text: 'Bajo las olas del oceano, un reino escondido brillaba con tesoros sin contar.', imagePrompt: 'underwater kingdom' },
        { text: 'Peces coloridos bailaban en circulos, creando un arcoiris bajo el mar.', imagePrompt: 'dancing colorful fish' },
        { text: 'Una ballena gentil canto la cancion mas hermosa que resono por el agua.', imagePrompt: 'singing whale' },
        { text: 'Juntas, todas las criaturas del mar construyeron un puente de amistad con conchas y corales.', imagePrompt: 'shell bridge underwater' },
        { text: 'El oceano estaba lleno de amor, y cada ola llevaba una nueva historia. Fin!', imagePrompt: 'happy ocean ending' },
      ],
    },
  },
};

const DEMO_STORIES_AR: DemoStories = {
  space: {
    default: {
      title: '\u0631\u062D\u0644\u0629 \u0625\u0644\u0649 \u0627\u0644\u0646\u062C\u0648\u0645',
      pages: [
        { text: '\u0641\u064A \u0644\u064A\u0644\u0629 \u0645\u0646 \u0627\u0644\u0644\u064A\u0627\u0644\u064A\u060C \u0646\u0638\u0631 \u0625\u0644\u0649 \u0627\u0644\u0633\u0645\u0627\u0621 \u0648\u0631\u0623\u0649 \u0646\u062C\u0645\u0629 \u062A\u0633\u0642\u0637 \u062E\u0644\u0641 \u0627\u0644\u0642\u0645\u0631.', imagePrompt: 'child looking at shooting star' },
        { text: '"\u064A\u062C\u0628 \u0623\u0646 \u0623\u062C\u062F \u062A\u0644\u0643 \u0627\u0644\u0646\u062C\u0645\u0629!" \u0642\u0627\u0644\u060C \u0648\u0642\u0641\u0632 \u0625\u0644\u0649 \u0635\u0627\u0631\u0648\u062E\u0647 \u0627\u0644\u0645\u0635\u0646\u0648\u0639 \u0645\u0646 \u0627\u0644\u0643\u0631\u062A\u0648\u0646 \u0648\u0627\u0644\u0623\u062D\u0644\u0627\u0645.', imagePrompt: 'child in cardboard rocket' },
        { text: '\u0641\u064A \u0627\u0644\u0641\u0636\u0627\u0621\u060C \u0627\u0644\u062A\u0642\u0649 \u0628\u062A\u0646\u064A\u0646 \u0635\u063A\u064A\u0631 \u0645\u0635\u0646\u0648\u0639 \u0645\u0646 \u0636\u0648\u0621 \u0627\u0644\u0646\u062C\u0648\u0645. "\u0645\u0631\u062D\u0628\u0627! \u0623\u0646\u0627 \u0643\u0648\u0632\u0645\u0648!"', imagePrompt: 'star dragon in space' },
        { text: '\u0643\u0627\u0646 \u0643\u0648\u0632\u0645\u0648 \u062A\u0627\u0626\u0647\u0627\u064B \u0648\u064A\u0634\u062A\u0627\u0642 \u0644\u0639\u0627\u0626\u0644\u062A\u0647. "\u0633\u0623\u0633\u0627\u0639\u062F\u0643 \u0641\u064A \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u064A\u0647\u0645!"', imagePrompt: 'friends flying in space' },
        { text: '\u0645\u0639\u0627\u064B \u0637\u0627\u0631\u0627 \u0639\u0628\u0631 \u0643\u0648\u0627\u0643\u0628 \u0627\u0644\u062D\u0644\u0648\u0649 \u0648\u0623\u0642\u0645\u0627\u0631 \u0627\u0644\u062C\u0628\u0646\u060C \u0636\u0627\u062D\u0643\u064A\u0646 \u0637\u0648\u0627\u0644 \u0627\u0644\u0637\u0631\u064A\u0642. \u0627\u0644\u0646\u0647\u0627\u064A\u0629!', imagePrompt: 'candy planets in space' },
      ],
    },
  },
};

const DEMO_STORIES_JA: DemoStories = {
  space: {
    default: {
      title: '\u661F\u3078\u306E\u65C5',
      pages: [
        { text: '\u3042\u308B\u591C\u3001\u7A7A\u3092\u898B\u4E0A\u3052\u308B\u3068\u3001\u6708\u306E\u5F8C\u308D\u306B\u6D41\u308C\u661F\u304C\u843D\u3061\u308B\u306E\u304C\u898B\u3048\u307E\u3057\u305F\u3002', imagePrompt: 'child looking at shooting star' },
        { text: '\u300C\u3042\u306E\u661F\u3092\u898B\u3064\u3051\u306A\u304D\u3083\uFF01\u300D\u3068\u8A00\u3063\u3066\u3001\u6BB5\u30DC\u30FC\u30EB\u3068\u5922\u3067\u4F5C\u3063\u305F\u30ED\u30B1\u30C3\u30C8\u306B\u98DB\u3073\u4E57\u308A\u307E\u3057\u305F\u3002', imagePrompt: 'child in cardboard rocket' },
        { text: '\u5B87\u5B99\u3067\u3001\u661F\u306E\u5149\u3067\u3067\u304D\u305F\u5C0F\u3055\u306A\u7ADC\u306B\u51FA\u4F1A\u3044\u307E\u3057\u305F\u3002\u300C\u3053\u3093\u306B\u3061\u306F\uFF01\u50D5\u306F\u30B3\u30B9\u30E2\uFF01\u300D', imagePrompt: 'star dragon in space' },
        { text: '\u30B3\u30B9\u30E2\u306F\u8FF7\u5B50\u3067\u3001\u661F\u5EA7\u306E\u5BB6\u65CF\u304C\u604B\u3057\u304B\u3063\u305F\u306E\u3067\u3059\u3002\u300C\u898B\u3064\u3051\u308B\u306E\u3092\u624B\u4F1D\u3046\u3088\uFF01\u300D', imagePrompt: 'friends flying in space' },
        { text: '\u4E00\u7DD2\u306B\u30AD\u30E3\u30F3\u30C7\u30A3\u306E\u60D1\u661F\u3084\u30C1\u30FC\u30BA\u306E\u6708\u3092\u901A\u308A\u904E\u304E\u3001\u7B11\u3044\u5408\u3044\u307E\u3057\u305F\u3002\u304A\u3057\u307E\u3044\uFF01', imagePrompt: 'candy planets in space' },
      ],
    },
  },
};

const DEMO_BY_LANG: Record<string, DemoStories> = {
  en: DEMO_STORIES_EN,
  tr: DEMO_STORIES_TR,
  es: DEMO_STORIES_ES,
  ar: DEMO_STORIES_AR,
  ja: DEMO_STORIES_JA,
};

const INTERACTIVE_DEMO: StoryGenerationResponse = {
  title: "Luna's Space Choice",
  pages: [
    {
      text: 'Luna floated through space in her rocket ship when she saw two strange planets ahead.',
      imagePrompt: 'girl in rocket seeing two planets',
    },
    {
      text: 'One planet glowed purple and hummed with music. The other sparkled green with dancing lights.',
      imagePrompt: 'purple musical planet and green sparkling planet',
      choices: [
        { id: 'purple', emoji: '\u{1F7E3}', text: 'Visit the Purple Planet', nextPageIndex: 2 },
        { id: 'green', emoji: '\u{1F7E2}', text: 'Visit the Green Planet', nextPageIndex: 4 },
      ],
    },
    {
      text: "On the Purple Planet, musical flowers sang Luna's favorite songs! She danced with the flower creatures.",
      imagePrompt: 'girl dancing with singing flowers on purple planet',
    },
    {
      text: 'The flowers gave Luna a magic melody that would help her wherever she went. What a musical adventure!',
      imagePrompt: 'girl receiving glowing melody gift from flowers',
    },
    {
      text: 'On the Green Planet, friendly light-bugs created amazing shapes in the sky just for Luna!',
      imagePrompt: 'girl watching light bugs creating shapes in green sky',
    },
    {
      text: 'The light-bugs taught Luna how to paint with light. She created a masterpiece across the stars!',
      imagePrompt: 'girl painting with light across starry sky',
    },
  ],
};

function getCustomDemoStory(customPrompt: string): StoryGenerationResponse {
  return {
    title: 'A Magical Adventure',
    pages: [
      { text: 'Once upon a time, someone had an incredible idea...', imagePrompt: 'magical idea sparkling' },
      { text: `"${customPrompt}" \u2014 and so the adventure began!`, imagePrompt: 'adventure beginning with sparkles' },
      { text: 'Magic sparkled everywhere as the story came to life.', imagePrompt: 'magic sparkles everywhere' },
      { text: 'New friends appeared to help along the way!', imagePrompt: 'friendly characters greeting' },
      { text: 'And everyone lived happily ever after. The end!', imagePrompt: 'happy ending celebration' },
    ],
  };
}

function getDemoStory(theme: string, character: string, language: string = 'en', customPrompt?: string): StoryGenerationResponse {
  if (customPrompt) {
    return getCustomDemoStory(customPrompt);
  }

  // 50% chance of interactive demo for space/luna in English
  if (theme === 'space' && character === 'luna' && language === 'en' && Math.random() > 0.5) {
    return INTERACTIVE_DEMO;
  }

  const langStories = DEMO_BY_LANG[language] ?? DEMO_BY_LANG.en;
  const themeStories = langStories[theme] ?? langStories[Object.keys(langStories)[0]];
  if (!themeStories) {
    const fallback = DEMO_BY_LANG.en;
    const fallbackTheme = fallback[theme] ?? fallback.space;
    return fallbackTheme[character] ?? fallbackTheme.default;
  }
  return themeStories[character] ?? themeStories.default ?? DEMO_STORIES_EN.space.default;
}

const PLACEHOLDER_IMAGES = [
  'https://placehold.co/1024x1024/FF6B6B/FFFFFF?text=Page+1&font=raleway',
  'https://placehold.co/1024x1024/4ECDC4/FFFFFF?text=Page+2&font=raleway',
  'https://placehold.co/1024x1024/FFE66D/2D2D2D?text=Page+3&font=raleway',
  'https://placehold.co/1024x1024/A18CD1/FFFFFF?text=Page+4&font=raleway',
  'https://placehold.co/1024x1024/52B788/FFFFFF?text=Page+5&font=raleway',
  'https://placehold.co/1024x1024/FF8E53/FFFFFF?text=Page+6&font=raleway',
  'https://placehold.co/1024x1024/00B4D8/FFFFFF?text=Page+7&font=raleway',
  'https://placehold.co/1024x1024/C77DFF/FFFFFF?text=Page+8&font=raleway',
  'https://placehold.co/1024x1024/DDA15E/FFFFFF?text=Page+9&font=raleway',
  'https://placehold.co/1024x1024/FFB6C1/2D2D2D?text=Page+10&font=raleway',
];

const COVER_PLACEHOLDER = 'https://placehold.co/1024x1024/FF6B6B/FFFFFF?text=Cover&font=raleway';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const isDemoMode = !process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL === '';

export function useAI() {
  const [state, setState] = useState<AIState>({
    status: 'idle',
    progress: 0,
    totalSteps: 0,
    currentStep: '',
    story: null,
    imageUrls: [],
    coverUrl: null,
    error: null,
  });

  const generateFullStory = useCallback(async (params: {
    theme: string;
    character: string;
    ageGroup: AgeGroup;
    language: string;
    personalization?: PersonalizationData;
    customPrompt?: string;
  }) => {
    setState({
      status: 'generating-text',
      progress: 0,
      totalSteps: 0,
      currentStep: 'Writing your story...',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });

    try {
      // Demo mode: simulate AI generation with delays
      if (isDemoMode) {
        await sleep(1500);

        const story = getDemoStory(params.theme, params.character, params.language, params.customPrompt);
        const totalSteps = story.pages.length + 2;

        setState(prev => ({
          ...prev,
          status: 'generating-images',
          progress: 1,
          totalSteps,
          currentStep: 'Creating cover illustration...',
          story,
        }));

        await sleep(1200);

        const coverUrl = COVER_PLACEHOLDER;
        setState(prev => ({
          ...prev,
          progress: 2,
          coverUrl,
          currentStep: 'Drawing page illustrations...',
        }));

        const imageUrls: string[] = [];
        for (let i = 0; i < story.pages.length; i++) {
          await sleep(800);
          imageUrls.push(PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]);

          setState(prev => ({
            ...prev,
            progress: i + 3,
            imageUrls: [...imageUrls],
            currentStep: `Drawing page ${i + 1} of ${story.pages.length}...`,
          }));
        }

        await sleep(500);

        setState(prev => ({
          ...prev,
          status: 'complete',
          progress: totalSteps,
          imageUrls,
          currentStep: 'Story complete!',
        }));

        return { story, imageUrls, coverUrl };
      }

      // Production mode: use real AI
      const { generateStoryText } = await import('../services/ai-gateway');
      const { generateCoverImage, generateStoryImage } = await import('../services/ai-gateway');

      const story = await generateStoryText(params);
      const totalImages = story.pages.length + 1;

      setState(prev => ({
        ...prev,
        status: 'generating-images',
        progress: 1,
        totalSteps: totalImages + 1,
        currentStep: 'Creating cover illustration...',
        story,
      }));

      const coverUrl = await generateCoverImage({
        title: story.title,
        theme: params.theme,
        character: params.character,
      });

      setState(prev => ({
        ...prev,
        progress: 2,
        coverUrl,
        currentStep: 'Drawing page illustrations...',
      }));

      const imageUrls: string[] = [];
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        try {
          const url = await generateStoryImage({
            prompt: page.imagePrompt,
            theme: params.theme,
            character: params.character,
          });
          imageUrls.push(url);
        } catch {
          imageUrls.push('');
        }

        setState(prev => ({
          ...prev,
          progress: i + 3,
          imageUrls: [...imageUrls],
          currentStep: `Drawing page ${i + 2} of ${story.pages.length}...`,
        }));
      }

      setState(prev => ({
        ...prev,
        status: 'complete',
        progress: totalImages + 1,
        imageUrls,
        currentStep: 'Story complete!',
      }));

      return { story, imageUrls, coverUrl };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        currentStep: 'Oops! Something went wrong.',
      }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      totalSteps: 0,
      currentStep: '',
      story: null,
      imageUrls: [],
      coverUrl: null,
      error: null,
    });
  }, []);

  return { ...state, generateFullStory, reset };
}
