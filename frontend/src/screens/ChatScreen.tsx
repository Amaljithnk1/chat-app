import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { SocketProvider, useChatSocket } from '../context/SocketContext';
import SignalBackground from '../components/SignalBackground';
import ConnectionBar from '../components/ConnectionBar';
import MessageBubble from '../components/MessageBubble';
import { ChatMessage } from '../types';

function ChatScreenInner() {
  const { user, logout } = useAuth();
  const { status, messages, onlineUsers, typingUser, sendMessage, setTyping } = useChatSocket();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback(
    (text: string) => {
      setDraft(text);
      setTyping(true);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      typingClearRef.current = setTimeout(() => setTyping(false), 1200);
    },
    [setTyping]
  );

  const handleSend = useCallback(() => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
    setTyping(false);
    if (typingClearRef.current) clearTimeout(typingClearRef.current);
  }, [draft, sendMessage, setTyping]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const isOwn = item.userId === user?.userId;
      const previous = messages[index - 1];
      const showSender = !isOwn && (!previous || previous.userId !== item.userId);
      return <MessageBubble message={item} isOwn={isOwn} showSender={showSender} />;
    },
    [messages, user?.userId]
  );

  return (
    <SignalBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Frequency</Text>
              <ConnectionBar status={status} onlineCount={onlineUsers.length} />
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
              <Text style={styles.logoutText}>DISCONNECT</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No transmissions yet</Text>
                <Text style={styles.emptySubtitle}>Send the first message on the channel.</Text>
              </View>
            }
          />

          <View style={styles.typingSlot}>
            {typingUser && (
              <Text style={styles.typingText}>{typingUser.username} is transmitting…</Text>
            )}
          </View>

          <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
            <View style={styles.composer}>
              <TextInput
                value={draft}
                onChangeText={handleChangeText}
                placeholder="Type a message…"
                placeholderTextColor={colors.textSecondary}
                style={styles.composerInput}
                multiline
                maxLength={2000}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!draft.trim()}
                style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
                activeOpacity={0.85}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SignalBackground>
  );
}

export default function ChatScreen() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <SocketProvider user={user}>
      <ChatScreenInner />
    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  logoutButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  logoutText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  typingSlot: {
    minHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  bottomSafeArea: {
    backgroundColor: 'transparent',
  },
  typingText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.accentSecondary,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  composerInput: {
    flex: 1,
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 15,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.textOnAccent,
  },
});
