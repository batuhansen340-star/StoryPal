import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { signInWithEmail, signUpWithEmail, signInAsGuest } from '../packages/shared/services/auth';
import { COLORS, SPACING, RADIUS } from '../packages/shared/types';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
        // Supabase may require email confirmation — try auto-login
        try {
          await signInWithEmail(email.trim(), password);
          router.replace('/(tabs)');
        } catch {
          // Email confirmation required — show success message
          setSuccessMsg('Account created! Check your email to confirm, then sign in.');
          setIsSignUp(false);
        }
      } else {
        await signInWithEmail(email.trim(), password);
        router.replace('/(tabs)');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await signInAsGuest();
      router.replace('/(tabs)');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.headerEmoji}>{'\u{1F4D6}'}</Text>
          <Text style={styles.headerTitle}>StoryPal</Text>
          <Text style={styles.headerSubtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </Text>
        </Animated.View>

        {/* Error / Success Messages */}
        {errorMsg !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        {successMsg !== '' && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        )}

        {/* Form */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="hello@storypal.app"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder={'\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}\u{2022}'}
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={[COLORS.primary, '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            >
              <Text style={styles.submitText}>
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Toggle Sign In / Sign Up */}
          <TouchableOpacity
            onPress={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
            activeOpacity={0.7}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.toggleTextBold}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Guest Button */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <TouchableOpacity
            onPress={handleGuest}
            activeOpacity={0.85}
            disabled={loading}
            style={styles.guestButton}
          >
            <Text style={styles.guestEmoji}>{'\u{1F47B}'}</Text>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
          <Text style={styles.guestHint}>
            Guest stories are saved on this device only
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 17,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FFE8E8',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FFB8B8',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.backgroundDark,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButton: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  toggleText: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  toggleTextBold: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
  },
  guestButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.backgroundDark,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  guestEmoji: {
    fontSize: 22,
  },
  guestText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  guestHint: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: SPACING.sm,
  },
});
