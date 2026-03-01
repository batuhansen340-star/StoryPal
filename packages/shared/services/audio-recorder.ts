import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECORDINGS_KEY_PREFIX = 'storypal_recording_';

export interface RecordingResult {
  uri: string;
  duration: number;
}

let recording: Audio.Recording | null = null;

export async function startRecording(): Promise<void> {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording: newRecording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );
  recording = newRecording;
}

export async function stopRecording(): Promise<RecordingResult | null> {
  if (!recording) return null;

  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  const uri = recording.getURI();
  const status = await recording.getStatusAsync();
  recording = null;

  if (!uri) return null;

  return {
    uri,
    duration: status.durationMillis ?? 0,
  };
}

export async function playRecording(uri: string): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
  return sound;
}

export async function saveRecordingForPage(
  storyId: string,
  pageNumber: number,
  uri: string,
): Promise<void> {
  const key = `${RECORDINGS_KEY_PREFIX}${storyId}_${pageNumber}`;
  await AsyncStorage.setItem(key, uri);
}

export async function getRecordingForPage(
  storyId: string,
  pageNumber: number,
): Promise<string | null> {
  const key = `${RECORDINGS_KEY_PREFIX}${storyId}_${pageNumber}`;
  return AsyncStorage.getItem(key);
}

export async function deleteRecordingForPage(
  storyId: string,
  pageNumber: number,
): Promise<void> {
  const key = `${RECORDINGS_KEY_PREFIX}${storyId}_${pageNumber}`;
  await AsyncStorage.removeItem(key);
}
