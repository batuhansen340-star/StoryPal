import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../packages/shared/types';
import { LANGUAGES, type Language } from '../../constants/languages';
import { selection } from '../../packages/shared/services/haptics';
import { useLanguage } from '../../constants/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SPACING.lg * 2 - SPACING.md) / 2;
const STORAGE_KEY = 'storypal_language';

export default function SelectLanguageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { ageGroup } = useLocalSearchParams<{ ageGroup?: string }>();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) {
        setSelectedCode(saved);
      }
    });
  }, []);

  const handleSelectLanguage = async (lang: Language) => {
    selection();
    setSelectedCode(lang.code);
    await AsyncStorage.setItem(STORAGE_KEY, lang.code);

    router.push({
      pathname: '/story/select-theme',
      params: { language: lang.code, ageGroup: ageGroup ?? '3-5' },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>{'\u2190 ' + t('back')}</Text>
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('selectLanguage')} {'\u{1F30D}'}</Text>
          <Text style={styles.subtitle}>
            {t('languageSubtitle')}
          </Text>
        </Animated.View>

        <View style={styles.grid}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = selectedCode === lang.code;
            return (
              <Animated.View
                key={lang.code}
                entering={FadeInUp.duration(300).delay(index * 30)}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectLanguage(lang)}
                  accessibilityLabel={lang.name}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                  ]}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.langNative,
                      isSelected && styles.langNativeSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.langName} numberOfLines={1}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedGlow} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.md,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
    opacity: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  langCard: {
    width: CARD_SIZE,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  langCardSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderRadius: RADIUS.lg - 2,
  },
  langFlag: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  langNative: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  langNativeSelected: {
    color: COLORS.primary,
  },
  langName: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
});
