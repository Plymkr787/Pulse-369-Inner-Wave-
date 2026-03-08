import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrainwaveSelector from '@components/BrainwaveSelector';
import FrequencyPresets from '@components/FrequencyPresets';
import HarmonicEngine from '@components/HarmonicEngine';
import BinauralBeats from '@components/BinauralBeats';
import VoiceScanner from '@components/VoiceScanner';
import Visualization from '@components/Visualization';
import SessionBuilder from '@components/SessionBuilder';
import PlayControls from '@components/PlayControls';
import { useAudio } from '@hooks/useAudio';
import { useAppStore } from '@store/appStore';
import { 
  BrainwaveState, 
  FrequencyPreset, 
  HarmonicMode, 
  SessionConfig,
  BinauralConfig,
  VisualizationType
} from '@types';
import { BRAINWAVE_STATES, DEFAULT_SESSION_DURATION } from '@constants';

const HomeScreen: React.FC = () => {
  const store = useAppStore();
  const audio = useAudio();

  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    name: 'Custom Session',
    duration: DEFAULT_SESSION_DURATION,
    baseFrequency: 528,
    brainwaveState: 'alpha',
    harmonicMode: 'none',
    binauralEnabled: true,
    binauralOffset: 10,
    ambientSound: 'none',
    layers: [],
    evolutionSpeed: 1,
    loopEnabled: false,
    adaptiveMode: false
  });

  const [binauralConfig, setBinauralConfig] = useState<BinauralConfig>({
    enabled: true,
    leftFrequency: 528,
    rightFrequency: 538,
    beatFrequency: 10
  });

  const [selectedPreset, setSelectedPreset] = useState<FrequencyPreset | null>('528');
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('sine');

  const updateSessionConfig = useCallback((updates: Partial<SessionConfig>) => {
    setSessionConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBinauralConfig = useCallback((updates: Partial<BinauralConfig>) => {
    setBinauralConfig(prev => ({ ...prev, ...updates }));
    if (updates.leftFrequency || updates.rightFrequency) {
      const left = updates.leftFrequency ?? prev.leftFrequency;
      const right = updates.rightFrequency ?? prev.rightFrequency;
      updateSessionConfig({
        binauralOffset: Math.abs(right - left)
      });
    }
  }, [updateSessionConfig]);

  const handleBrainwaveSelect = useCallback((state: BrainwaveState) => {
    updateSessionConfig({ brainwaveState: state });
    store.setCurrentBrainwaveState(state);
    
    const range = BRAINWAVE_STATES[state].frequencyRange;
    const beatFreq = (range[0] + range[1]) / 2;
    updateBinauralConfig({
      beatFrequency: beatFreq,
      rightFrequency: sessionConfig.baseFrequency + beatFreq
    });
  }, [updateSessionConfig, updateBinauralConfig, sessionConfig.baseFrequency, store]);

  const handleFrequencySelect = useCallback((preset: FrequencyPreset) => {
    setSelectedPreset(preset);
    const freqMap: Record<FrequencyPreset, number> = {
      '417': 417,
      '432': 432,
      '528': 528,
      '639': 639,
      '741': 741,
      '852': 852,
      'schumann': 7.83
    };
    const newFreq = freqMap[preset];
    updateSessionConfig({ baseFrequency: newFreq });
    updateBinauralConfig({
      leftFrequency: newFreq,
      rightFrequency: newFreq + binauralConfig.beatFrequency
    });
  }, [updateSessionConfig, updateBinauralConfig, binauralConfig.beatFrequency]);

  const handleCustomFrequencyChange = useCallback((freq: number) => {
    setSelectedPreset(null);
    updateSessionConfig({ baseFrequency: freq });
    updateBinauralConfig({
      leftFrequency: freq,
      rightFrequency: freq + binauralConfig.beatFrequency
    });
  }, [updateSessionConfig, updateBinauralConfig, binauralConfig.beatFrequency]);

  const handleHarmonicModeSelect = useCallback((mode: HarmonicMode) => {
    updateSessionConfig({ harmonicMode: mode });
  }, [updateSessionConfig]);

  const handleSessionRecommended = useCallback((recommendedSession: any) => {
    setSessionConfig(prev => ({ ...prev, ...recommendedSession }));
  }, []);

  const handlePlay = useCallback(() => {
    const fullConfig: SessionConfig = {
      ...sessionConfig,
      binauralEnabled: binauralConfig.enabled,
      binauralOffset: binauralConfig.beatFrequency
    };
    audio.startSession(fullConfig);
  }, [sessionConfig, binauralConfig, audio]);

  const handlePause = useCallback(() => {
    audio.pauseSession();
  }, [audio]);

  const handleStop = useCallback(() => {
    audio.stopSession();
  }, [audio]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e', '#16213e']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Pulse 369</Text>
            <Text style={styles.subtitle}>Inner Wave</Text>
          </View>

          <Visualization
            type={visualizationType}
            isPlaying={audio.isPlaying}
            frequency={audio.currentFrequency}
            brainwaveState={sessionConfig.brainwaveState}
          />

          <BrainwaveSelector
            selectedState={sessionConfig.brainwaveState}
            onSelect={handleBrainwaveSelect}
          />

          <FrequencyPresets
            selectedPreset={selectedPreset}
            customFrequency={sessionConfig.baseFrequency}
            onSelectPreset={handleFrequencySelect}
            onCustomFrequencyChange={handleCustomFrequencyChange}
          />

          <HarmonicEngine
            selectedMode={sessionConfig.harmonicMode}
            baseFrequency={sessionConfig.baseFrequency}
            onSelectMode={handleHarmonicModeSelect}
          />

          <BinauralBeats
            config={binauralConfig}
            baseFrequency={sessionConfig.baseFrequency}
            brainwaveState={sessionConfig.brainwaveState}
            onConfigChange={updateBinauralConfig}
          />

          <VoiceScanner onSessionRecommended={handleSessionRecommended} />

          <SessionBuilder
            config={sessionConfig}
            onConfigChange={updateSessionConfig}
          />

          <PlayControls
            isPlaying={audio.isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            timeRemaining={audio.sessionTimeRemaining}
            progress={audio.sessionProgress}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {store.subscriptionTier === 'premium' ? '⭐ Premium' : 'Free Version'}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 4,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

export default HomeScreen;
