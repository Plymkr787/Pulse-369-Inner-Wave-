import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrainwaveState } from '@types';
import { BRAINWAVE_STATES } from '@constants';
import { useAppStore } from '@store/appStore';

interface BrainwaveSelectorProps {
  selectedState: BrainwaveState;
  onSelect: (state: BrainwaveState) => void;
}

const BrainwaveSelector: React.FC<BrainwaveSelectorProps> = ({ selectedState, onSelect }) => {
  const store = useAppStore();
  const isPremium = store.canUsePremiumFeature();

  const states: BrainwaveState[] = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

  const getGradientColors = (state: BrainwaveState): [string, string] => {
    const colors: Record<BrainwaveState, [string, string]> = {
      delta: ['#1a237e', '#3949ab'],
      theta: ['#4a148c', '#7b1fa2'],
      alpha: ['#1b5e20', '#388e3c'],
      beta: ['#e65100', '#f57c00'],
      gamma: ['#b71c1c', '#d32f2f']
    };
    return colors[state];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brainwave State</Text>
      <View style={styles.grid}>
        {states.map((state) => {
          const config = BRAINWAVE_STATES[state];
          const isSelected = selectedState === state;
          const isLocked = !isPremium && (state === 'gamma' || state === 'beta');

          return (
            <TouchableOpacity
              key={state}
              style={[
                styles.button,
                isSelected && styles.selectedButton,
                isLocked && styles.lockedButton
              ]}
              onPress={() => !isLocked && onSelect(state)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getGradientColors(state)}
                style={[
                  styles.gradient,
                  isSelected && styles.selectedGradient
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.stateName}>{config.name}</Text>
                <Text style={styles.frequencyRange}>
                  {config.frequencyRange[0]}–{config.frequencyRange[1]} Hz
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {config.description}
                </Text>
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  lockedButton: {
    opacity: 0.6,
  },
  gradient: {
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  selectedGradient: {
    opacity: 1,
  },
  stateName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  frequencyRange: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  lockIcon: {
    fontSize: 24,
  },
});

export default BrainwaveSelector;
