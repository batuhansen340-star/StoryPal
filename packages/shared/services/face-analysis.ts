import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import OpenAI from 'openai';

export interface FaceDescription {
  hairColor: string;
  eyeColor: string;
  skinTone: string;
  faceShape: string;
  accessories: string;
  gender: string;
  ageAppearance: string;
  fullDescription: string;
}

const DEMO_FACE: FaceDescription = {
  hairColor: 'wavy dark brown hair',
  eyeColor: 'bright brown eyes',
  skinTone: 'warm medium skin',
  faceShape: 'round cheerful face with dimples',
  accessories: 'none',
  gender: 'girl',
  ageAppearance: 'about 6 years old',
  fullDescription:
    'A cheerful 6-year-old girl with wavy dark brown hair, bright brown eyes, warm medium skin, and a round cheerful face with dimples',
};

export async function pickPhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export function analyzeFaceDemo(): FaceDescription {
  return { ...DEMO_FACE };
}

async function getBase64FromUri(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}

export async function analyzeFace(photoUri: string): Promise<FaceDescription> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
  if (!apiKey) return analyzeFaceDemo();

  try {
    const base64 = await getBase64FromUri(photoUri);
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You analyze children's photos to create storybook character descriptions. You MUST respond in valid JSON only. Describe the child in warm, friendly terms suitable for a children's storybook illustration prompt. Be specific about visual features but always kind and positive.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this child's photo and return a JSON object with these fields:
{
  "hairColor": "descriptive hair (e.g., 'curly golden blonde hair')",
  "eyeColor": "descriptive eyes (e.g., 'sparkly blue eyes')",
  "skinTone": "warm description (e.g., 'warm olive skin')",
  "faceShape": "friendly description (e.g., 'round cheerful face with freckles')",
  "accessories": "any glasses, bows, etc. or 'none'",
  "gender": "boy or girl",
  "ageAppearance": "approximate age (e.g., 'about 5 years old')",
  "fullDescription": "Complete one-sentence character description combining all features"
}`,
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64}`, detail: 'low' },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return analyzeFaceDemo();

    const parsed = JSON.parse(jsonMatch[0]) as FaceDescription;
    if (!parsed.fullDescription) {
      parsed.fullDescription = `A ${parsed.ageAppearance} ${parsed.gender} with ${parsed.hairColor}, ${parsed.eyeColor}, ${parsed.skinTone}, and a ${parsed.faceShape}`;
    }
    return parsed;
  } catch {
    return analyzeFaceDemo();
  }
}

export function buildCharacterPrompt(face: FaceDescription): string {
  return face.fullDescription;
}
