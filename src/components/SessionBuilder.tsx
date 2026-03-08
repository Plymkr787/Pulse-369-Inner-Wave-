import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SessionConfig, AmbientSound } from '@types';
import { AMBIENT_SOUNDS, DEFAULT_SESSION_DURATION, MAX_SESSION_DURATION_FREE, MAX_SESSION_DURATION_PREMIUM } from '@constants';
import { useAppStore } from '@store/appStore';

interface SessionBuilderProps {
  config: SessionConfig;
  onConfigChange: (config: Partial<SessionConfig>) => void;
}

const SessionBuilder: React.FC<SessionBuilderProps> = ({ config, onConfigChange }) => {
  const store = useAppStore();
  const isPremium = store.canUsePremiumFeature();

  const maxDuration = isPremium ? MAX_SESSION_DURATION_PREMIUM : MAX_SESSION_DURATION_FREE;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const durationPresets = [
    { label: '5 min', value: 300 },
    { label: '15 min', value: 900 },
    { label: '30 min', value: 1800 },
    { label: '1 hour', value: 3600 },
  ];

  if (isPremium) {
    durationPresets.push({ label: '2 hours', value: 7200 });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Builder</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{formatTime(config.duration)}</Text>
        </View>
        
        <View style={styles.durationPresets}>
          {durationPresets.map((preset) => (
            <TouchableOpacity
              key={preset.value}
              style={[
                styles.presetButton,
                config.duration === preset.value && styles.activePreset
              ]}
              onPress={() => onConfigChange({ duration: preset.value })}
            >
              <Text style={[
                styles.presetText,
                config.duration === preset.value && styles.activePresetText
              ]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => onConfigChange({ 
              duration: Math.max(60, config.duration - 60) 
            })}
          >
            <Text style={styles.sliderButtonText}>−</Text>
          </TouchableOpacity>
          
          <View style={styles.sliderTrack}>
            <View style={[
              styles.sliderFill,
              { width: `${(config.duration / maxDuration) * 100}%` }
            ]} />
          </View>
          
          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => onConfigChange({ 
              duration: Math.min(maxDuration, config.duration + 60) 
            })}
          >
            <Text style={styles.sliderButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ambient Sound</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ambientScroll}
        >
          {AMBIENT_SOUNDS.map((sound) => (
            <TouchableOpacity
              key={sound.id}
              style={[
                styles.ambientButton,
                config.ambientSound === sound.id && styles.activeAmbient
              ]}
              onPress={() => onConfigChange({ ambientSound: sound.id as AmbientSound })}
            >
              <Text style={styles.ambientIcon}>{sound.icon}</Text>
              <Text style={[
                styles.ambientText,
                config.ambientSound === sound.id && styles.activeAmbientText
              ]}>
                {sound.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Options</Text>
        
        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Adaptive Resonance</Text>
            <Text style={styles.optionDescription}>
              Evolving frequencies throughout session
            </Text>
          </View>
          <Switch
            value={config.adaptiveMode}
            onValueChange={(adaptiveMode) => onConfigChange({ adaptiveMode })}
            trackColor={{ false: '#424242', true: '#FFD700' }}
            thumbColor={config.adaptiveMode ? '#FFA000' : '#9E9E9E'}
            disabled={!isPremium}
          />
        </View>

        {!isPremium && config.adaptiveMode && (
          <Text style={styles.premiumNote}>⭐ Premium feature</Text>
        )}

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Loop Playback</Text>
            <Text style={styles.optionDescription}>
              Repeat session indefinitely
            </Text>
          </View>
          <Switch
            value={config.loopEnabled}
            onValueChange={(loopEnabled) => onConfigChange({ loopEnabled })}
            trackColor={{ false: '#424242', true: '#4CAF50' }}
            thumbColor={config.loopEnabled ? '#81C784' : '#9E9E9E'}
          />
        </View>

        <View style={styles.optionRow}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Evolution Speed</Text>
            <Text style={styles.optionDescription}>
              How fast frequencies change
            </Text>
          </View>
          <View style={styles.speedButtons}>
            {[0.5, 1, 1.5, 2].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  config.evolutionSpeed === speed && styles.activeSpeed
                ]}
                onPress={() => onConfigChange({ evolutionSpeed: speed })}
              >
                <Text style={[
                  styles.speedText,
                  config.evolutionSpeed === speed && styles.activeSpeedText
                ]}>
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Session Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Base Frequency:</Text>
          <Text style={styles.summaryValue}>{config.baseFrequency} Hz</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Brainwave State:</Text>
          <Text style={styles.summaryValue}>{config.brainwaveState.toUpperCase()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Harmonic Mode:</Text>
          <Text style={styles.summaryValue}>{config.harmonicMode}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Binaural Beats:</Text>
          <Text style={styles.summaryValue}>{config.binauralEnabled ? 'ON' : 'OFF'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Duration:</Text>
          <Text style={styles.summaryValue}>{formatTime(config.duration)}</Text>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  durationDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  durationValue: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFD700',
    letterSpacing: 2,
  },
  durationPresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activePreset: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  presetText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  activePresetText: {
    color: '#FFD700',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '300',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ambientScroll: {
    gap: 12,
  },
  ambientButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeAmbient: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  ambientIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  ambientText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeAmbientText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  premiumNote: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 4,
    fontStyle: 'italic',
  },
  speedButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  speedButton: {
    width: 40,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeSpeed: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderColor: '#2196F3',
  },
  speedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  activeSpeedText: {
    color: '#2196F3',
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SessionBuilder;
