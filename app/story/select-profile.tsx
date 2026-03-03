import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, GRADIENTS } from '../../packages/shared/types';
import {
  getChildProfiles,
  createChildProfile,
  getAvatarEmoji,
  getAvatarOptions,
  ageToAgeGroup,
  type ChildProfile,
} from '../../packages/shared/services/child-profiles';
import { useLanguage } from '../../constants/LanguageContext';

export default function SelectProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { language } = useLocalSearchParams<{ language?: string }>();

  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newAvatar, setNewAvatar] = useState('child');

  useEffect(() => {
    getChildProfiles().then(setProfiles);
  }, []);

  const handleSelect = (profile: ChildProfile) => {
    router.push({
      pathname: '/story/select-theme',
      params: {
        ageGroup: ageToAgeGroup(profile.age),
        language: language ?? 'en',
        childName: profile.name,
        childAge: String(profile.age),
      },
    });
  };

  const handleSkip = () => {
    router.push({
      pathname: '/story/select-theme',
      params: { ageGroup: '3-5', language: language ?? 'en' },
    });
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newAge.trim()) return;
    const age = parseInt(newAge, 10);
    if (isNaN(age) || age < 1 || age > 12) return;

    const profile = await createChildProfile({
      name: newName.trim(),
      age,
      avatarId: newAvatar,
    });

    setProfiles(prev => [...prev, profile]);
    setShowModal(false);
    setNewName('');
    setNewAge('');
    setNewAvatar('child');
  };

  const avatarOptions = getAvatarOptions();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.title}>{t('whoIsStoryFor')} {'\u{1F9D2}'}</Text>
          <Text style={styles.subtitle}>{t('selectChildSkip')}</Text>
        </Animated.View>

        {profiles.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInDown.duration(400).delay(100 + i * 80)}>
            <TouchableOpacity
              style={styles.profileCard}
              activeOpacity={0.85}
              onPress={() => handleSelect(p)}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{getAvatarEmoji(p.avatarId)}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{p.name}</Text>
                <Text style={styles.profileAge}>{p.age} years old {'\u00B7'} {ageToAgeGroup(p.age)}</Text>
              </View>
              <Text style={styles.profileArrow}>{'\u203A'}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.duration(400).delay(100 + profiles.length * 80)}>
          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.85}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>{t('addChild')}</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>{t('skip')} {'\u2192'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Child Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('newChild')} {'\u{1F31F}'}</Text>

            <Text style={styles.inputLabel}>{t('name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('childName')}
              placeholderTextColor={COLORS.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            <Text style={styles.inputLabel}>{t('age')}</Text>
            <TextInput
              style={styles.input}
              placeholder="1-12"
              placeholderTextColor={COLORS.textMuted}
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="number-pad"
              maxLength={2}
            />

            <Text style={styles.inputLabel}>{t('avatar')}</Text>
            <View style={styles.avatarRow}>
              {avatarOptions.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[styles.avatarOption, newAvatar === a.id && styles.avatarOptionSelected]}
                  onPress={() => setNewAvatar(a.id)}
                >
                  <Text style={styles.avatarOptionText}>{a.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={handleCreate}>
                <LinearGradient
                  colors={GRADIENTS.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createButton}
                >
                  <Text style={styles.createText}>{t('add')} {'\u{2728}'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textLight, marginBottom: SPACING.lg },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md,
    shadowColor: COLORS.cardShadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 3,
  },
  profileAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.backgroundDark,
    alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarText: { fontSize: 28 },
  profileInfo: { flex: 1, marginLeft: SPACING.md },
  profileName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  profileAge: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  profileArrow: { fontSize: 28, color: COLORS.textMuted, fontWeight: '300' },
  addCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.lg, borderWidth: 2, borderColor: COLORS.backgroundDark, borderStyle: 'dashed',
  },
  addIcon: { fontSize: 24, color: COLORS.primary, fontWeight: '800', marginRight: SPACING.sm },
  addText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  skipButton: { alignItems: 'center', padding: SPACING.md },
  skipText: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl, paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
  },
  modalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.lg, textAlign: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs, marginLeft: SPACING.xs },
  input: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg, fontSize: 16, color: COLORS.text,
    borderWidth: 1.5, borderColor: COLORS.backgroundDark, marginBottom: SPACING.md,
  },
  avatarRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  avatarOption: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.backgroundDark,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarOptionSelected: { borderWidth: 3, borderColor: COLORS.primary, backgroundColor: '#FFE8E8' },
  avatarOptionText: { fontSize: 24 },
  modalButtons: { flexDirection: 'row', gap: SPACING.md },
  cancelButton: { flex: 1, padding: SPACING.md, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted },
  createButton: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center' },
  createText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
