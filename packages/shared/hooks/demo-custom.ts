import type { StoryGenerationResponse } from '../types';

export function buildCustomDemo(customPrompt: string, language: string): StoryGenerationResponse {
  if (language === 'tr') return buildCustomDemoTR(customPrompt);
  if (language === 'es') return buildCustomDemoES(customPrompt);
  return buildCustomDemoEN(customPrompt);
}

function buildCustomDemoEN(customPrompt: string): StoryGenerationResponse {
  const shortPrompt = customPrompt.slice(0, 30);
  return {
    title: `The Story of ${shortPrompt}...`,
    pages: [
      {
        text: `Once upon a time, something truly magical happened. ${customPrompt}. And so our adventure begins — in a world where anything is possible and every dream can come true.`,
        imagePrompt: `magical scene depicting: ${customPrompt}, children's book watercolor illustration, warm colors, whimsical`,
      },
      {
        text: `At first, nobody believed it could be real. But there it was — right in front of everyone's eyes. The most extraordinary thing about "${customPrompt}" was that it changed everything. Birds stopped singing just to watch. Clouds gathered closer to get a better look. Even the wind held its breath.`,
        imagePrompt: `amazed scene related to: ${customPrompt}, nature watching in wonder, birds and clouds gathering, magical atmosphere, children's book style`,
      },
      {
        text: `"This is incredible!" said a tiny voice. It was a small, brave creature who had always believed in magic. "I knew this would happen someday. ${customPrompt} — I've been dreaming about this my whole life!" The creature did a little dance of joy, spinning round and round until it got dizzy.`,
        imagePrompt: `cute small creature dancing with joy, scene related to: ${customPrompt}, spinning with excitement, colorful children's book illustration`,
      },
      {
        text: `But then, a shadow crept in. Something wasn't right. A grumpy cloud rolled across the sky, and suddenly everything about ${customPrompt.split(' ').slice(0, 5).join(' ')} started to fade. "Oh no!" everyone cried. "We have to do something before the magic disappears forever!" It was time for a brave hero to step up.`,
        imagePrompt: `dramatic moment, dark cloud threatening a magical scene about: ${customPrompt}, worried characters, tension building, children's book illustration with contrasting light and dark`,
      },
      {
        text: `And that hero was YOU. With a heart full of courage and a mind full of ideas, the hero found a way to bring the magic back. It wasn't easy — it took every ounce of bravery, three impossible jumps, two silly songs, and one giant hug. But it worked. ${customPrompt} was saved, brighter and more wonderful than ever before.`,
        imagePrompt: `triumphant hero saving the day, scene related to: ${customPrompt}, magic restored and glowing brighter, celebration, vibrant joyful colors, children's book watercolor`,
      },
      {
        text: `From that day on, everyone remembered the story of ${customPrompt}. They told it to their children, who told it to their children, who will tell it to you. And if you look very carefully on a quiet night, you might just see a tiny sparkle in the sky — a reminder that magic is real, dreams come true, and the best stories are the ones that come from your own imagination. The End.`,
        imagePrompt: `peaceful ending scene, family telling stories under stars, tiny sparkle in sky related to: ${customPrompt}, warm cozy atmosphere, nostalgic, children's book illustration, golden hour lighting`,
      },
    ],
  };
}

function buildCustomDemoTR(customPrompt: string): StoryGenerationResponse {
  const shortPrompt = customPrompt.slice(0, 30);
  return {
    title: `${shortPrompt} Hikayesi`,
    pages: [
      {
        text: `Bir varmis, bir yokmis. Cok uzun zaman once, gercekten buyulu bir sey olmus. ${customPrompt}. Ve boylece macera baslamis — her seyin mumkun oldugu, her hayalin gerceklesebildigi bir dunyada.`,
        imagePrompt: `magical scene depicting: ${customPrompt}, children's book watercolor illustration, warm colors, whimsical`,
      },
      {
        text: `Baslangicta kimse bunun gercek olabilecegine inanmamis. Ama iste oradaymis — herkesin gozunun onunde. "${customPrompt}" ile ilgili en olaganustu sey, her seyi degistirmesiydi. Kuslar izlemek icin sarkisi soylemeyi birakmis. Bulutlar daha yakindan bakmak icin toplanmis.`,
        imagePrompt: `amazed scene related to: ${customPrompt}, nature watching in wonder, magical atmosphere, children's book style`,
      },
      {
        text: `"Bu inanilmaz!" demis minik bir ses. Sihre her zaman inanan kucuk, cesur bir yaratikmiş. "Bunun bir gun olacagini biliyordum!" Yaratik sevincten dans etmis, donmus, donmus, bassi donene kadar.`,
        imagePrompt: `cute small creature dancing with joy, scene related to: ${customPrompt}, spinning with excitement, colorful children's book illustration`,
      },
      {
        text: `Ama sonra bir golge belirmis. Bir seyler dogru degilmis. Huysuz bir bulut gokyuzunu kaplamis ve birden her sey solmaya baslamis. "Olmaz!" diye bagirmis herkes. "Sihir sonsuza dek kaybolmadan bir seyler yapmaliyiz!" Cesur bir kahramanin ortaya cikmasi gerekiyormus.`,
        imagePrompt: `dramatic moment, dark cloud threatening a magical scene, worried characters, tension building, children's book illustration`,
      },
      {
        text: `Ve o kahraman SEN'din. Cesaretle dolu bir kalp ve fikirlerle dolu bir zihinle, kahraman sihri geri getirmenin yolunu bulmus. Kolay olmamis — tum cesaretini, uc imkansiz ziplama, iki komik sarki ve kocaman bir sarilma gerektirmis. Ama ise yaramis. ${customPrompt} kurtarilmis, her zamankinden daha parlak ve guzel.`,
        imagePrompt: `triumphant hero saving the day, magic restored and glowing brighter, celebration, children's book watercolor`,
      },
      {
        text: `O gunden sonra herkes ${customPrompt} hikayesini hatirlamis. Cocuklarina anlatmislar, onlar da cocuklarina, onlar da sana anlatacak. Ve sessiz bir gecede dikkatlice bakarsan, gokyuzunde kucuk bir parlama gorebilirsin — sihirin gercek oldugunu, hayallerin gerceklestigini ve en guzel hikayelerin senin hayal gucunden geldigini hatirlatan bir isik. Son.`,
        imagePrompt: `peaceful ending scene, family telling stories under stars, tiny sparkle in sky, warm cozy atmosphere, children's book illustration`,
      },
    ],
  };
}

function buildCustomDemoES(customPrompt: string): StoryGenerationResponse {
  const shortPrompt = customPrompt.slice(0, 30);
  return {
    title: `La Historia de ${shortPrompt}...`,
    pages: [
      {
        text: `Habia una vez, algo verdaderamente magico sucedio. ${customPrompt}. Y asi comenzo nuestra aventura — en un mundo donde todo es posible y cada sueno puede hacerse realidad.`,
        imagePrompt: `magical scene depicting: ${customPrompt}, children's book watercolor illustration, warm colors`,
      },
      {
        text: `Al principio, nadie creia que fuera real. Pero ahi estaba — frente a todos. Lo mas extraordinario de "${customPrompt}" era que lo cambiaba todo. Los pajaros dejaron de cantar solo para mirar. Las nubes se acercaron para ver mejor.`,
        imagePrompt: `amazed scene related to: ${customPrompt}, nature watching in wonder, children's book style`,
      },
      {
        text: `"Esto es increible!" dijo una vocecita. Era una criatura pequena y valiente que siempre habia creido en la magia. "Sabia que esto pasaria algun dia!" La criatura bailo de alegria, girando y girando hasta marearse.`,
        imagePrompt: `cute creature dancing with joy, scene related to: ${customPrompt}, colorful children's book illustration`,
      },
      {
        text: `Pero entonces, una sombra aparecio. Una nube gruonona cruzo el cielo, y de repente todo empezo a desvanecerse. "Oh no!" gritaron todos. "Tenemos que hacer algo antes de que la magia desaparezca para siempre!" Era hora de que un heroe valiente diera un paso al frente.`,
        imagePrompt: `dramatic moment, dark cloud threatening magical scene, worried characters, children's book illustration`,
      },
      {
        text: `Y ese heroe fuiste TU. Con un corazon lleno de valor y una mente llena de ideas, el heroe encontro la manera de traer la magia de vuelta. No fue facil — necesito toda su valentia, tres saltos imposibles, dos canciones tontas y un abrazo gigante. Pero funciono. ${customPrompt} fue salvado, mas brillante que nunca.`,
        imagePrompt: `triumphant hero saving the day, magic restored, celebration, children's book watercolor`,
      },
      {
        text: `Desde ese dia, todos recordaron la historia de ${customPrompt}. Se la contaron a sus hijos, quienes se la contaran a los suyos. Y si miras con cuidado en una noche tranquila, quizas veas un pequeno brillo en el cielo — un recordatorio de que la magia es real y las mejores historias nacen de tu propia imaginacion. Fin.`,
        imagePrompt: `peaceful ending, family telling stories under stars, sparkle in sky, warm atmosphere, children's book illustration`,
      },
    ],
  };
}
