import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import {
  startRecording,
  stopRecording,
  playRecording,
  saveRecordingForPage,
} from '../../packages/shared/services/audio-recorder';

const { width } = Dimensions.get('window');

export default function RecordVoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { title, pages, storyId } = useLocalSearchParams<{
    title?: string;
    pages?: string;
    storyId?: string;
  }>();

  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [savedPages, setSavedPages] = useState<Set<number>>(new Set());
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  let parsedPages: { text: string; imagePrompt: string }[] = [];
  try {
    if (pages) parsedPages = JSON.parse(pages);
  } catch {
    // fallback
  }

  const totalPages = parsedPages.length;
  const currentText = parsedPages[currentPageIdx]?.text ?? '';
  const allRecorded = savedPages.size === totalPages;
  const sid = storyId ?? 'demo';

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 100);
      }, 100);
    } catch {
      // permission denied or error
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);

    const result = await stopRecording();
    if (result) {
      setLastRecordingUri(result.uri);
    }
  };

  const handleSaveAndNext = async () => {
    if (lastRecordingUri) {
      await saveRecordingForPage(sid, currentPageIdx, lastRecordingUri);
      setSavedPages(prev => new Set(prev).add(currentPageIdx));
      setLastRecordingUri(null);
    }

    if (currentPageIdx < totalPages - 1) {
      setCurrentPageIdx(prev => prev + 1);
    }
  };

  const handlePlayback = async () => {
    if (lastRecordingUri) {
      await playRecording(lastRecordingUri);
    }
  };

  const formatDuration = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (allRecorded) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={styles.doneGradient}
        >
          <Animated.View entering={FadeIn.duration(1000)} style={styles.doneContent}>
            <Text style={styles.doneEmoji}>{'\u{1F389}'}</Text>
            <Text style={styles.doneTitle}>All Pages Recorded!</Text>
            <Text style={styles.doneSubtitle}>
              Your voice will play when reading the story
            </Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.doneButtonGradient}
              >
                <Text style={styles.doneButtonText}>Done {'\u{2728}'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Nav */}
        <View style={[styles.nav, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>{'\u2715'}</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{title ?? 'Record Voice'}</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Page Navigation */}
        <View style={styles.pageNav}>
          <TouchableOpacity
            onPress={() => setCurrentPageIdx(Math.max(0, currentPageIdx - 1))}
            disabled={currentPageIdx === 0}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageArrow, currentPageIdx === 0 && styles.pageArrowDisabled]}>
              {'\u2190'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.pageLabel}>
            Page {currentPageIdx + 1} / {totalPages}
            {savedPages.has(currentPageIdx) ? ' \u2713' : ''}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentPageIdx(Math.min(totalPages - 1, currentPageIdx + 1))}
            disabled={currentPageIdx === totalPages - 1}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageArrow, currentPageIdx === totalPages - 1 && styles.pageArrowDisabled]}>
              {'\u2192'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Story Text */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.textCard}>
          <Text style={styles.storyText}>{currentText}</Text>
        </Animated.View>

        {/* Recording Controls */}
        <View style={styles.controls}>
          {isRecording && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.waveform}>
              {[...Array(5)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: 12 + Math.random() * 28 },
                  ]}
                />
              ))}
            </Animated.View>
          )}

          {isRecording && (
            <Text style={styles.durationText}>
              {formatDuration(recordingDuration)}
            </Text>
          )}

          {/* Mic Button */}
          <TouchableOpacity
            style={styles.micButton}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={isRecording ? ['#FF3B30', '#FF6B6B'] : GRADIENTS.primary}
              style={[styles.micButtonGradient, isRecording && styles.micButtonRecording]}
            >
              <Text style={styles.micEmoji}>
                {isRecording ? '\u{23F9}\u{FE0F}' : '\u{1F3A4}'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.micHint}>
            {isRecording ? 'Tap to stop' : 'Tap to record'}
          </Text>

          {/* Action Buttons */}
          {lastRecordingUri && !isRecording && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn} onPress={handlePlayback} activeOpacity={0.8}>
                <Text style={styles.actionBtnText}>{'\u{25B6}\u{FE0F}'} Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleStartRecording} activeOpacity={0.8}>
                <Text style={styles.actionBtnText}>{'\u{1F504}'} Re-record</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.saveBtn]}
                onPress={handleSaveAndNext}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>
                  {'\u2713'} {currentPageIdx < totalPages - 1 ? 'Save & Next' : 'Save'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  pageNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },
  pageArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  pageArrowDisabled: {
    opacity: 0.3,
  },
  pageLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  textCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.xl,
  },
  storyText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#E8E8F0',
    lineHeight: 34,
    textAlign: 'center',
  },
  controls: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  waveBar: {
    width: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  durationText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  micButton: {
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonRecording: {
    shadowColor: '#FF3B30',
  },
  micEmoji: {
    fontSize: 32,
  },
  micHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.success,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  // Done state
  doneGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneContent: {
    alignItems: 'center',
  },
  doneEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  doneTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: SPACING.sm,
  },
  doneSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.xl,
  },
  doneButton: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
