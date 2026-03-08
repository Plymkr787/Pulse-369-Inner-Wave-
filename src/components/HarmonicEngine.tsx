import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HarmonicMode } from '@types';
import { HARMONIC_MODES, FIBONACCI_SEQUENCE, GOLDEN_RATIO, TESLA_SEQUENCE } from '@constants';
import { useAppStore } from '@store/appStore';

interface HarmonicEngineProps {
  selectedMode: HarmonicMode;
  baseFrequency: number;
  onSelectMode: (mode: HarmonicMode) => void;
}

const HarmonicEngine: React.FC<HarmonicEngineProps> = ({
  selectedMode,
  baseFrequency,
  onSelectMode
}) => {
  const store = useAppStore();
  const isPremium = store.canUsePremiumFeature();

  const modes: HarmonicMode[] = ['none', 'fibonacci', 'golden', '369'];

  const getGradientColors = (mode: HarmonicMode): [string, string] => {
    const colors: Record<HarmonicMode, [string, string]> = {
      none: ['#424242', '#616161'],
      fibonacci: ['#FF8F00', '#FFB300'],
      golden: ['#FFD700', '#FFA000'],
      '369': ['#00BCD4', '#0097A7']
    };
    return colors[mode];
  };

  const calculateHarmonics = (mode: HarmonicMode): number[] => {
    switch (mode) {
      case 'fibonacci':
        return FIBONACCI_SEQUENCE.slice(0, 6).map(f => Math.round(baseFrequency * f));
      case 'golden':
        return [
          Math.round(baseFrequency),
          Math.round(baseFrequency * GOLDEN_RATIO),
          Math.round(baseFrequency * Math.pow(GOLDEN_RATIO, 2))
        ];
      case '369':
        return TESLA_SEQUENCE.map(t => Math.round(baseFrequency * (t / 3)));
      default:
        return [Math.round(baseFrequency)];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Harmonic Expansion</Text>
      
      <View style={styles.modesContainer}>
        {modes.map((mode) => {
          const config = HARMONIC_MODES[mode];
          const isSelected = selectedMode === mode;
          const isLocked = mode !== 'none' && !isPremium;
          const harmonics = calculateHarmonics(mode);

          return (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                isSelected && styles.selectedMode,
                isLocked && styles.lockedMode
              ]}
              onPress={() => !isLocked && onSelectMode(mode)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getGradientColors(mode)}
                style={styles.modeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.modeName}>{config.name}</Text>
                <Text style={styles.modeDescription} numberOfLines={2}>
                  {config.description}
                </Text>
                
                <View style={styles.harmonicsContainer}>
                  {harmonics.slice(0, 4).map((freq, i) => (
                    <View key={i} style={styles.harmonicBadge}>
                      <Text style={styles.harmonicText}>{freq}Hz</Text>
                    </View>
                  ))}
                </View>

                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>⭐</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {selectedMode === 'fibonacci' && '🌀 Natural growth pattern: 1, 1, 2, 3, 5, 8...'}
          {selectedMode === 'golden' && '✨ Divine proportion: φ = 1.618...'}
          {selectedMode === '369' && '⚡ Tesla harmonics: 3, 6, 9 key to universe'}
          {selectedMode === 'none' && '🔘 Pure tone without harmonic expansion'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  modesContainer: {
    gap: 12,
  },
  modeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMode: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  lockedMode: {
    opacity: 0.6,
  },
  modeGradient: {
    padding: 16,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  harmonicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  harmonicBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  harmonicText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  lockIcon: {
    fontSize: 28,
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
});

export default HarmonicEngine;
