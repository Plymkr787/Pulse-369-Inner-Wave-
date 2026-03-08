import { useEffect, useRef, useCallback, useState } from 'react';
import { audioEngine } from '@services/audioEngine';
import { useAppStore } from '@store/appStore';
import { SessionConfig, AdaptivePhase } from '@types';

export const useAudio = () => {
  const store = useAppStore();
  const [currentPhase, setCurrentPhase] = useState<AdaptivePhase | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioEngine.onFrequencyUpdate((freq) => {
      store.setCurrentFrequency(freq);
    });

    audioEngine.onPhaseUpdate((phase) => {
      setCurrentPhase(phase);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startSession = useCallback(async (config: SessionConfig) => {
    await audioEngine.requestAudioPermissions();
    await audioEngine.startSession(config);
    
    store.setCurrentSession(config);
    store.setIsPlaying(true);
    store.setSessionTimeRemaining(config.duration);
    
    const startTime = Date.now();
    const durationMs = config.duration * 1000;
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, config.duration - Math.floor(elapsed / 1000));
      const progress = Math.min(100, (elapsed / durationMs) * 100);
      
      store.setSessionTimeRemaining(remaining);
      store.setSessionProgress(progress);
      
      if (remaining <= 0) {
        if (!config.loopEnabled) {
          stopSession();
        } else {
          startSession(config);
        }
      }
    }, 1000);
  }, []);

  const stopSession = useCallback(async () => {
    await audioEngine.stopSession();
    store.setIsPlaying(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const pauseSession = useCallback(async () => {
    await audioEngine.stopSession();
    store.setIsPlaying(false);
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  const resumeSession = useCallback(async () => {
    if (store.currentSession) {
      await audioEngine.startSession(store.currentSession);
      store.setIsPlaying(true);
    }
  }, [store.currentSession]);

  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
    store.setMasterVolume(volume);
  }, []);

  const getVisualizationData = useCallback(() => {
    return {
      frequency: audioEngine.getAnalyserData(),
      waveform: audioEngine.getWaveformData()
    };
  }, []);

  return {
    isPlaying: store.isPlaying,
    currentFrequency: store.currentFrequency,
    sessionTimeRemaining: store.sessionTimeRemaining,
    sessionProgress: store.sessionProgress,
    masterVolume: store.masterVolume,
    currentPhase,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    setVolume,
    getVisualizationData
  };
};

export default useAudio;
