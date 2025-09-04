import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { DatabaseService } from '@/lib/database';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/AppNavigator';

type TopicDetailRouteProp = RouteProp<RootStackParamList, 'TopicDetail'>;

interface Audio {
  id: string;
  title: string;
  url: string;
  subject: string;
  topic: string;
  duration: number;
  is_premium: boolean;
  play_count: number;
}

const TopicDetailScreen = () => {
  const route = useRoute<TopicDetailRouteProp>();
  const { topicId } = route.params;
  const { user } = useAuth();
  const { playAudio, currentAudio, isPlaying } = useAudio();
  
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedAudios, setBookmarkedAudios] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTopicAudios();
    if (user) {
      loadBookmarks();
    }
  }, [topicId, user]);

  const loadTopicAudios = async () => {
    try {
      const data = await DatabaseService.getTopicAudios(topicId);
      setAudios(data || []);
    } catch (error) {
      console.error('Error loading topic audios:', error);
      Alert.alert('Error', 'Failed to load audio content');
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      const bookmarks = await DatabaseService.getUserBookmarks(user.id);
      const bookmarkedIds = new Set(bookmarks.map(b => b.audio_id));
      setBookmarkedAudios(bookmarkedIds);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handlePlayAudio = (audio: Audio) => {
    playAudio({
      id: audio.id,
      title: audio.title,
      url: audio.url,
      subject: audio.subject,
      topic: audio.topic,
      duration: audio.duration,
      is_premium: audio.is_premium,
    });
  };

  const toggleBookmark = async (audioId: string) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to bookmark content');
      return;
    }

    try {
      const isBookmarked = bookmarkedAudios.has(audioId);
      
      if (isBookmarked) {
        await DatabaseService.removeBookmark(user.id, audioId);
        setBookmarkedAudios(prev => {
          const newSet = new Set(prev);
          newSet.delete(audioId);
          return newSet;
        });
      } else {
        await DatabaseService.addBookmark(user.id, audioId);
        setBookmarkedAudios(prev => new Set(prev).add(audioId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0F0F23', '#1F1F37']} style={styles.header}>
        <Text style={styles.title}>Topic Audio Content</Text>
        <Text style={styles.subtitle}>{audios.length} audio files available</Text>
      </LinearGradient>

      {/* Audio List */}
      <View style={styles.audioList}>
        {audios.map((audio, index) => (
          <View key={audio.id} style={styles.audioCard}>
            <View style={styles.audioInfo}>
              <View style={styles.audioHeader}>
                <Text style={styles.audioTitle} numberOfLines={2}>
                  {audio.title}
                </Text>
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={() => toggleBookmark(audio.id)}
                >
                  <Ionicons
                    name={bookmarkedAudios.has(audio.id) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={bookmarkedAudios.has(audio.id) ? '#6366f1' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.audioMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.metaText}>{formatDuration(audio.duration)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="play-outline" size={14} color="#9CA3AF" />
                  <Text style={styles.metaText}>{audio.play_count} plays</Text>
                </View>
                {audio.is_premium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.playButton,
                currentAudio?.id === audio.id && isPlaying && styles.playingButton
              ]}
              onPress={() => handlePlayAudio(audio)}
            >
              <LinearGradient
                colors={
                  currentAudio?.id === audio.id && isPlaying
                    ? ['#EF4444', '#DC2626']
                    : ['#6366f1', '#8b5cf6']
                }
                style={styles.playButtonGradient}
              >
                <Ionicons
                  name={
                    currentAudio?.id === audio.id && isPlaying
                      ? 'pause'
                      : 'play'
                  }
                  size={20}
                  color="white"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {audios.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Audio Content</Text>
          <Text style={styles.emptySubtitle}>
            This topic doesn't have any audio content yet.
          </Text>
        </View>
      )}
    </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  audioList: {
    padding: 16,
  },
  audioCard: {
    backgroundColor: '#1F1F37',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioInfo: {
    flex: 1,
    marginRight: 12,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 2,
  },
  playButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  playingButton: {
    // Additional styles for playing state if needed
  },
  playButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
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

export default TopicDetailScreen;