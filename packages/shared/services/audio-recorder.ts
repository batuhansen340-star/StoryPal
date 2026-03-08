import {
  AudioModule,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  createAudioPlayer,
} from 'expo-audio';
import type { AudioRecorder, AudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECORDINGS_KEY_PREFIX = 'storypal_recording_';

export interface RecordingResult {
  uri: string;
  duration: number;
}

let recorder: AudioRecorder | null = null;

export async function startRecording(): Promise<void> {
  await requestRecordingPermissionsAsync();
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });

  recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
  await recorder.prepareToRecordAsync();
  recorder.record();
}

export async function stopRecording(): Promise<RecordingResult | null> {
  if (!recorder) return null;

  await recorder.stop();
  await setAudioModeAsync({ allowsRecording: false });

  const uri = recorder.uri;
  const status = recorder.getStatus();
  recorder = null;

  if (!uri) return null;

  return {
    uri,
    duration: status.durationMillis ?? 0,
  };
}

export function playRecording(uri: string): AudioPlayer {
  const player = createAudioPlayer({ uri });
  player.play();
  return player;
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
