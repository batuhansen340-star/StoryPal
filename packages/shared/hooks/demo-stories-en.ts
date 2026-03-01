import type { StoryGenerationResponse } from '../types';

type DemoStories = Record<string, Record<string, StoryGenerationResponse>>;

export const DEMO_STORIES_EN: DemoStories = {
  space: {
    luna: {
      title: 'Luna and the Lost Star Dragon',
      pages: [
        {
          text: 'Luna loved looking at the stars every night from her bedroom window. She knew every constellation by heart — the Big Bear, the Little Fish, and her favorite, the Star Dragon. But tonight, something was different. The Star Dragon constellation was missing one star, and a tiny light was falling through the sky like a golden tear.',
          imagePrompt: 'young girl with brown hair gazing out bedroom window at starry night sky, one star falling like a golden tear, warm bedroom with star decorations, children\'s book watercolor style, soft moonlight',
        },
        {
          text: '"I have to help!" Luna whispered. She grabbed her old cardboard telescope and tiptoed to the garden. There, sitting on the roses, was the tiniest dragon she had ever seen. It was made of pure starlight, and it was shaking. "Are you okay?" Luna asked softly. The little dragon looked up with shimmering eyes. "I... I fell," it squeaked.',
          imagePrompt: 'tiny glowing star dragon sitting on roses in moonlit garden, young girl kneeling beside it with cardboard telescope, dragon made of golden starlight, warm gentle scene, children\'s book illustration',
        },
        {
          text: '"My name is Cosmo," the little dragon said, wrapping its tiny tail around Luna\'s finger. "I was playing too close to the edge of our constellation, and I slipped. Now I can\'t find my way back." A single crystal tear rolled down Cosmo\'s cheek and turned into a tiny diamond on the grass. Luna felt her heart squeeze tight.',
          imagePrompt: 'small star dragon wrapping tail around girl\'s finger, crystal tear turning into diamond on grass, emotional tender moment, soft starlight glow, children\'s book watercolor',
        },
        {
          text: '"Don\'t worry, Cosmo. I\'ll help you get home," Luna said with a brave smile. She looked up at the sky and had an idea. She ran to her father\'s workshop and found an old wooden ladder, some balloons, and a jar of fireflies. "If we can\'t fly to the stars, we\'ll build a way up!" she declared.',
          imagePrompt: 'determined girl gathering supplies in workshop, wooden ladder, colorful balloons, jar of glowing fireflies, star dragon on her shoulder, warm workshop lighting, children\'s book style',
        },
        {
          text: 'Together, they tied ninety-nine balloons to the ladder and opened the jar of fireflies to light their path. Slowly, magically, they began to rise. The garden got smaller. The houses got smaller. The whole town became a tiny quilt of lights below them. "We\'re flying!" Cosmo giggled, doing backflips in the air. Luna laughed so hard her tummy hurt.',
          imagePrompt: 'girl and star dragon floating upward on balloon-covered ladder, fireflies lighting the path, town below becoming tiny, night sky full of stars, magical whimsical scene, joyful expressions, children\'s book illustration',
        },
        {
          text: 'But when they reached the clouds, a strong wind began to blow. WHOOSH! The balloons started popping — one, two, three! "Hold on!" Luna cried, gripping the ladder tight. Cosmo\'s glow flickered with fear. They were spinning and tumbling through the cold, dark clouds. Luna closed her eyes and held Cosmo close. "I won\'t let you fall again," she promised.',
          imagePrompt: 'dramatic scene of girl holding ladder in strong wind among dark clouds, balloons popping, star dragon held close to her chest, wind blowing hair, tense brave moment, dynamic children\'s book illustration',
        },
        {
          text: 'Then something wonderful happened. Cosmo began to glow brighter and brighter — so bright that the dark clouds melted away like cotton candy. "Luna, look! Your bravery made my magic come back!" Cosmo spread its tiny wings, and for the first time, it could really fly. It grabbed Luna\'s hand, and together they soared past the moon, through a river of shooting stars, all the way to the Star Dragon constellation.',
          imagePrompt: 'brilliant glowing star dragon flying alongside girl through space, passing the moon, river of shooting stars behind them, dark clouds dissolving into light, triumphant magical moment, vibrant colors, children\'s book watercolor',
        },
        {
          text: 'The other star dragons cheered as Cosmo returned to its place in the sky. "Thank you, Luna," Cosmo said, nuzzling her cheek. "You taught me that being brave doesn\'t mean not being scared. It means helping someone even when you are." Back in her bed, Luna looked up at the constellation. The Star Dragon was complete again, and she could swear the smallest star winked at her. "Goodnight, Cosmo," she whispered. And the star twinkled back.',
          imagePrompt: 'star dragons in constellation welcoming small dragon back, girl back in bed looking at complete constellation through window, smallest star twinkling, warm emotional ending, children\'s book illustration',
        },
      ],
    },
    default: {
      title: "The Starkeeper's Broken Lantern",
      pages: [
        {
          text: 'Far above the clouds, where the sky turns from blue to black, there lives an old woman called the Starkeeper. Every evening, she lights her great lantern and hangs it on the tallest hook in the universe. The lantern\'s glow keeps every star shining bright. But one morning, the Starkeeper woke up to find her lantern cracked right down the middle.',
          imagePrompt: 'elderly woman with white hair in cozy house floating in space, large cracked glowing lantern, stars dimming around her, star maps on walls, children\'s book watercolor',
        },
        {
          text: '"Oh no, oh no," she whispered, holding the broken pieces. Without the lantern, the stars would go dark one by one. Already, the edges of the Milky Way were starting to fade. She needed stardust to fix the crack, but the last stardust mine was at the bottom of the Comet River — a place she was too old to reach alone.',
          imagePrompt: 'worried elderly woman holding broken lantern pieces, stars fading in background, Milky Way growing dim, river of comets in distance, melancholy beautiful scene, children\'s book illustration',
        },
        {
          text: 'Just then, a knock came at her door. A young explorer floated outside, wearing a helmet made from a fishbowl and boots tied with ribbon. "I saw the stars going out!" the explorer said breathlessly. "Can I help?" The Starkeeper smiled for the first time all day. "You\'ll need courage, little one. The Comet River is wild and unpredictable."',
          imagePrompt: 'young child in makeshift space suit with fishbowl helmet and ribbon boots, floating at doorway of Starkeeper\'s house, elderly woman smiling, starry dimming background, children\'s book style',
        },
        {
          text: 'Together they set off in the Starkeeper\'s old rowboat — yes, a rowboat, floating through space! They paddled past sleeping planets and tiptoed around a grumpy asteroid who didn\'t like visitors. "Shh," the Starkeeper whispered. "Old Grumbles throws rocks when he\'s bothered." They held their breath and glided past without a sound.',
          imagePrompt: 'old woman and child in wooden rowboat floating through space, sleepy planets with closed eyes, grumpy asteroid with annoyed face, whimsical funny scene, children\'s book watercolor',
        },
        {
          text: 'The Comet River roared with light and speed. Comets zoomed past like fiery fish, leaving trails of sparkling dust. "There!" the Starkeeper pointed to a glowing cave beneath the river. "The stardust is inside, but the current is too strong for me." The explorer took a deep breath. "I can do it," they said, though their knees were shaking.',
          imagePrompt: 'river of bright comets streaming through space, glowing blue cave beneath, child looking determined but nervous, elderly woman watching with hope, dramatic lighting, sparkling dust, children\'s book illustration',
        },
        {
          text: 'The explorer dove into the Comet River. The current pulled and pushed, but they kicked hard and swam deeper. Inside the cave, crystals of stardust covered every surface like frozen rainbows. They filled their pockets, but suddenly — CRACK! The cave ceiling began to fall. The explorer grabbed one last handful and pushed off the wall, swimming faster than ever.',
          imagePrompt: 'child swimming through swirling comet current, cave filled with rainbow stardust crystals, ceiling cracking dramatically, determined expression, glowing particles, action scene, children\'s book watercolor',
        },
        {
          text: 'They burst out of the river just in time, gasping and laughing. "You did it!" the Starkeeper cried, catching them in a warm hug. Back at the house, they sprinkled the stardust over the lantern\'s crack. It glowed, it hummed, and then — FLASH! The lantern blazed brighter than ever before. All across the universe, stars flickered back to life.',
          imagePrompt: 'child bursting from comet river covered in sparkles, elderly woman hugging them, then sprinkling stardust on lantern which blazes bright, stars reigniting across sky, warm golden light, children\'s book illustration',
        },
        {
          text: 'The Starkeeper hung the lantern back on its hook and sighed happily. "You know," she said, "this lantern has been mine for three hundred years. But I think it\'s time to pass it on." She placed a tiny star-shaped key in the explorer\'s hand. "Come visit me anytime. The stars will always light your way home." And from that night on, the stars never shone brighter.',
          imagePrompt: 'elderly woman handing glowing star-shaped key to young explorer, repaired lantern shining brilliantly on hook, stars twinkling everywhere, warm emotional farewell, children\'s book watercolor, peaceful ending',
        },
      ],
    },
  },
  ocean: {
    whiskers: {
      title: 'Whiskers and the Pearl of Dreams',
      pages: [
        {
          text: 'Whiskers the magic cat loved napping on the beach, but today the waves brought something unexpected. A tiny bottle washed ashore with a note inside: "HELP! The Pearl of Dreams has been stolen. Without it, no ocean creature can dream tonight. Please come to the Coral Palace. — Queen Coral." Whiskers stretched and said, "Well, a hero\'s work is never done."',
          imagePrompt: 'orange magical cat on sunny beach finding small bottle in waves, note visible inside, curious expression, tropical beach with palm trees, gentle waves, children\'s book watercolor',
        },
        {
          text: 'With one mighty leap, Whiskers splashed into the ocean. Instantly, golden bubbles surrounded the cat, allowing it to breathe underwater. "Magic does come in handy," Whiskers purred. A little seahorse named Pip appeared, trembling with worry. "Oh, thank goodness you came! I\'ll take you to the Queen. But we must hurry — sunset is in three hours!"',
          imagePrompt: 'magic cat surrounded by golden bubbles underwater, tiny worried seahorse beside it, colorful coral and fish in background, sunlight from above, magical undersea atmosphere, children\'s book watercolor',
        },
        {
          text: 'They swam through the Coral Forest, where trees made of pink and purple coral swayed in the current. Whiskers noticed something odd — all the fish looked tired, their eyes drooping. "Without the Pearl of Dreams, nobody slept last night," Pip explained. "The babies haven\'t stopped crying, and the old fish can barely swim."',
          imagePrompt: 'cat and seahorse swimming through pink and purple coral trees, tired fish with drooping eyes, baby fish crying with tiny tear bubbles, beautiful underwater forest, children\'s book illustration',
        },
        {
          text: 'Queen Coral sat on her throne of pearls, looking exhausted. "The pearl was taken by Shade, the moody octopus in the Dark Trench," she said. "He\'s not evil — just lonely. Nobody visits him because his cave is so dark." Whiskers nodded wisely. "Sometimes the ones who cause trouble are the ones who need a friend the most."',
          imagePrompt: 'beautiful coral queen on pearl throne looking tired, cat and seahorse listening, grand underwater palace with shell decorations, soft blue lighting, children\'s book watercolor',
        },
        {
          text: 'Whiskers and Pip dove deeper until the water turned from blue to navy to black. Strange glowing creatures drifted past — jellyfish like floating lanterns and tiny fish with built-in flashlights. "I\'m scared," Pip whispered. Whiskers wrapped a warm tail around the seahorse. "Being scared just means you\'re being brave," the cat said gently.',
          imagePrompt: 'cat and seahorse descending into dark deep ocean, bioluminescent jellyfish and anglerfish providing eerie beautiful light, transition from blue to dark, seahorse clinging to cat, children\'s book illustration',
        },
        {
          text: 'At the bottom of the Dark Trench, they found Shade the octopus curled around the glowing Pearl of Dreams. "Go away," Shade mumbled. "This is the only thing that makes me feel less alone. When I hold it, I can dream about having friends." A tear rolled from his big eye. Whiskers sat down right next to him.',
          imagePrompt: 'large purple octopus curled around glowing iridescent pearl at bottom of dark trench, sad expression with tear, soft pearl light on his face, emotional touching scene, children\'s book watercolor',
        },
        {
          text: '"What if I told you that you don\'t need the pearl to have friends?" Whiskers said. "What if I told you that I\'d like to be your friend right now?" Shade blinked in surprise. Nobody had ever said that to him before. Slowly, one tentacle at a time, he let go of the pearl. "Really?" he asked. "Do you promise?"',
          imagePrompt: 'magic cat sitting beside octopus offering paw in friendship, octopus looking surprised and hopeful, slowly releasing glowing pearl, warm light between them, moment of trust, children\'s book illustration',
        },
        {
          text: 'Together, they brought the Pearl of Dreams back to the Coral Palace. Queen Coral placed it on its pedestal, and instantly, warm golden light spread through the entire ocean. Every fish yawned happily. Every baby seahorse closed its eyes and smiled. And Shade? He got the biggest room in the palace and more visitors than he could count. That night, everyone had the sweetest dreams.',
          imagePrompt: 'glowing pearl on pedestal sending golden light through ocean, happy fish yawning, baby seahorses sleeping peacefully, octopus surrounded by new friends, cat purring, warm joyful ending, children\'s book watercolor',
        },
      ],
    },
    default: {
      title: 'The Song of the Silver Whale',
      pages: [
        {
          text: 'Every evening, the Silver Whale would rise to the surface and sing. Her song was so beautiful that the waves would calm, the clouds would pause, and even the moon would lean closer to listen. Sailors called it "The Lullaby of the Sea." But one day, the Silver Whale stopped singing. The ocean grew restless, and nobody knew why.',
          imagePrompt: 'magnificent silver whale breaching ocean surface at sunset, musical notes flowing from mouth, calm waves, moon leaning close, sailors on distant ships, magical twilight, children\'s book watercolor',
        },
        {
          text: 'A young child who lived in a lighthouse noticed the silence first. "Mama, the whale isn\'t singing tonight," they said. Their mother sighed. "She hasn\'t sung in a week. The fishermen say the ocean is getting rougher." That night, the child wrote a note on a paper boat: "Dear Whale, are you okay? I miss your songs."',
          imagePrompt: 'child at top of lighthouse looking at quiet dark ocean, mother standing behind worried, child writing note on paper boat by candlelight, lighthouse beam cutting through darkness, children\'s book illustration',
        },
        {
          text: 'At dawn, they set the paper boat on the water. Hours later, a great shadow appeared beneath the surface, and the Silver Whale rose with the paper boat balanced on her nose. "You\'re the first person who asked," the whale said in a voice like a deep bell. "Everyone loves my song, but nobody noticed I was sad."',
          imagePrompt: 'huge silver whale rising from ocean with tiny paper boat on nose, child on shore rocks looking up in awe, morning light sparkling on water, whale eye gentle and sad, children\'s book watercolor',
        },
        {
          text: '"What made you sad?" the child asked. The whale\'s great eye blinked slowly. "I sing every night, but I sing alone. No one ever sings with me. The loneliest sound in the world is an echo of your own voice with nobody to answer." A single whale-sized tear dropped into the ocean, making the water shimmer.',
          imagePrompt: 'child sitting on coastal rocks talking to enormous silver whale, whale\'s large gentle eye visible, huge tear creating shimmering ripples, intimate conversation, children\'s book illustration',
        },
        {
          text: 'The child thought hard. They couldn\'t match a whale\'s voice — they were small, and their singing was a bit wobbly. But then they had an idea. They ran back to the village and knocked on every door. "The whale needs us to sing with her! Will you come?" One by one, the villagers grabbed instruments — guitars, drums, flutes, and bells.',
          imagePrompt: 'excited child running through coastal village knocking on doors, villagers coming out with instruments, warm village with colorful houses, enthusiasm and community spirit, children\'s book watercolor',
        },
        {
          text: 'That evening, the whole village stood on the cliff above the ocean. The child counted: "One, two, three!" They began to play and sing — a joyful, messy, imperfect chorus. The drummer was too fast. The flute player squeaked. But it was real, and it was together. It was the most beautiful kind of music there is.',
          imagePrompt: 'entire village on cliff playing music toward ocean at sunset, child conducting, mix of instruments and singing people, joyful imperfect musical chaos, orange pink sky, children\'s book illustration',
        },
        {
          text: 'Deep beneath the waves, the Silver Whale heard the music. Her heart, which had felt so heavy, suddenly felt light. She rose to the surface and sang. Her voice joined the village\'s song, creating the most incredible melody the world had ever heard. Fish leaped from the water. Stars appeared early. The moon rushed to its place in the sky.',
          imagePrompt: 'silver whale singing at surface, musical notes interweaving with village music from cliff, fish leaping joyfully, stars appearing in bright sky, moon rushing into view, magical musical moment, children\'s book watercolor',
        },
        {
          text: 'From that night on, the Silver Whale was never lonely again. Every evening, the village would come to the cliff to sing, and the whale would rise and join them. Some nights it was loud and joyful. Some nights it was soft and gentle. But it was always together. The child learned something important: the best songs aren\'t perfect — they\'re the ones that are shared.',
          imagePrompt: 'peaceful evening, villagers on cliff and whale in calm ocean, soft music floating between them, warm golden sunset, community and whale in harmony, child smiling, stars twinkling, children\'s book watercolor',
        },
      ],
    },
  },
  forest: {
    clover: {
      title: 'Clover and the Golden Acorn',
      pages: [
        {
          text: 'In the heart of Willow Woods stood the Great Oak — the oldest, tallest tree in the forest. Its branches sheltered birds, its roots fed mushrooms, and its leaves whispered stories to anyone who listened. But this morning, Clover the bunny noticed something terrible. The Great Oak\'s leaves were turning grey, and its branches drooped like tired arms. "The Great Oak is sick!" Clover cried.',
          imagePrompt: 'large majestic oak tree with leaves turning grey and branches drooping, small worried bunny at base looking up, forest animals noticing, morning forest light, children\'s book watercolor',
        },
        {
          text: 'Professor Bristle the hedgehog examined the tree with his tiny spectacles. "The Great Oak needs a Golden Acorn," he said solemnly. "It\'s the only cure. But the last Golden Acorn grows at the very top of Cloud Mountain, past the Fog Maze and across the Wobbly Bridge." He looked at Clover. "It\'s a dangerous journey for a small bunny."',
          imagePrompt: 'elderly hedgehog with tiny round spectacles examining sick tree trunk, small bunny listening intently, woodland creatures gathered worried, forest clearing with dappled sunlight, children\'s book illustration',
        },
        {
          text: '"I don\'t care how small I am!" Clover said, puffing up her fluffy chest. "The Great Oak read me stories when I was a baby. It kept me dry in the rain. I\'m going." A tiny firefly named Flicker buzzed up. "I\'ll come too! I can light the way through the dark parts." Together, the bunny and the firefly set off at sunrise.',
          imagePrompt: 'determined small bunny with puffed chest standing bravely, tiny glowing firefly beside, animals waving goodbye at forest edge, sunrise lighting path ahead, warm encouraging atmosphere, children\'s book watercolor',
        },
        {
          text: 'The Fog Maze was exactly as scary as it sounded. Thick white fog covered everything, making it impossible to see. Strange sounds echoed — was that a growl? No, just a toad clearing his throat. Clover bumped into three dead ends and almost fell into a puddle twice. But Flicker buzzed ahead, leaving a trail of golden light. "Follow my sparkle!"',
          imagePrompt: 'small bunny navigating through thick white fog in forest maze, tiny firefly creating trail of golden sparkles, mysterious shadows in fog, toad on log, atmospheric slightly spooky but safe, children\'s book watercolor',
        },
        {
          text: 'They found the Wobbly Bridge — a rope bridge stretched across a rushing river far below. With every step, it swayed and creaked. "Don\'t look down!" Flicker advised. Clover looked down. Her legs turned to jelly. "I can\'t do it," she whispered. Flicker landed on her nose. "Yes you can. One hop at a time."',
          imagePrompt: 'rickety rope bridge over deep gorge with rushing river below, small bunny frozen in middle looking scared, tiny firefly on bunny\'s nose encouraging, dramatic perspective showing height, children\'s book illustration',
        },
        {
          text: 'One hop. Two hops. Three. The bridge wobbled but held. Clover reached the other side and collapsed in a laughing, relieved heap. But rain began to pour, and the mountain path became slippery. Cold and wet, Clover huddled under a mushroom. "Maybe I\'m not brave enough after all," she sniffled.',
          imagePrompt: 'bunny collapsed in relief on other side of bridge, then huddled sadly under large mushroom in heavy rain, firefly sheltering beside, muddy mountain path, moment of doubt, children\'s book watercolor',
        },
        {
          text: 'Flicker glowed as bright as possible. "Remember why you\'re here," the firefly said softly. "The Great Oak needs you. All those birds need their home." Clover wiped her eyes with her ear. She stood up, mud dripping from her tail, and climbed. Step by step, through the rain, until she saw it — the Golden Acorn, glowing like a tiny sun at the very top.',
          imagePrompt: 'bunny climbing muddy mountain path in rain with determined expression, firefly glowing brightly beside, at summit seeing magnificent golden glowing acorn, breakthrough moment, rain stopping, children\'s book illustration',
        },
        {
          text: 'Clover carried the Golden Acorn all the way home. When she pressed it into the Great Oak\'s roots, the most beautiful thing happened. Color flowed back into every leaf, every branch reached for the sky, and flowers bloomed along every root. The whole forest cheered. The Great Oak rustled its leaves — which sounded exactly like applause — and whispered, "The smallest heroes have the biggest hearts."',
          imagePrompt: 'bunny pressing golden acorn into tree roots, color and life flowing back into great oak, leaves turning vibrant green, flowers blooming, forest animals cheering, magical restoration, warm golden light, children\'s book watercolor',
        },
      ],
    },
    default: {
      title: 'The Firefly Festival',
      pages: [
        {
          text: 'Deep in the enchanted forest, where sunlight danced through the leaves like golden confetti, something magical was about to happen. Every year on the longest day, the woodland creatures held the Firefly Festival — a celebration of light, friendship, and summer. But this year, the organizer, a busy squirrel named Hazel, was in a complete panic.',
          imagePrompt: 'enchanted forest with golden sunlight through green leaves, panicked squirrel with clipboard surrounded by decorations, woodland creatures busy working, festive atmosphere, children\'s book watercolor',
        },
        {
          text: '"The Light Crystal is missing!" Hazel cried, climbing up and down every tree. The Light Crystal was a special gem that made every firefly glow ten times brighter. Without it, the festival would be just... dark. A young deer spoke up shyly: "Maybe we should look for it together?"',
          imagePrompt: 'distressed squirrel pointing at empty branch on decorated tree, various forest animals gathered, deer speaking shyly, festival decorations half-finished, warm forest clearing, children\'s book illustration',
        },
        {
          text: 'They split into search parties. The rabbits checked the burrows. The birds scanned from the sky. The young deer wandered deeper into the forest, following a trail of tiny sparkles on the ground. "Hello?" the deer called. A soft giggle echoed from behind a mushroom the size of a house.',
          imagePrompt: 'young deer following trail of sparkles on forest floor, approaching enormous mushroom, deep enchanted forest with oversized mushrooms and ferns, magical atmosphere with floating dust motes, children\'s book watercolor',
        },
        {
          text: 'Behind the mushroom sat a fox cub, no bigger than a kitten, playing with the Light Crystal like it was a toy ball. "Pretty light! Pretty light!" the cub sang. The deer\'s heart softened. "That is pretty," the deer agreed. "But it belongs to the whole forest. Tonight is the Firefly Festival, and everyone needs its light."',
          imagePrompt: 'tiny adorable fox cub playing with glowing crystal behind giant mushroom, young deer looking with gentle understanding, crystal casting rainbow light patterns, soft moss floor, tender scene, children\'s book illustration',
        },
        {
          text: 'The fox cub\'s ears drooped. "But I don\'t have anything pretty. I found it, and it made me feel special." The deer thought for a moment. "What if I brought you to the festival? You\'ve never been, have you?" The cub\'s eyes went wide. "I didn\'t think I was invited. The other animals don\'t talk to me because foxes make them nervous."',
          imagePrompt: 'sad fox cub with drooped ears holding crystal, deer bending down to cub\'s level speaking kindly, emotional moment of connection, soft forest light, expressions of vulnerability, children\'s book watercolor',
        },
        {
          text: '"Then tonight, you\'ll be my guest," the deer said firmly. Together, they carried the Light Crystal back. Hazel the squirrel nearly fell out of the tree with relief. "You found it! And who\'s this?" "This is my new friend," the deer said. "She found the crystal. She\'s our hero."',
          imagePrompt: 'deer and fox cub returning with glowing crystal, squirrel dramatically relieved almost falling from branch, animals watching curiously, festival tree in background, warm golden hour lighting, children\'s book illustration',
        },
        {
          text: 'When night fell, the Light Crystal was placed on top of the festival tree. It sent a beam of light into the sky, and thousands of fireflies rose from the grass, glowing brighter than anyone had ever seen. The forest became a cathedral of living light. Music started — crickets on violins, frogs on drums, and a nightingale singing the melody.',
          imagePrompt: 'magnificent festival tree with glowing crystal on top, thousands of fireflies rising and glowing brilliantly, forest illuminated by living light, cricket and frog musicians, nightingale singing, magical celebration, children\'s book watercolor',
        },
        {
          text: 'The fox cub danced under the fireflies, laughing and spinning until she was dizzy. For the first time, the other animals didn\'t see a fox — they saw a friend. The deer watched and smiled. Sometimes the best festivals aren\'t about the lights or the music. They\'re about making sure everyone has a seat at the celebration. And from that year on, every creature was welcome.',
          imagePrompt: 'happy fox cub dancing among fireflies, surrounded by smiling woodland animals, deer watching proudly, glowing festival all around, warm inclusive atmosphere, all creatures celebrating together, beautiful ending, children\'s book watercolor',
        },
      ],
    },
  },
};

export const INTERACTIVE_DEMO: StoryGenerationResponse = {
  title: "Luna's Space Choice",
  pages: [
    {
      text: 'Luna floated through space in her little rocket ship, humming a song her grandmother taught her. The stars twinkled like a million tiny candles. Suddenly, through the window, she spotted something amazing — two strange and beautiful planets she had never seen before. Her heart raced with excitement.',
      imagePrompt: 'girl floating in cozy rocket ship through space, stars twinkling like candles, two colorful planets visible through window, excited expression, warm interior, children\'s book watercolor',
    },
    {
      text: 'One planet glowed deep purple and hummed with the most enchanting music Luna had ever heard. Melodies drifted through space like invisible ribbons. The other planet sparkled bright green, covered in dancing lights that swirled and twirled in mesmerizing patterns. Both were magical. But Luna could only visit one. Which should she choose?',
      imagePrompt: 'purple musical planet with visible sound waves and green sparkling planet with dancing lights, side by side in space, girl in rocket between them looking at both, magical contrasting planets, children\'s book illustration',
      choices: [
        { id: 'purple', emoji: '\u{1F7E3}', text: 'Visit the Purple Planet', nextPageIndex: 2 },
        { id: 'green', emoji: '\u{1F7E2}', text: 'Visit the Green Planet', nextPageIndex: 4 },
      ],
    },
    {
      text: 'On the Purple Planet, musical flowers sang Luna\'s favorite songs in perfect harmony! Each petal was a different note, and when the wind blew, the whole meadow became an orchestra. Flower creatures with petal wings danced around her, inviting Luna to join. She twirled and leaped, and the flowers matched every move with music.',
      imagePrompt: 'girl dancing with singing flowers on purple planet, each flower petal a different color representing musical notes, flower creatures with petal wings, meadow orchestra, joyful dance scene, children\'s book watercolor',
    },
    {
      text: 'The flowers wove their most beautiful melody into a tiny crystal music box and placed it in Luna\'s hands. "This melody will help you whenever you feel lost or scared," the flower queen said with a gentle smile. "Just open the box, and our song will guide you home." Luna hugged the music box tight. What a wonderful musical adventure!',
      imagePrompt: 'girl receiving glowing crystal music box from flower queen, other flowers watching happily, soft purple light, magical gift-giving moment, warm and enchanting, children\'s book illustration',
    },
    {
      text: 'On the Green Planet, millions of friendly light-bugs created the most amazing shapes in the sky — castles, dragons, even Luna\'s own face made entirely of twinkling green light! They zoomed around her giggling, leaving trails of emerald sparkles. "Watch this!" they said, and painted a whole story across the sky just for her.',
      imagePrompt: 'girl watching light bugs creating glowing shapes in green sky, castles and dragons made of light, bugs zooming around her with emerald sparkle trails, wonder and amazement, children\'s book watercolor',
    },
    {
      text: 'The light-bugs taught Luna how to paint with light using her own fingertips. She reached out her hand, and streams of green and gold light flowed from her fingers. She painted a portrait of her family, a picture of Earth, and a rainbow that stretched across the whole planet. "You\'re a natural artist!" the light-bugs cheered. Luna created a masterpiece across the stars!',
      imagePrompt: 'girl painting with streams of light from fingertips, green and gold light paintings in the sky, portrait of family and rainbow, light-bugs cheering around her, triumphant artistic moment, children\'s book illustration',
    },
  ],
};
