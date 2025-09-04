import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DownloadsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Ionicons name="download-outline" size={64} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Downloads Coming Soon</Text>
        <Text style={styles.emptySubtitle}>
          Offline download functionality will be available in a future update
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DownloadsScreen;