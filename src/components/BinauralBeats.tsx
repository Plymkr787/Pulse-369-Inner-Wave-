import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrainwaveState, BinauralConfig } from '@types';
import { BRAINWAVE_STATES } from '@constants';

interface BinauralBeatsProps {
  config: BinauralConfig;
  baseFrequency: number;
  brainwaveState: BrainwaveState;
  onConfigChange: (config: Partial<BinauralConfig>) => void;
}

const BinauralBeats: React.FC<BinauralBeatsProps> = ({
  config,
  baseFrequency,
  brainwaveState,
  onConfigChange
}) => {
  const calculateBeatFrequency = (left: number, right: number): number => {
    return Math.abs(right - left);
  };

  const setBrainwavePreset = (state: BrainwaveState) => {
    const range = BRAINWAVE_STATES[state].frequencyRange;
    const beatFreq = (range[0] + range[1]) / 2;
    onConfigChange({
      beatFrequency: beatFreq,
      rightFrequency: baseFrequency + beatFreq,
      leftFrequency: baseFrequency
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Binaural Beats</Text>
        <Switch
          value={config.enabled}
          onValueChange={(enabled) => onConfigChange({ enabled })}
          trackColor={{ false: '#424242', true: '#4CAF50' }}
          thumbColor={config.enabled ? '#81C784' : '#9E9E9E'}
        />
      </View>

      {config.enabled && (
        <>
          <View style={styles.frequencyContainer}>
            <View style={styles.earContainer}>
              <Text style={styles.earLabel}>Left Ear</Text>
              <Text style={styles.frequencyValue}>{config.leftFrequency.toFixed(1)} Hz</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => onConfigChange({ 
                    leftFrequency: Math.max(20, config.leftFrequency - 1) 
                  })}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => onConfigChange({ 
                    leftFrequency: Math.min(20000, config.leftFrequency + 1) 
                  })}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.beatIndicator}>
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4']}
                style={styles.beatGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.beatValue}>
                  {calculateBeatFrequency(config.leftFrequency, config.rightFrequency).toFixed(2)}
                </Text>
                <Text style={styles.beatLabel}>Hz Beat</Text>
              </LinearGradient>
            </View>

            <View style={styles.earContainer}>
              <Text style={styles.earLabel}>Right Ear</Text>
              <Text style={styles.frequencyValue}>{config.rightFrequency.toFixed(1)} Hz</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => onConfigChange({ 
                    rightFrequency: Math.max(20, config.rightFrequency - 1) 
                  })}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => onConfigChange({ 
                    rightFrequency: Math.min(20000, config.rightFrequency + 1) 
                  })}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.presetTitle}>Quick Presets</Text>
          <View style={styles.presetsContainer}>
            {Object.values(BRAINWAVE_STATES).map((state) => (
              <TouchableOpacity
                key={state.state}
                style={[
                  styles.presetButton,
                  brainwaveState === state.state && styles.activePreset
                ]}
                onPress={() => setBrainwavePreset(state.state)}
              >
                <Text style={[
                  styles.presetText,
                  brainwaveState === state.state && styles.activePresetText
                ]}>
                  {state.name}
                </Text>
                <Text style={styles.presetFreq}>
                  {state.frequencyRange[0]}–{state.frequencyRange[1]} Hz
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              🧠 {BRAINWAVE_STATES[brainwaveState].name} State
            </Text>
            <Text style={styles.infoDescription}>
              {BRAINWAVE_STATES[brainwaveState].description}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  earContainer: {
    alignItems: 'center',
    flex: 1,
  },
  earLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  frequencyValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300',
  },
  beatIndicator: {
    width: 100,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  beatGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  beatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  presetTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  activePreset: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  presetText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  activePresetText: {
    color: '#FFD700',
  },
  presetFreq: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});

export default BinauralBeats;
