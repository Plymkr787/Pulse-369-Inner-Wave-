import { Audio } from 'expo-av';
import { 
  BrainwaveState, 
  SessionConfig, 
  BinauralConfig, 
  FrequencyLayer,
  AdaptivePhase 
} from '@types';
import { 
  BRAINWAVE_STATES, 
  FIBONACCI_SEQUENCE, 
  GOLDEN_RATIO, 
  TESLA_SEQUENCE,
  ADAPTIVE_PHASES,
  AUDIO_DEFAULTS 
} from '@constants';

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private binauralOscillators: { left: OscillatorNode | null; right: OscillatorNode | null } = { left: null, right: null };
  private binauralGains: { left: GainNode | null; right: GainNode | null } = { left: null, right: null };
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private currentPhase: number = 0;
  private phaseTimer: NodeJS.Timeout | null = null;
  private adaptiveInterval: NodeJS.Timeout | null = null;
  private currentConfig: SessionConfig | null = null;
  private onFrequencyChange: ((freq: number) => void) | null = null;
  private onPhaseChange: ((phase: AdaptivePhase) => void) | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: AUDIO_DEFAULTS.sampleRate
      });
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = AUDIO_DEFAULTS.defaultVolume;
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  async requestAudioPermissions() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
      });
    } catch (error) {
      console.error('Audio permissions error:', error);
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): { oscillator: OscillatorNode; gain: GainNode } {
    if (!this.audioContext || !this.masterGain) {
      throw new Error('AudioContext not initialized');
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.value = 0;
    gainNode.gain.setTargetAtTime(0.3, this.audioContext.currentTime, AUDIO_DEFAULTS.fadeInDuration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    return { oscillator, gain: gainNode };
  }

  private calculateHarmonics(baseFreq: number, mode: string): number[] {
    switch (mode) {
      case 'fibonacci':
        return FIBONACCI_SEQUENCE.map(f => baseFreq * (f / FIBONACCI_SEQUENCE[0]));
      case 'golden':
        return [baseFreq, baseFreq * GOLDEN_RATIO, baseFreq * Math.pow(GOLDEN_RATIO, 2)];
      case '369':
        return TESLA_SEQUENCE.map(t => baseFreq * (t / 3));
      default:
        return [baseFreq];
    }
  }

  private calculateBinauralOffset(state: BrainwaveState): number {
    const config = BRAINWAVE_STATES[state];
    const [min, max] = config.frequencyRange;
    return (min + max) / 2;
  }

  private startBinauralBeats(baseFreq: number, beatFreq: number) {
    if (!this.audioContext || !this.masterGain) return;

    this.stopBinauralBeats();

    const leftFreq = baseFreq;
    const rightFreq = baseFreq + beatFreq;

    const leftOsc = this.audioContext.createOscillator();
    const leftGain = this.audioContext.createGain();
    const rightOsc = this.audioContext.createOscillator();
    const rightGain = this.audioContext.createGain();

    const merger = this.audioContext.createChannelMerger(2);

    leftOsc.type = 'sine';
    leftOsc.frequency.value = leftFreq;
    leftGain.gain.value = 0;
    leftGain.gain.setTargetAtTime(0.25, this.audioContext.currentTime, AUDIO_DEFAULTS.fadeInDuration);

    rightOsc.type = 'sine';
    rightOsc.frequency.value = rightFreq;
    rightGain.gain.value = 0;
    rightGain.gain.setTargetAtTime(0.25, this.audioContext.currentTime, AUDIO_DEFAULTS.fadeInDuration);

    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);

    merger.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.binauralOscillators = { left: leftOsc, right: rightOsc };
    this.binauralGains = { left: leftGain, right: rightGain };
  }

  private stopBinauralBeats() {
    if (this.binauralOscillators.left && this.binauralOscillators.right) {
      const now = this.audioContext?.currentTime || 0;
      
      if (this.binauralGains.left) {
        this.binauralGains.left.gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
      }
      if (this.binauralGains.right) {
        this.binauralGains.right.gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
      }

      setTimeout(() => {
        this.binauralOscillators.left?.stop();
        this.binauralOscillators.right?.stop();
        this.binauralOscillators = { left: null, right: null };
        this.binauralGains = { left: null, right: null };
      }, AUDIO_DEFAULTS.fadeOutDuration * 1000 + 100);
    }
  }

  private startAdaptiveMode() {
    if (!this.currentConfig?.adaptiveMode) return;

    let phaseIndex = 0;
    
    const runPhase = () => {
      if (phaseIndex >= ADAPTIVE_PHASES.length) {
        phaseIndex = 0;
      }

      const phase = ADAPTIVE_PHASES[phaseIndex];
      this.applyPhase(phase);
      this.onPhaseChange?.(phase);

      this.phaseTimer = setTimeout(() => {
        phaseIndex++;
        runPhase();
      }, phase.duration * 1000);
    };

    runPhase();
  }

  private applyPhase(phase: AdaptivePhase) {
    this.stopAllOscillators();
    
    const harmonics = this.calculateHarmonics(phase.baseFrequency, phase.harmonicMode);
    harmonics.forEach((freq, index) => {
      const volume = 0.3 / (index + 1);
      this.addFrequencyLayer({
        id: `phase-${phase.id}-${index}`,
        frequency: freq,
        volume,
        enabled: true,
        waveform: 'sine'
      });
    });

    if (phase.binauralOffset > 0) {
      this.startBinauralBeats(phase.baseFrequency, phase.binauralOffset);
    }

    this.onFrequencyChange?.(phase.baseFrequency);
  }

  private stopAllOscillators() {
    const now = this.audioContext?.currentTime || 0;
    
    this.gainNodes.forEach(gain => {
      gain.gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
    });

    if (this.binauralGains.left) {
      this.binauralGains.left.gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
    }
    if (this.binauralGains.right) {
      this.binauralGains.right.gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
    }

    setTimeout(() => {
      this.oscillators.forEach(osc => osc.stop());
      this.oscillators = [];
      this.gainNodes = [];
      this.stopBinauralBeats();
    }, AUDIO_DEFAULTS.fadeOutDuration * 1000 + 100);
  }

  addFrequencyLayer(layer: FrequencyLayer) {
    if (!layer.enabled) return;

    const { oscillator, gain } = this.createOscillator(layer.frequency, layer.waveform);
    gain.gain.value = layer.volume;
    
    oscillator.start();
    this.oscillators.push(oscillator);
    this.gainNodes.push(gain);
  }

  removeFrequencyLayer(layerId: string) {
    const index = this.oscillators.findIndex((_, i) => 
      this.currentConfig?.layers[i]?.id === layerId
    );
    
    if (index >= 0) {
      const now = this.audioContext?.currentTime || 0;
      this.gainNodes[index].gain.setTargetAtTime(0, now, AUDIO_DEFAULTS.fadeOutDuration);
      
      setTimeout(() => {
        this.oscillators[index].stop();
        this.oscillators.splice(index, 1);
        this.gainNodes.splice(index, 1);
      }, AUDIO_DEFAULTS.fadeOutDuration * 1000 + 100);
    }
  }

  async startSession(config: SessionConfig) {
    if (this.isPlaying) {
      await this.stopSession();
    }

    this.currentConfig = config;

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (config.adaptiveMode) {
      this.startAdaptiveMode();
    } else {
      const baseFreq = config.baseFrequency;
      const harmonics = this.calculateHarmonics(baseFreq, config.harmonicMode);
      
      harmonics.forEach((freq, index) => {
        const volume = 0.3 / (index + 1);
        this.addFrequencyLayer({
          id: `layer-${index}`,
          frequency: freq,
          volume,
          enabled: true,
          waveform: 'sine'
        });
      });

      if (config.binauralEnabled) {
        const offset = config.binauralOffset || this.calculateBinauralOffset(config.brainwaveState);
        this.startBinauralBeats(baseFreq, offset);
      }

      this.onFrequencyChange?.(baseFreq);
    }

    this.isPlaying = true;
  }

  async stopSession() {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }

    if (this.adaptiveInterval) {
      clearInterval(this.adaptiveInterval);
      this.adaptiveInterval = null;
    }

    this.stopAllOscillators();
    this.isPlaying = false;
    this.currentPhase = 0;
  }

  setVolume(volume: number) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.1);
    }
  }

  getAnalyserData(): Uint8Array | null {
    if (!this.analyser) return null;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser) return null;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  isSessionPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentFrequency(): number {
    return this.currentConfig?.baseFrequency || 0;
  }

  onFrequencyUpdate(callback: (freq: number) => void) {
    this.onFrequencyChange = callback;
  }

  onPhaseUpdate(callback: (phase: AdaptivePhase) => void) {
    this.onPhaseChange = callback;
  }

  analyzeVoiceFrequency(audioBuffer: AudioBuffer): number {
    const channelData = audioBuffer.getChannelData(0);
    const bufferLength = channelData.length;
    
    let sum = 0;
    let crossings = 0;
    let lastSample = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.abs(channelData[i]);
      
      if (lastSample < 0 && channelData[i] >= 0) {
        crossings++;
      }
      lastSample = channelData[i];
    }
    
    const averageAmplitude = sum / bufferLength;
    const zeroCrossings = crossings;
    
    const duration = bufferLength / AUDIO_DEFAULTS.sampleRate;
    const estimatedFreq = (zeroCrossings / 2) / duration;
    
    return estimatedFreq > 80 && estimatedFreq < 1100 ? estimatedFreq : 440;
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
