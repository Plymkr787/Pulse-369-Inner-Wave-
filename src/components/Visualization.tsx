import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { 
  Path, 
  Circle, 
  G, 
  Line, 
  Polygon,
  Defs,
  LinearGradient,
  Stop
} from 'react-native-svg';
import { useAppStore } from '@store/appStore';
import { VisualizationType, BrainwaveState } from '@types';
import { VISUALIZATION_COLORS } from '@constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VISUALIZATION_SIZE = SCREEN_WIDTH - 40;

interface VisualizationProps {
  type: VisualizationType;
  isPlaying: boolean;
  frequency: number;
  brainwaveState: BrainwaveState;
}

const Visualization: React.FC<VisualizationProps> = ({
  type,
  isPlaying,
  frequency,
  brainwaveState
}) => {
  const store = useAppStore();
  const animationRef = useRef<number>(0);
  const [animationFrame, setAnimationFrame] = React.useState(0);

  const colors = VISUALIZATION_COLORS[brainwaveState];

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimationFrame(prev => prev + 1);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const generateSineWave = useCallback(() => {
    const points: string[] = [];
    const amplitude = 60;
    const frequency_factor = frequency / 100;
    const phase = animationFrame * 0.05;
    
    for (let x = 0; x <= VISUALIZATION_SIZE; x += 2) {
      const y = VISUALIZATION_SIZE / 2 + 
        amplitude * Math.sin((x / VISUALIZATION_SIZE) * Math.PI * 4 * frequency_factor + phase);
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  }, [frequency, animationFrame]);

  const generateHarmonicWaves = useCallback(() => {
    const waves: string[] = [];
    const baseAmplitude = 40;
    const phase = animationFrame * 0.03;
    
    for (let h = 1; h <= 3; h++) {
      const points: string[] = [];
      const amplitude = baseAmplitude / h;
      
      for (let x = 0; x <= VISUALIZATION_SIZE; x += 3) {
        const y = VISUALIZATION_SIZE / 2 + 
          amplitude * Math.sin((x / VISUALIZATION_SIZE) * Math.PI * 4 * h + phase * h);
        points.push(`${x},${y}`);
      }
      
      waves.push(`M ${points.join(' L ')}`);
    }
    
    return waves;
  }, [animationFrame]);

  const generateFibonacciSpiral = useCallback(() => {
    const points: string[] = [];
    const centerX = VISUALIZATION_SIZE / 2;
    const centerY = VISUALIZATION_SIZE / 2;
    const phi = 1.618033988749895;
    const rotation = animationFrame * 0.01;
    
    for (let i = 0; i < 500; i++) {
      const angle = i * 0.1 + rotation;
      const radius = Math.sqrt(i) * 8;
      const x = centerX + radius * Math.cos(angle * phi);
      const y = centerY + radius * Math.sin(angle * phi);
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  }, [animationFrame]);

  const generateSacredGeometry = useCallback(() => {
    const centerX = VISUALIZATION_SIZE / 2;
    const centerY = VISUALIZATION_SIZE / 2;
    const rotation = animationFrame * 0.02;
    
    const polygons: string[] = [];
    
    for (let i = 3; i <= 8; i++) {
      const radius = 30 + i * 15;
      const points: string[] = [];
      
      for (let j = 0; j < i; j++) {
        const angle = (j / i) * Math.PI * 2 + rotation;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      
      polygons.push(points.join(' '));
    }
    
    return polygons;
  }, [animationFrame]);

  const generateParticles = useCallback(() => {
    const particles: { x: number; y: number; size: number; opacity: number }[] = [];
    const centerX = VISUALIZATION_SIZE / 2;
    const centerY = VISUALIZATION_SIZE / 2;
    const time = animationFrame * 0.02;
    
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2 + time;
      const distance = 50 + Math.sin(time + i * 0.5) * 30;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      const size = 2 + Math.sin(time * 2 + i) * 2;
      const opacity = 0.3 + Math.sin(time + i * 0.3) * 0.4;
      
      particles.push({ x, y, size, opacity });
    }
    
    return particles;
  }, [animationFrame]);

  const renderVisualization = () => {
    switch (type) {
      case 'sine':
        return (
          <Svg width={VISUALIZATION_SIZE} height={VISUALIZATION_SIZE}>
            <Defs>
              <LinearGradient id="sineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="50%" stopColor={colors[1]} />
                <Stop offset="100%" stopColor={colors[2]} />
              </LinearGradient>
            </Defs>
            <Path
              d={generateSineWave()}
              fill="none"
              stroke="url(#sineGradient)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'harmonic':
        return (
          <Svg width={VISUALIZATION_SIZE} height={VISUALIZATION_SIZE}>
            <Defs>
              <LinearGradient id="harmonicGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[0]} stopOpacity={0.8} />
                <Stop offset="100%" stopColor={colors[1]} stopOpacity={0.8} />
              </LinearGradient>
              <LinearGradient id="harmonicGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[1]} stopOpacity={0.6} />
                <Stop offset="100%" stopColor={colors[2]} stopOpacity={0.6} />
              </LinearGradient>
              <LinearGradient id="harmonicGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors[2]} stopOpacity={0.4} />
                <Stop offset="100%" stopColor={colors[0]} stopOpacity={0.4} />
              </LinearGradient>
            </Defs>
            {generateHarmonicWaves().map((wave, i) => (
              <Path
                key={i}
                d={wave}
                fill="none"
                stroke={`url(#harmonicGradient${i + 1})`}
                strokeWidth={3 - i * 0.5}
                strokeLinecap="round"
              />
            ))}
          </Svg>
        );

      case 'spiral':
        return (
          <Svg width={VISUALIZATION_SIZE} height={VISUALIZATION_SIZE}>
            <Defs>
              <LinearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="50%" stopColor={colors[1]} />
                <Stop offset="100%" stopColor={colors[2]} />
              </LinearGradient>
            </Defs>
            <Path
              d={generateFibonacciSpiral()}
              fill="none"
              stroke="url(#spiralGradient)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Circle
              cx={VISUALIZATION_SIZE / 2}
              cy={VISUALIZATION_SIZE / 2}
              r={5}
              fill={colors[1]}
            />
          </Svg>
        );

      case 'sacred':
        return (
          <Svg width={VISUALIZATION_SIZE} height={VISUALIZATION_SIZE}>
            <Defs>
              <LinearGradient id="sacredGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors[0]} stopOpacity={0.3} />
                <Stop offset="50%" stopColor={colors[1]} stopOpacity={0.5} />
                <Stop offset="100%" stopColor={colors[2]} stopOpacity={0.3} />
              </LinearGradient>
            </Defs>
            <G transform={`rotate(${animationFrame * 0.5}, ${VISUALIZATION_SIZE / 2}, ${VISUALIZATION_SIZE / 2})`}>
              {generateSacredGeometry().map((points, i) => (
                <Polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="url(#sacredGradient)"
                  strokeWidth={1.5}
                />
              ))}
            </G>
            <Circle
              cx={VISUALIZATION_SIZE / 2}
              cy={VISUALIZATION_SIZE / 2}
              r={8}
              fill={colors[1]}
              opacity={0.8}
            />
          </Svg>
        );

      case 'particles':
        return (
          <Svg width={VISUALIZATION_SIZE} height={VISUALIZATION_SIZE}>
            <Defs>
              <LinearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors[0]} />
                <Stop offset="50%" stopColor={colors[1]} />
                <Stop offset="100%" stopColor={colors[2]} />
              </LinearGradient>
            </Defs>
            {generateParticles().map((particle, i) => (
              <Circle
                key={i}
                cx={particle.x}
                cy={particle.y}
                r={particle.size}
                fill="url(#particleGradient)"
                opacity={particle.opacity}
              />
            ))}
            <Circle
              cx={VISUALIZATION_SIZE / 2}
              cy={VISUALIZATION_SIZE / 2}
              r={15}
              fill="none"
              stroke={colors[1]}
              strokeWidth={2}
              opacity={0.5}
            />
          </Svg>
        );

      default:
        return null;
    }
  };

  if (!store.visualizationEnabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.visualizationWrapper}>
        {renderVisualization()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  visualizationWrapper: {
    width: VISUALIZATION_SIZE,
    height: VISUALIZATION_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: VISUALIZATION_SIZE / 2,
    overflow: 'hidden',
  },
});

export default Visualization;
