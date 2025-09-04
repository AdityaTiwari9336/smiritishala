import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { DatabaseService, BookmarkedContent } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useAudio } from '@/contexts/AudioContext';

const BookmarksScreen = () => {
  const { user } = useAuth();
  const { playAudio } = useAudio();
  const [bookmarks, setBookmarks] = useState<BookmarkedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      const data = await DatabaseService.getUserBookmarks(user.id);
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (bookmark: BookmarkedContent) => {
    playAudio({
      id: bookmark.audio.id,
      title: bookmark.audio.title,
      url: bookmark.audio.url,
      subject: bookmark.audio.subject,
      topic: bookmark.audio.topic,
      duration: bookmark.audio.duration,
      is_premium: bookmark.audio.is_premium,
    });
  };

  const removeBookmark = async (audioId: string) => {
    if (!user) return;

    try {
      await DatabaseService.removeBookmark(user.id, audioId);
      setBookmarks(prev => prev.filter(b => b.audio_id !== audioId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  const renderBookmark = ({ item }: { item: BookmarkedContent }) => (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkInfo}>
        <Text style={styles.bookmarkTitle} numberOfLines={2}>
          {item.audio.title}
        </Text>
        <Text style={styles.bookmarkSubject}>
          {item.audio.subject} • {item.audio.topic}
        </Text>
        <View style={styles.bookmarkMeta}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={styles.metaText}>
            {Math.floor(item.audio.duration / 60)}:{(item.audio.duration % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
      <View style={styles.bookmarkActions}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handlePlayAudio(item)}
        >
          <Ionicons name="play" size={20} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeBookmark(item.audio_id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Sign In Required</Text>
        <Text style={styles.emptySubtitle}>
          Please sign in to view your bookmarks
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text style={styles.emptySubtitle}>
              Start bookmarking your favorite audio content
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F23',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  bookmarkCard: {
    backgroundColor: '#1F1F37',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  bookmarkSubject: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  bookmarkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  bookmarkActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 100,
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

export default BookmarksScreen;