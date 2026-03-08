import { useState, useCallback, useRef } from 'react';
import { audioEngine } from '@services/audioEngine';
import { VoiceAnalysisResult, SessionConfig } from '@types';
import { FREQUENCY_PRESETS, BRAINWAVE_STATES } from '@constants';

export const useVoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const findClosestPreset = (frequency: number): number => {
    const presets = Object.values(FREQUENCY_PRESETS).map(p => p.frequency);
    return presets.reduce((closest, current) => 
      Math.abs(current - frequency) < Math.abs(closest - frequency) ? current : closest
    );
  };

  const generateHarmonics = (baseFreq: number): number[] => {
    return [
      baseFreq * 2,
      baseFreq * 3,
      baseFreq * 1.618,
      baseFreq * 0.618
    ].filter(f => f > 20 && f < 20000);
  };

  const createRecommendedSession = (dominantFreq: number): Partial<SessionConfig> => {
    const baseFreq = findClosestPreset(dominantFreq);
    const harmonics = generateHarmonics(dominantFreq);
    
    let recommendedBrainwave = 'alpha';
    if (dominantFreq < 200) recommendedBrainwave = 'delta';
    else if (dominantFreq < 300) recommendedBrainwave = 'theta';
    else if (dominantFreq < 500) recommendedBrainwave = 'alpha';
    else if (dominantFreq < 800) recommendedBrainwave = 'beta';
    else recommendedBrainwave = 'gamma';

    return {
      name: `Personalized ${Math.round(dominantFreq)} Hz Session`,
      baseFrequency: baseFreq,
      brainwaveState: recommendedBrainwave as any,
      harmonicMode: 'golden',
      binauralEnabled: true,
      binauralOffset: BRAINWAVE_STATES[recommendedBrainwave].frequencyRange[0] + 2,
      layers: harmonics.map((freq, i) => ({
        id: `harmonic-${i}`,
        frequency: freq,
        volume: 0.15 / (i + 1),
        enabled: true,
        waveform: 'sine'
      })),
      duration: 900,
      adaptiveMode: false
    };
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setResult(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsAnalyzing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          const dominantFrequency = audioEngine.analyzeVoiceFrequency(audioBuffer);
          const harmonics = generateHarmonics(dominantFrequency);
          const recommendedSession = createRecommendedSession(dominantFrequency);

          const analysisResult: VoiceAnalysisResult = {
            dominantFrequency: Math.round(dominantFrequency),
            harmonics: harmonics.map(f => Math.round(f)),
            confidence: Math.min(100, Math.round((dominantFrequency / 440) * 50)),
            recommendedSession
          };

          setResult(analysisResult);
        } catch (err) {
          setError('Failed to analyze voice. Please try again.');
          console.error('Voice analysis error:', err);
        } finally {
          setIsAnalyzing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 5000);

    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setResult(null);
    setError(null);
    audioChunksRef.current = [];
  }, []);

  return {
    isRecording,
    isAnalyzing,
    result,
    error,
    startRecording,
    stopRecording,
    resetAnalysis
  };
};

export default useVoiceAnalysis;
