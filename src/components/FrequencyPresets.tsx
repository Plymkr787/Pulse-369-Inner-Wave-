import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FrequencyPreset } from '@types';
import { FREQUENCY_PRESETS } from '@constants';

interface FrequencyPresetsProps {
  selectedPreset: FrequencyPreset | null;
  customFrequency: number;
  onSelectPreset: (preset: FrequencyPreset) => void;
  onCustomFrequencyChange: (freq: number) => void;
}

const FrequencyPresets: React.FC<FrequencyPresetsProps> = ({
  selectedPreset,
  customFrequency,
  onSelectPreset,
  onCustomFrequencyChange
}) => {
  const presets = Object.values(FREQUENCY_PRESETS);

  const getGradientColors = (presetId: string): [string, string] => {
    const colors: Record<string, [string, string]> = {
      '417': ['#FF6B6B', '#EE5A5A'],
      '432': ['#4ECDC4', '#44A08D'],
      '528': ['#FFE66D', '#FFD93D'],
      '639': ['#95E1D3', '#7ED7C5'],
      '741': ['#F38181', '#E06767'],
      '852': ['#AA96DA', '#9A7FD8'],
      'schumann': ['#FCBAD3', '#F9A8C9']
    };
    return colors[presetId] || ['#666', '#888'];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequency Presets</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          
          return (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetButton,
                isSelected && styles.selectedPreset
              ]}
              onPress={() => onSelectPreset(preset.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getGradientColors(preset.id)}
                style={styles.presetGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.presetFrequency}>
                  {preset.frequency < 100 ? preset.frequency.toFixed(2) : preset.frequency}
                </Text>
                <Text style={styles.presetUnit}>Hz</Text>
                <Text style={styles.presetName} numberOfLines={1}>
                  {preset.name.replace(' Hz', '')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.customContainer}>
        <Text style={styles.customLabel}>Custom Frequency</Text>
        <View style={styles.customInputContainer}>
          <TouchableOpacity 
            style={styles.adjustButton}
            onPress={() => onCustomFrequencyChange(Math.max(20, customFrequency - 1))}
          >
            <Text style={styles.adjustButtonText}>−</Text>
          </TouchableOpacity>
          
          <View style={styles.frequencyDisplay}>
            <Text style={styles.frequencyValue}>{customFrequency}</Text>
            <Text style={styles.frequencyUnit}>Hz</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.adjustButton}
            onPress={() => onCustomFrequencyChange(Math.min(20000, customFrequency + 1))}
          >
            <Text style={styles.adjustButtonText}>+</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  presetButton: {
    width: 100,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  presetGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  presetFrequency: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  presetUnit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  presetName: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  customContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  customLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  adjustButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '300',
  },
  frequencyDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  frequencyValue: {
    fontSize: 48,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -1,
  },
  frequencyUnit: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
});

export default FrequencyPresets;
