import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@store/appStore';
import { SupabaseService } from '@services/supabase';
import { SavedSession, SessionConfig } from '@types';
import { BRAINWAVE_STATES } from '@constants';

const SessionsScreen: React.FC = () => {
  const store = useAppStore();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = store.canUsePremiumFeature();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      if (store.user?.id) {
        const data = await SupabaseService.getSavedSessions(store.user.id);
        setSessions(data);
        store.setSavedSessions(data);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await SupabaseService.deleteSavedSession(sessionId);
              store.removeSavedSession(sessionId);
              setSessions(prev => prev.filter(s => s.id !== sessionId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session');
            }
          }
        }
      ]
    );
  };

  const handleLoadSession = (session: SavedSession) => {
    store.setCurrentSession(session.config);
    Alert.alert('Session Loaded', 'The session has been loaded. Go to Home to play.');
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const getStateColor = (state: string): string => {
    return BRAINWAVE_STATES[state]?.color || '#666';
  };

  const renderSession = ({ item }: { item: SavedSession }) => (
    <TouchableOpacity 
      style={styles.sessionCard}
      onPress={() => handleLoadSession(item)}
      onLongPress={() => handleDeleteSession(item.id!)}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.sessionName}>{item.name}</Text>
          <View style={[
            styles.stateBadge,
            { backgroundColor: getStateColor(item.config.brainwaveState) }
          ]}>
            <Text style={styles.stateText}>
              {item.config.brainwaveState.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>{item.config.baseFrequency} Hz</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{formatDuration(item.config.duration)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Harmonic</Text>
            <Text style={styles.detailValue}>
              {item.config.harmonicMode === 'none' ? 'Off' : item.config.harmonicMode}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Created {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {item.config.binauralEnabled && (
            <View style={styles.binauralBadge}>
              <Text style={styles.binauralText}>🎧 Binaural</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e']}
          style={styles.background}
        >
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedIcon}>⭐</Text>
            <Text style={styles.lockedTitle}>Premium Feature</Text>
            <Text style={styles.lockedDescription}>
              Upgrade to Premium to save and manage your meditation sessions
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <LinearGradient
                colors={['#FFD700', '#FFA000']}
                style={styles.upgradeGradient}
              >
                <Text style={styles.upgradeText}>Upgrade Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Saved Sessions</Text>
          <Text style={styles.subtitle}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Saved Sessions</Text>
            <Text style={styles.emptyDescription}>
              Create and save sessions from the Home screen
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSession}
            keyExtractor={(item) => item.id!}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  sessionCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  binauralBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  binauralText: {
    fontSize: 11,
    color: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
  },
  lockedDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

export default SessionsScreen;
