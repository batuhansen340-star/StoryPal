import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { COLORS, SPACING, RADIUS, GRADIENTS } from "../types";
import { EmojiText } from "./EmojiText";

const { width } = Dimensions.get("window");

const LOADING_MESSAGES = [
  { emoji: "✏️", key: "writingStory" },
  { emoji: "🎨", key: "drawingPages" },
  { emoji: "✨", key: "magicSpark" },
  { emoji: "📖", key: "bookBinding" },
  { emoji: "🌟", key: "almostReady" },
];

interface LoadingAIProps {
  progress: number;
  totalSteps: number;
  currentStep: string;
  status: string;
  t?: (key: string | any) => string;
}

export function LoadingAI({
  progress,
  totalSteps,
  currentStep,
  status,
  t,
}: LoadingAIProps) {
  const bounceAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  useEffect(() => {
    bounceAnim.value = withRepeat(
      withSequence(
        withTiming(-20, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      ),
      -1,
      true,
    );

    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );

    sparkle1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
    );

    sparkle2.value = withRepeat(
      withDelay(
        300,
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 }),
        ),
      ),
      -1,
    );

    sparkle3.value = withRepeat(
      withDelay(
        600,
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 }),
        ),
      ),
      -1,
    );
  }, [bounceAnim, rotateAnim, pulseAnim, sparkle1, sparkle2, sparkle3]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [
      { scale: interpolate(sparkle1.value, [0, 1], [0.5, 1.2]) },
      { translateX: -60 },
      { translateY: -40 },
    ],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [
      { scale: interpolate(sparkle2.value, [0, 1], [0.5, 1.2]) },
      { translateX: 50 },
      { translateY: -60 },
    ],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [
      { scale: interpolate(sparkle3.value, [0, 1], [0.5, 1.2]) },
      { translateX: 70 },
      { translateY: 20 },
    ],
  }));

  const progressPercent =
    totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;
  const messageIndex = Math.min(
    Math.floor((progress / Math.max(totalSteps, 1)) * LOADING_MESSAGES.length),
    LOADING_MESSAGES.length - 1,
  );
  const loadingMessage = LOADING_MESSAGES[messageIndex];
  const translatedText = t ? t(loadingMessage.key) : loadingMessage.key;

  const getDisplayText = () => {
    if (!t) return currentStep;

    // Handle drawingPages with pagination (e.g., "drawingPages:1-4/8")
    if (currentStep.includes(":")) {
      const [key, params] = currentStep.split(":");
      return t(key) + " " + params;
    }

    return t(currentStep) || currentStep;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8F0", "#FFE8D6", "#FFD4B8"]}
        style={styles.gradient}
      >
        <View style={styles.sparkleContainer}>
          <Animated.View style={[styles.sparkle, sparkle1Style]}>
            <EmojiText>✨</EmojiText>
          </Animated.View>
          <Animated.View style={[styles.sparkle, sparkle2Style]}>
            <EmojiText>⭐</EmojiText>
          </Animated.View>
          <Animated.View style={[styles.sparkle, sparkle3Style]}>
            <EmojiText>💫</EmojiText>
          </Animated.View>
        </View>

        <Animated.View style={[styles.emojiContainer, bounceStyle]}>
          <Animated.View style={pulseStyle}>
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.emojiCircle}
            >
              <EmojiText style={styles.mainEmoji}>
                {loadingMessage.emoji}
              </EmojiText>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        <Text style={styles.statusText}>{getDisplayText()}</Text>
        <Text style={styles.subText}>{translatedText}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>

        {totalSteps > 0 && (
          <Text style={styles.stepText}>
            {t ? `${t("loadingStep")} ${progress} / ${totalSteps}` : `Step ${progress} / ${totalSteps}`}
          </Text>
        )}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  sparkleContainer: {
    position: "absolute",
    top: "30%",
    alignItems: "center",
  },
  sparkle: {
    fontSize: 28,
    position: "absolute",
  },
  emojiContainer: {
    marginBottom: SPACING.xl,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  mainEmoji: {
    fontSize: 56,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 80,
    gap: SPACING.md,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(255,107,107,0.15)",
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    minWidth: 45,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});
