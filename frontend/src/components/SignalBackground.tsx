import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

/**
 * Shared background for every screen: a deep petrol gradient (never flat
 * black) with a few faint horizontal "waveform" strokes drifting behind the
 * content, evoking a signal readout without being loud enough to fight with
 * the actual UI on top of it.
 */
export default function SignalBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[colors.bgDeep, '#0A2124', colors.bgDeep]}
      style={styles.fill}
    >
      <View style={styles.waveformLayer} pointerEvents="none">
        {[0.18, 0.32, 0.5, 0.68, 0.84].map((topFraction, index) => (
          <View
            key={index}
            style={[
              styles.wave,
              {
                top: `${topFraction * 100}%`,
                opacity: index % 2 === 0 ? 0.05 : 0.035,
                left: index % 2 === 0 ? '-10%' : '5%',
              },
            ]}
          />
        ))}
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  waveformLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  wave: {
    position: 'absolute',
    width: '120%',
    height: 1,
    backgroundColor: colors.accentSecondary,
  },
});
