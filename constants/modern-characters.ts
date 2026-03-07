export interface CharacterCategory {
  id: string;
  emoji: string;
  nameKey: string;
  descKey: string;
  ageGroup: 'all' | '3-5' | '5-7' | '7-10';
  characters: ModernCharacter[];
}

export interface ModernCharacter {
  id: string;
  name: string;
  emoji: string;
  nameKey: string;
  descKey: string;
  storyHook: string;
  visualDesc: string;
  isPremium: boolean;
}

export const CHARACTER_CATEGORIES: CharacterCategory[] = [
  // 1. Komik Hayvan Ailesi
  {
    id: 'funny-animals',
    emoji: '\u{1F43D}',
    nameKey: 'catFunnyAnimals',
    descKey: 'catFunnyAnimalsDesc',
    ageGroup: '3-5',
    characters: [
      {
        id: 'pamuk',
        name: 'Pamuk',
        emoji: '\u{1F437}',
        nameKey: 'charPamuk',
        descKey: 'charPamukDesc',
        storyHook: 'Pamuk is a cheerful little piglet who lives with her family on Sunny Farm. She loves jumping in puddles, baking cookies with her mom, and getting into silly situations with her baby brother Tombik. Stories are about everyday family adventures with humor and warmth.',
        visualDesc: 'A cute cartoon piglet with rosy cheeks, wearing a red dress, in a colorful farm setting, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'mavis',
        name: 'Mavi\u015F',
        emoji: '\u{1F415}',
        nameKey: 'charMavis',
        descKey: 'charMavisDesc',
        storyHook: 'Mavi\u015F is an energetic blue heeler puppy who loves playing games with her family. She has a little sister Boncuk and parents who always join their imaginative adventures. Dad loves playing silly games, Mom is creative and patient. Stories are about imagination, family play, and learning through fun.',
        visualDesc: 'An adorable blue-gray cartoon puppy with bright eyes, playing in a cozy family home, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'ceviz',
        name: 'Ceviz',
        emoji: '\u{1F43F}\uFE0F',
        nameKey: 'charCeviz',
        descKey: 'charCevizDesc',
        storyHook: 'Ceviz is a small, slightly clumsy squirrel who tries really hard but often makes funny mistakes. He lives in a big oak tree with his grandpa who tells the best stories. Despite his clumsiness, Ceviz always finds creative solutions. Stories are about perseverance, humor, and learning from mistakes.',
        visualDesc: 'A small brown cartoon squirrel with big eyes and a fluffy tail, looking determined but slightly clumsy, in a forest setting, storybook illustration style',
        isPremium: false,
      },
    ],
  },

  // 2. Kurtarma Ekibi
  {
    id: 'rescue-team',
    emoji: '\u{1F692}',
    nameKey: 'catRescueTeam',
    descKey: 'catRescueTeamDesc',
    ageGroup: '3-5',
    characters: [
      {
        id: 'pati-tim',
        name: 'Pati',
        emoji: '\u{1F415}\u200D\u{1F9BA}',
        nameKey: 'charPati',
        descKey: 'charPatiDesc',
        storyHook: 'Pati is the leader of the Paw Friends rescue team \u2014 a group of brave puppies who help anyone in trouble in Rainbow Valley. Each puppy has a special skill: Pati is the leader and firefighter, Bulut is the pilot, and Damla is the medic. Stories are about teamwork, courage, and helping others.',
        visualDesc: 'A brave cartoon German Shepherd puppy wearing a red rescue vest, standing heroically with a team badge, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'bulut',
        name: 'Bulut',
        emoji: '\u{1F681}',
        nameKey: 'charBulut',
        descKey: 'charBulutDesc',
        storyHook: 'Bulut is the flying ace of the Paw Friends team. This white fluffy poodle pilots a small rescue helicopter and is always the first to spot trouble from the sky. Bulut is brave but a little scared of thunder \u2014 which makes for funny moments during storm rescues.',
        visualDesc: 'A fluffy white cartoon poodle wearing aviator goggles and a blue pilot jacket, next to a small helicopter, storybook illustration style',
        isPremium: false, // V2: true
      },
      {
        id: 'yildiz-kaptan',
        name: 'Kaptan Y\u0131ld\u0131z',
        emoji: '\u{1F468}\u200D\u{1F692}',
        nameKey: 'charKaptanYildiz',
        descKey: 'charKaptanYildizDesc',
        storyHook: 'Captain Y\u0131ld\u0131z is a brave firefighter who protects Sunshine Town. She drives the big red fire truck, rescues kittens from trees, and teaches kids about safety. She always says "No problem is too big when we work together!" Stories are about bravery, safety lessons, and community.',
        visualDesc: 'A friendly female firefighter in cartoon style, wearing a yellow helmet with a star, waving from a red fire truck, storybook illustration style',
        isPremium: false, // V2: true
      },
    ],
  },

  // 3. Minik S\u00FCper Kahramanlar
  {
    id: 'mini-heroes',
    emoji: '\u{1F9B8}',
    nameKey: 'catMiniHeroes',
    descKey: 'catMiniHeroesDesc',
    ageGroup: '5-7',
    characters: [
      {
        id: 'gece-yildizi',
        name: 'Gece Y\u0131ld\u0131z\u0131',
        emoji: '\u{1F31F}',
        nameKey: 'charGeceYildizi',
        descKey: 'charGeceYildiziDesc',
        storyHook: 'By day, Elif is a regular 7-year-old. But when the moon rises, she transforms into Gece Y\u0131ld\u0131z\u0131 \u2014 a superhero who glows with starlight! Together with her teammates Ay G\u00F6lgesi (Moon Shadow) and F\u0131rt\u0131na (Storm), they protect the city from sneaky villains who steal dreams.',
        visualDesc: 'A 7-year-old girl superhero in a dark blue costume with golden stars, glowing with starlight, flying over a moonlit city, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'turbo-kanat',
        name: 'Turbo Kanat',
        emoji: '\u26A1',
        nameKey: 'charTurboKanat',
        descKey: 'charTurboKanatDesc',
        storyHook: 'Turbo Kanat is a kid with super speed wings that pop out of his sneakers when he says "R\u00FCzgar ol!" (Be the wind!). He is the fastest kid in the universe but sometimes his speed gets him into trouble \u2014 like accidentally running to another country! Stories are about using powers responsibly and friendship.',
        visualDesc: 'A cartoon boy with glowing speed wings on his sneakers, running super fast with motion lines, wearing a green and white hero suit, storybook illustration style',
        isPremium: false, // V2: true
      },
      {
        id: 'sihir-kedi',
        name: 'Sihir Kedi',
        emoji: '\u{1F431}',
        nameKey: 'charSihirKedi',
        descKey: 'charSihirKediDesc',
        storyHook: 'Sihir Kedi is a magical cat who can transform into any animal to save the day. She protects the Enchanted Garden from the mischievous Karanl\u0131k Ku\u015F (Dark Bird) who wants to make all flowers disappear. She teaches kids that even the smallest hero can make the biggest difference.',
        visualDesc: 'A magical cartoon cat with sparkly purple fur and a golden collar, transforming with magical sparkles around her, storybook illustration style',
        isPremium: false,
      },
    ],
  },

  // 4. B\u00FCy\u00FCl\u00FC Krall\u0131k
  {
    id: 'magic-royals',
    emoji: '\u{1F451}',
    nameKey: 'catMagicRoyals',
    descKey: 'catMagicRoyalsDesc',
    ageGroup: '5-7',
    characters: [
      {
        id: 'kar-prensesi',
        name: 'Kar Prensesi Aysu',
        emoji: '\u2744\uFE0F',
        nameKey: 'charKarPrensesi',
        descKey: 'charKarPrensesiDesc',
        storyHook: 'Princess Aysu has the magical power to create ice and snow. She lives in the Crystal Palace on top of Mount Beyaz. But her powers sometimes go out of control! With her brave sister G\u00FCne\u015F and their funny snowman friend Kartopu, she learns that true strength comes from love, not magic. Stories are about self-discovery, sisterly bond, and embracing who you are.',
        visualDesc: 'A young princess with silver-white hair in a sparkling ice-blue dress, with snowflakes swirling around her hands, standing in front of a crystal palace, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'cicek-prensesi',
        name: '\u00C7i\u00E7ek Prensesi Bahar',
        emoji: '\u{1F338}',
        nameKey: 'charCicekPrensesi',
        descKey: 'charCicekPrensesiDesc',
        storyHook: 'Princess Bahar can make flowers bloom and talk to plants. She lives in the Garden Kingdom where every season brings a new adventure. Her best friend is a talking chameleon named Renk who changes color with his emotions. Stories are about nature, creativity, and finding beauty in differences.',
        visualDesc: 'A young princess with flowers in her long brown hair, wearing a green and pink dress with flower patterns, surrounded by blooming flowers, storybook illustration style',
        isPremium: false, // V2: true
      },
      {
        id: 'yildiz-prensi',
        name: 'Y\u0131ld\u0131z Prensi Ege',
        emoji: '\u2728',
        nameKey: 'charYildizPrensi',
        descKey: 'charYildizPrensiDesc',
        storyHook: 'Prince Ege is not your typical prince \u2014 he would rather build inventions than sit on a throne. He has a magical telescope that lets him travel to the stars. With his robot friend \u00C7ark, he explores galaxies and solves problems with science and creativity, not swords. Stories are about curiosity, invention, and breaking stereotypes.',
        visualDesc: 'A young prince with messy brown hair, wearing a royal outfit with gear patterns, holding a glowing telescope, with a small robot companion, storybook illustration style',
        isPremium: false, // V2: true
      },
    ],
  },

  // 5. Dinozor D\u00FCnyas\u0131
  {
    id: 'dino-world',
    emoji: '\u{1F995}',
    nameKey: 'catDinoWorld',
    descKey: 'catDinoWorldDesc',
    ageGroup: 'all',
    characters: [
      {
        id: 'titi',
        name: 'Titi',
        emoji: '\u{1F995}',
        nameKey: 'charTiti',
        descKey: 'charTitiDesc',
        storyHook: 'Titi is a baby brachiosaurus who is the smallest in the herd but has the biggest heart. She is shy at first but brave when her friends need help. She loves flowers. Stories are about friendship, being brave despite being small, and prehistoric adventures.',
        visualDesc: 'An adorable small green baby brachiosaurus with big eyes and a friendly smile, in a lush prehistoric valley with volcanoes, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'dino-cerif',
        name: 'Dino \u015Eerif',
        emoji: '\u{1F920}',
        nameKey: 'charDinoCerif',
        descKey: 'charDinoCerifDesc',
        storyHook: 'Sheriff Dino is a cowgirl who runs a ranch in a world where kids and dinosaurs live together. She rides a friendly velociraptor named R\u00FCzgar, herds baby triceratops, and protects the ranch from the sneaky egg-stealing Dilo Gang. Stories are about responsibility, animal care, and Wild West adventures with dinosaurs.',
        visualDesc: 'A cartoon cowgirl kid with a cowboy hat riding a friendly velociraptor, on a colorful ranch with baby dinosaurs, storybook illustration style',
        isPremium: false, // V2: true
      },
    ],
  },

  // 6. Uzay Maceras\u0131
  {
    id: 'space-adventure',
    emoji: '\u{1F680}',
    nameKey: 'catSpaceAdventure',
    descKey: 'catSpaceAdventureDesc',
    ageGroup: '5-7',
    characters: [
      {
        id: 'uzay-ece',
        name: 'Uzay Ece',
        emoji: '\u{1F469}\u200D\u{1F680}',
        nameKey: 'charUzayEce',
        descKey: 'charUzayEceDesc',
        storyHook: 'Space Cadet Ece is a 6-year-old astronaut-in-training at the Galactic Kids Academy. She flies a small spaceship called Y\u0131ld\u0131z Kay\u0131\u011F\u0131 with her alien best friend Zib (a small green creature who speaks in rhymes). They explore planets, help alien friends, and learn about the universe.',
        visualDesc: 'A 6-year-old girl astronaut in a colorful space suit, standing next to a small friendly green alien, with a rocket ship behind them, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'robot-can',
        name: 'Robot Can',
        emoji: '\u{1F916}',
        nameKey: 'charRobotCan',
        descKey: 'charRobotCanDesc',
        storyHook: 'Robot Can is a small robot built by a kid inventor. He is learning to understand human emotions and often gets confused in funny ways \u2014 like thinking rain is the sky crying or that hiccups mean you are broken. Stories are about empathy, emotions, and the funny side of learning to be human.',
        visualDesc: 'A small cute round robot with big digital eyes showing emotions, with a tiny heart light on his chest, in a futuristic kids room, storybook illustration style',
        isPremium: false,
      },
    ],
  },

  // 7. M\u00FCzik & Dans
  {
    id: 'music-dance',
    emoji: '\u{1F3B5}',
    nameKey: 'catMusicDance',
    descKey: 'catMusicDanceDesc',
    ageGroup: '3-5',
    characters: [
      {
        id: 'nota',
        name: 'Nota',
        emoji: '\u{1F3B6}',
        nameKey: 'charNota',
        descKey: 'charNotaDesc',
        storyHook: 'Nota is a magical musical note who comes alive when children sing. She lives in Melody Land where everything makes music \u2014 flowers chime, rivers hum, and trees whistle. Each story has a rhythmic, song-like quality with repeated fun phrases kids can say along. Stories are about rhythm, sound, and the joy of music.',
        visualDesc: 'A cute personified musical note character with big eyes, arms and legs, dancing in a colorful land where flowers are shaped like instruments, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'minik-dalga',
        name: 'Minik Dalga',
        emoji: '\u{1F988}',
        nameKey: 'charMinikDalga',
        descKey: 'charMinikDalgaDesc',
        storyHook: 'Minik Dalga is a tiny, friendly baby shark who lives in Coral City under the sea. She loves singing and every adventure has a catchy rhythm. She explores the ocean with her family \u2014 Mama Dalga, Papa Dalga, and wise Grandma Dalga. Stories have repeating fun lines that kids love to say out loud.',
        visualDesc: 'An adorable tiny cartoon baby shark with big sparkling eyes and a friendly smile, swimming in a colorful coral reef city, storybook illustration style',
        isPremium: false, // V2: true
      },
    ],
  },

  // 8. Bilim & Ke\u015Fif
  {
    id: 'science-explore',
    emoji: '\u{1F52C}',
    nameKey: 'catScienceExplore',
    descKey: 'catScienceExploreDesc',
    ageGroup: '7-10',
    characters: [
      {
        id: 'deney-defne',
        name: 'Deney Defne',
        emoji: '\u{1F469}\u200D\u{1F52C}',
        nameKey: 'charDeneyDefne',
        descKey: 'charDeneyDefneDesc',
        storyHook: 'Defne is a 9-year-old scientist who has a secret lab in her attic. She asks questions about everything and builds experiments to find answers. Her lab notebook is full of hypotheses. Her pet hamster Professor F\u0131nd\u0131k is her lab assistant. Stories teach real science through fun adventures and always end with a mind-blowing fact.',
        visualDesc: 'A 9-year-old girl with safety goggles on her head, a lab coat, holding a bubbling test tube, with a hamster on her shoulder, in a colorful attic lab, storybook illustration style',
        isPremium: false,
      },
      {
        id: 'kodcu-kaan',
        name: 'Kodcu Kaan',
        emoji: '\u{1F4BB}',
        nameKey: 'charKodcuKaan',
        descKey: 'charKodcuKaanDesc',
        storyHook: 'Kaan is a young coder who can bring his code to life! When he writes programs on his magical tablet, the characters jump out of the screen into the real world. But bugs in his code cause funny glitches \u2014 like making it rain pizza or turning gravity upside down. Stories are about problem-solving, coding logic, and creative thinking.',
        visualDesc: 'A cartoon boy with glasses typing on a glowing tablet, with colorful code characters jumping out of the screen around him, storybook illustration style',
        isPremium: false, // V2: true
      },
    ],
  },

  // 9. Korsan Hazinesi
  {
    id: 'pirate-treasure',
    emoji: '\u{1F3F4}\u200D\u2620\uFE0F',
    nameKey: 'catPirateTreasure',
    descKey: 'catPirateTreasureDesc',
    ageGroup: 'all',
    characters: [
      {
        id: 'kaptan-firtina',
        name: 'Kaptan F\u0131rt\u0131na',
        emoji: '\u{1F3F4}\u200D\u2620\uFE0F',
        nameKey: 'charKaptanFirtina',
        descKey: 'charKaptanFirtinaDesc',
        storyHook: 'Captain F\u0131rt\u0131na is a young pirate captain who sails the Seven Candy Seas on her ship "G\u00F6kku\u015Fa\u011F\u0131". She does not steal treasure \u2014 she solves riddles and puzzles to find magical treasures that help people. Her crew includes Papa\u011Fan (a sarcastic parrot) and Ahtapot Ali (a friendly octopus first mate). Stories are about adventure, puzzles, and doing the right thing.',
        visualDesc: 'A young girl pirate captain with a colorful bandana, standing on a rainbow-colored pirate ship, with a parrot on her shoulder and an octopus friend, storybook illustration style',
        isPremium: false,
      },
    ],
  },

  // 10. Minik Do\u011Fa
  {
    id: 'tiny-nature',
    emoji: '\u{1F41E}',
    nameKey: 'catTinyNature',
    descKey: 'catTinyNatureDesc',
    ageGroup: 'all',
    characters: [
      {
        id: 'ula',
        name: 'U\u011Fur B\u00F6ce\u011Fi Ula',
        emoji: '\u{1F41E}',
        nameKey: 'charUla',
        descKey: 'charUlaDesc',
        storyHook: 'Ula is a tiny ladybug explorer who discovers that a garden is a whole universe. A single flower is a mountain, a puddle is an ocean, and a spider web is a castle. With her friends Kar\u0131nca Kara (a strong ant) and Kelebek R\u00FCya (a dreamy butterfly), she goes on micro-adventures. Stories are about nature, perspective, and appreciating small wonders.',
        visualDesc: 'An adorable cartoon ladybug with big eyes wearing a tiny explorer hat, in a macro close-up garden world where flowers look like trees, storybook illustration style',
        isPremium: false,
      },
    ],
  },
];
