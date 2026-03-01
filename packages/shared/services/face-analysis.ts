import * as ImagePicker from 'expo-image-picker';

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

export function buildCharacterPrompt(face: FaceDescription): string {
  return face.fullDescription;
}
