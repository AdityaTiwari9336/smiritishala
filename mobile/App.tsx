import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AuthProvider } from '@/contexts/AuthContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AudioProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AudioProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}