import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radii, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import SignalBackground from '../components/SignalBackground';

export default function LoginScreen() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || submitting) return;
    setSubmitting(true);
    try {
      await login(username.trim());
    } catch {
      // error is surfaced via the auth context's `error` state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignalBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.brandBlock}>
            <View style={styles.brandDot} />
            <Text style={styles.eyebrow}>SECURE CHANNEL</Text>
          </View>

          <Text style={styles.title}>Frequency</Text>
          <Text style={styles.subtitle}>
            Tune in with a call sign to join the live channel.
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>CALL SIGN</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. nova_7"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={24}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, (!username.trim() || submitting) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!username.trim() || submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={colors.textOnAccent} />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footnote}>
            No password needed — this is a demo login for evaluation purposes.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SignalBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.online,
    marginRight: spacing.xs,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 21,
  },
  inputWrapper: { marginBottom: spacing.md },
  inputLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.accentSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  errorText: {
    fontFamily: fonts.body,
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.textOnAccent,
  },
  footnote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
