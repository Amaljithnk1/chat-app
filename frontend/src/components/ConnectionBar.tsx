import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import SignalPulse from './SignalPulse';

type Status = 'connecting' | 'online' | 'offline';

const LABEL: Record<Status, string> = {
  connecting: 'CONNECTING…',
  online: 'SIGNAL LIVE',
  offline: 'SIGNAL LOST',
};

export default function ConnectionBar({
  status,
  onlineCount,
}: {
  status: Status;
  onlineCount: number;
}) {
  return (
    <View style={styles.container}>
      <SignalPulse active={status === 'online'} />
      <Text style={styles.label}>{LABEL[status]}</Text>
      {status === 'online' && (
        <Text style={styles.count}>
          · {onlineCount} {onlineCount === 1 ? 'PEER' : 'PEERS'} ONLINE
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
});
