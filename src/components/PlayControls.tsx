import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@store/appStore';

interface PlayControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  timeRemaining: number;
  progress: number;
}

const PlayControls: React.FC<PlayControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  timeRemaining,
  progress
}) => {
  const store = useAppStore();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={onStop}
        >
          <LinearGradient
            colors={['#F44336', '#D32F2F']}
            style={styles.controlGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.controlIcon}>⏹</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={isPlaying ? onPause : onPlay}
        >
          <LinearGradient
            colors={isPlaying ? ['#FF9800', '#F57C00'] : ['#4CAF50', '#388E3C']}
            style={styles.playGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            const newVolume = Math.min(1, store.masterVolume + 0.1);
            store.setMasterVolume(newVolume);
          }}
        >
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.controlGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.controlIcon}>🔊</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => store.setMasterVolume(Math.max(0, store.masterVolume - 0.1))}
        >
          <Text style={styles.volumeIcon}>🔉</Text>
        </TouchableOpacity>
        
        <View style={styles.volumeBar}>
          <View style={[styles.volumeFill, { width: `${store.masterVolume * 100}%` }]} />
        </View>
        
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => store.setMasterVolume(Math.min(1, store.masterVolume + 0.1))}
        >
          <Text style={styles.volumeIcon}>🔊</Text>
        </TouchableOpacity>
        
        <Text style={styles.volumeText}>{Math.round(store.masterVolume * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
    marginTop: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  controlGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  playButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  playGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 36,
    color: '#ffffff',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeIcon: {
    fontSize: 16,
  },
  volumeBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  volumeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    width: 40,
    textAlign: 'right',
  },
});

export default PlayControls;
