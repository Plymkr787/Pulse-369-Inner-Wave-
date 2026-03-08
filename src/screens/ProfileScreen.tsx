import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Switch,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@store/appStore';
import { useSubscription } from '@hooks/useSubscription';
import { SupabaseService } from '@services/supabase';
import { VisualizationType } from '@types';

const ProfileScreen: React.FC = () => {
  const store = useAppStore();
  const subscription = useSubscription();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await SupabaseService.signOut();
      store.setUser(null);
      store.setAuthenticated(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleUpgrade = async () => {
    const success = await subscription.purchasePremium();
    if (success) {
      Alert.alert('Success', 'You are now a Premium member!');
    }
  };

  const handleRestore = async () => {
    const success = await subscription.restorePurchases();
    if (success) {
      Alert.alert('Success', 'Your purchases have been restored!');
    }
  };

  const visualizationTypes: { id: VisualizationType; name: string; icon: string }[] = [
    { id: 'sine', name: 'Sine Wave', icon: '〰️' },
    { id: 'harmonic', name: 'Harmonics', icon: '🔊' },
    { id: 'spiral', name: 'Fibonacci', icon: '🌀' },
    { id: 'sacred', name: 'Sacred Geometry', icon: '✡️' },
    { id: 'particles', name: 'Particles', icon: '✨' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {store.user?.email?.[0].toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.email}>{store.user?.email || 'Guest'}</Text>
            <View style={[
              styles.badge,
              subscription.isPremium ? styles.premiumBadge : styles.freeBadge
            ]}>
              <Text style={[
                styles.badgeText,
                subscription.isPremium ? styles.premiumBadgeText : styles.freeBadgeText
              ]}>
                {subscription.isPremium ? '⭐ PREMIUM' : 'FREE'}
              </Text>
            </View>
          </View>

          {!subscription.isPremium && (
            <View style={styles.upgradeSection}>
              <LinearGradient
                colors={['#FFD700', '#FFA000']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradePrice}>$9.99/month</Text>
                <Text style={styles.upgradeFeatures}>
                  • Unlimited sessions{'\n'}
                  • Voice frequency scan{'\n'}
                  • Adaptive resonance{'\n'}
                  • Advanced visualizations{'\n'}
                  • Session saving
                </Text>
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={handleUpgrade}
                  disabled={subscription.isLoading}
                >
                  <Text style={styles.upgradeButtonText}>
                    {subscription.isLoading ? 'Loading...' : 'Upgrade Now'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRestore}>
                  <Text style={styles.restoreText}>Restore Purchases</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visualization</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Enable Visualization</Text>
              <Switch
                value={store.visualizationEnabled}
                onValueChange={store.setVisualizationEnabled}
                trackColor={{ false: '#424242', true: '#4CAF50' }}
                thumbColor={store.visualizationEnabled ? '#81C784' : '#9E9E9E'}
              />
            </View>

            <Text style={styles.subOptionTitle}>Visualization Type</Text>
            <View style={styles.visualizationGrid}>
              {visualizationTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.visButton,
                    store.visualizationType === type.id && styles.activeVisButton
                  ]}
                  onPress={() => store.setVisualizationType(type.id)}
                >
                  <Text style={styles.visIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.visText,
                    store.visualizationType === type.id && styles.activeVisText
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Haptic Feedback</Text>
              <Switch
                value={store.preferences.hapticFeedback}
                onValueChange={(value) => store.updatePreferences({ hapticFeedback: value })}
                trackColor={{ false: '#424242', true: '#4CAF50' }}
                thumbColor={store.preferences.hapticFeedback ? '#81C784' : '#9E9E9E'}
              />
            </View>

            <View style={styles.optionRow}>
              <View>
                <Text style={styles.optionText}>Default Duration</Text>
                <Text style={styles.optionSubtext}>
                  {Math.floor(store.preferences.defaultDuration / 60)} minutes
                </Text>
              </View>
              <View style={styles.durationButtons}>
                <TouchableOpacity
                  style={styles.durationButton}
                  onPress={() => {
                    const newDuration = Math.max(300, store.preferences.defaultDuration - 300);
                    store.updatePreferences({ defaultDuration: newDuration });
                  }}
                >
                  <Text style={styles.durationButtonText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.durationButton}
                  onPress={() => {
                    const newDuration = Math.min(3600, store.preferences.defaultDuration + 300);
                    store.updatePreferences({ defaultDuration: newDuration });
                  }}
                >
                  <Text style={styles.durationButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0h</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text style={styles.signOutText}>
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Pulse 369 v1.0.0</Text>
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
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
  },
  email: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  freeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  premiumBadgeText: {
    color: '#FFD700',
  },
  freeBadgeText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  upgradeSection: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  upgradeGradient: {
    padding: 24,
  },
  upgradeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  upgradePrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  upgradeFeatures: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 22,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  restoreText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  section: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionText: {
    fontSize: 15,
    color: '#ffffff',
  },
  optionSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  subOptionTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 16,
    marginBottom: 12,
  },
  visualizationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  visButton: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeVisButton: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    borderColor: '#9C27B0',
  },
  visIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  visText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  activeVisText: {
    color: '#9C27B0',
    fontWeight: '600',
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  signOutButton: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
});

export default ProfileScreen;
