import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { ChatMessage } from '../types';

function formatTime(iso: string): string {
  const date = new Date(iso);
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  showSender: boolean;
}

export default function MessageBubble({ message, isOwn, showSender }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View
      style={[
        styles.row,
        isOwn ? styles.rowOwn : styles.rowOther,
        { opacity: anim, transform: [{ translateY }] },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        {!isOwn && showSender && <Text style={styles.sender}>{message.username}</Text>}
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isOwn ? styles.timestampOwn : styles.timestampOther]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginVertical: spacing.xs,
    flexDirection: 'row',
  },
  rowOwn: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  bubbleOwn: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radii.sm,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceIncoming,
    borderBottomLeftRadius: radii.sm,
  },
  sender: {
    fontFamily: fonts.displayMedium,
    fontSize: 12,
    color: colors.accentSecondary,
    marginBottom: 2,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
  },
  textOwn: { color: colors.textOnAccent },
  textOther: { color: colors.textPrimary },
  timestamp: {
    fontFamily: fonts.mono,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    letterSpacing: 0.5,
  },
  timestampOwn: { color: 'rgba(27,16,8,0.6)' },
  timestampOther: { color: colors.textSecondary },
});
