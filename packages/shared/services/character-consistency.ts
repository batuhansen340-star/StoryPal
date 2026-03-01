import type { CharacterSheet, PersonalizationData } from '../types';

export function buildCharacterSheet(params: {
  characterName: string;
  characterDescription: string;
  theme: string;
  personalization?: PersonalizationData;
}): CharacterSheet {
  const { characterName, characterDescription, theme, personalization } = params;
  const features: string[] = [];
  let baseDescription = `${characterName}, ${characterDescription}`;

  if (personalization) {
    if (personalization.usePhotoFace && personalization.faceDescription) {
      baseDescription = personalization.faceDescription;
    } else {
      if (personalization.name) {
        baseDescription = `A child named ${personalization.name}`;
      }
      if (personalization.gender) {
        features.push(`${personalization.gender} character`);
      }
      features.push(`${personalization.hairColor} hair`);
      features.push(`${personalization.skinTone} skin tone`);
      if (personalization.hasGlasses) {
        features.push('wearing small round glasses');
      }
    }
  }

  const style = "children's book illustration, soft watercolor, consistent style, warm pastel tones";

  const featureString = features.length > 0 ? `, ${features.join(', ')}` : '';
  const consistencyPrompt = [
    `IMPORTANT: The character "${characterName}" must look EXACTLY the same on every page.`,
    `Character appearance: ${baseDescription}${featureString}.`,
    `Style: ${style}.`,
    'Maintain consistent proportions, colors, outfit, and facial features across all illustrations.',
  ].join(' ');

  return {
    baseDescription,
    features,
    style,
    consistencyPrompt,
  };
}

export function getCharacterConsistencyTag(characterSheet: CharacterSheet): string {
  return characterSheet.consistencyPrompt;
}
