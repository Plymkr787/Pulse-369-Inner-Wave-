import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from './src/store/appStore';
import { SupabaseService } from './src/services/supabase';

import HomeScreen from './src/screens/HomeScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const icons: Record<string, string> = {
    Home: '🎵',
    Sessions: '💾',
    Profile: '👤',
  };

  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      <Text style={styles.tabIcon}>{icons[name] || '•'}</Text>
    </View>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={['transparent', 'rgba(10, 10, 15, 0.95)']}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Play' }}
      />
      <Tab.Screen 
        name="Sessions" 
        component={SessionsScreen}
        options={{ tabBarLabel: 'Sessions' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const store = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (user) {
        store.setUser({
          id: user.id,
          email: user.email!,
          created_at: user.created_at || new Date().toISOString(),
          subscription_status: 'free',
          preferences: store.preferences
        });
        store.setAuthenticated(true);
      }
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsInitializing(false);
      store.setLoading(false);
    }
  };

  if (isInitializing || store.isLoading) {
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e']}
          style={styles.loadingContainer}
        >
          <StatusBar style="light" />
          <Text style={styles.loadingLogo}>🌊</Text>
          <Text style={styles.loadingTitle}>Pulse 369</Text>
          <ActivityIndicator size="large" color="#FFD700" style={styles.loadingIndicator} />
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!store.isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0f',
  },
  loadingLogo: {
    fontSize: 80,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 24,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: 20,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  tabIcon: {
    fontSize: 20,
  },
});

export default App;
