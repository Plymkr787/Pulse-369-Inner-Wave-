import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVoiceAnalysis } from '@hooks/useVoiceAnalysis';
import { useAppStore } from '@store/appStore';

interface VoiceScannerProps {
  onSessionRecommended: (session: any) => void;
}

const VoiceScanner: React.FC<VoiceScannerProps> = ({ onSessionRecommended }) => {
  const store = useAppStore();
  const isPremium = store.canUsePremiumFeature();
  const { 
    isRecording, 
    isAnalyzing, 
    result, 
    error, 
    startRecording, 
    stopRecording, 
    resetAnalysis 
  } = useVoiceAnalysis();

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  if (!isPremium) {
    return (
      <View style={styles.lockedContainer}>
        <LinearGradient
          colors={['#FFD700', '#FFA000']}
          style={styles.lockedGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.lockedIcon}>⭐</Text>
          <Text style={styles.lockedTitle}>Voice Frequency Scan</Text>
          <Text style={styles.lockedDescription}>
            Unlock with Premium to analyze your voice and create personalized harmonic sessions
          </Text>
        </LinearGradient>
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Your Voice Analysis</Text>
        
        <View style={styles.frequencyCard}>
          <Text style={styles.frequencyLabel}>Dominant Frequency</Text>
          <Text style={styles.frequencyValue}>{result.dominantFrequency} Hz</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: `${result.confidence}%` }]} />
          </View>
          <Text style={styles.confidenceText}>{result.confidence}% Confidence</Text>
        </View>

        <View style={styles.harmonicsSection}>
          <Text style={styles.sectionTitle}>Detected Harmonics</Text>
          <View style={styles.harmonicsGrid}>
            {result.harmonics.map((freq, i) => (
              <View key={i} style={styles.harmonicItem}>
                <Text style={styles.harmonicValue}>{freq} Hz</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.useButton}
          onPress={() => onSessionRecommended(result.recommendedSession)}
        >
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.useButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.useButtonText}>Use Recommended Session</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetAnalysis}>
          <Text style={styles.resetButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Frequency Scanner</Text>
      <Text style={styles.subtitle}>
        Hum or sing naturally for 5 seconds to analyze your vocal frequency
      </Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingButton
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isRecording ? ['#F44336', '#D32F2F'] : ['#9C27B0', '#7B1FA2']}
            style={styles.recordGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.recordIcon}>
              {isRecording ? '⏹' : '🎤'}
            </Text>
            <Text style={styles.recordText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {isAnalyzing && (
        <View style={styles.analyzingContainer}>
          <Text style={styles.analyzingText}>Analyzing your voice...</Text>
          <View style={styles.waveContainer}>
            {[...Array(5)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    animationDelay: `${i * 0.1}s`,
                    height: 20 + Math.random() * 30
                  }
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for best results:</Text>
        <Text style={styles.tipItem}>• Hum a comfortable note</Text>
        <Text style={styles.tipItem}>• Keep steady volume</Text>
        <Text style={styles.tipItem}>• Minimize background noise</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  recordButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  recordingButton: {
    shadowColor: '#F44336',
  },
  recordGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  recordText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  analyzingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  analyzingText: {
    fontSize: 16,
    color: '#9C27B0',
    fontWeight: '600',
    marginBottom: 16,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 60,
  },
  waveBar: {
    width: 8,
    backgroundColor: '#9C27B0',
    borderRadius: 4,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
  },
  tipsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  lockedContainer: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  lockedGradient: {
    padding: 24,
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  lockedDescription: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  frequencyCard: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.3)',
  },
  frequencyLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  frequencyValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#9C27B0',
    marginBottom: 16,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  harmonicsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  harmonicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  harmonicItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  harmonicValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  useButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  useButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  resetButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default VoiceScanner;
