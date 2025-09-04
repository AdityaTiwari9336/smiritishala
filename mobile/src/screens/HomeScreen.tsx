import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { DatabaseService, TopicWithStats } from '@/lib/database';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useAuth } from '@/contexts/AuthContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [trendingTopics, setTrendingTopics] = useState<TopicWithStats[]>([]);
  const [recommendedTopics, setRecommendedTopics] = useState<TopicWithStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [trending, recommended] = await Promise.all([
        DatabaseService.getTrendingTopics(10),
        DatabaseService.getRecommendedTopics(user?.id, 8),
      ]);
      
      setTrendingTopics(trending);
      setRecommendedTopics(recommended);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const navigateToTopic = (topicId: string) => {
    navigation.navigate('TopicDetail', { topicId });
  };

  const navigateToSubject = (subjectName: string) => {
    navigation.navigate('SubjectPlaylist', { subjectName });
  };

  const renderTopicCard = (topic: TopicWithStats, size: 'large' | 'medium' = 'medium') => {
    const cardWidth = size === 'large' ? width - 32 : (width - 48) / 2;
    
    return (
      <TouchableOpacity
        key={topic.id}
        style={[styles.topicCard, { width: cardWidth }]}
        onPress={() => navigateToTopic(topic.id)}
      >
        <View style={styles.imageContainer}>
          {topic.cover_image_url ? (
            <Image source={{ uri: topic.cover_image_url }} style={styles.topicImage} />
          ) : (
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.placeholderImage}
            >
              <Ionicons name="book-outline" size={32} color="white" />
            </LinearGradient>
          )}
          <View style={styles.audioCountBadge}>
            <Text style={styles.audioCountText}>{topic.audio_count}</Text>
          </View>
        </View>
        
        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle} numberOfLines={2}>
            {topic.name}
          </Text>
          <Text style={styles.topicSubject}>
            {topic.subject_name} • {topic.chapter_name}
          </Text>
          {topic.description && size === 'large' && (
            <Text style={styles.topicDescription} numberOfLines={2}>
              {topic.description}
            </Text>
          )}
          <View style={styles.topicMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>{formatDuration(topic.total_duration)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>{topic.total_plays.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const categories = [
    { name: 'Mathematics', icon: 'calculator-outline', color: '#3B82F6' },
    { name: 'Science', icon: 'flask-outline', color: '#10B981' },
    { name: 'History', icon: 'library-outline', color: '#F59E0B' },
    { name: 'Literature', icon: 'book-outline', color: '#EF4444' },
    { name: 'Geography', icon: 'earth-outline', color: '#8B5CF6' },
    { name: 'Physics', icon: 'nuclear-outline', color: '#06B6D4' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Hero Section */}
      <LinearGradient colors={['#0F0F23', '#1F1F37']} style={styles.heroSection}>
        <Text style={styles.heroTitle}>Welcome to Audio Castaway</Text>
        <Text style={styles.heroSubtitle}>
          Discover amazing audio content tailored for your learning journey
        </Text>
      </LinearGradient>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => navigateToSubject(category.name)}
            >
              <Ionicons name={category.icon as any} size={24} color="white" />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalList}>
            {trendingTopics.slice(0, 5).map((topic) => renderTopicCard(topic, 'large'))}
          </View>
        </ScrollView>
      </View>

      {/* Recommended Topics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <View style={styles.gridContainer}>
          {recommendedTopics.map((topic) => renderTopicCard(topic, 'medium'))}
        </View>
      </View>
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
  heroSection: {
    padding: 24,
    paddingTop: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  categoryCard: {
    width: 100,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  horizontalList: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topicCard: {
    backgroundColor: '#1F1F37',
    borderRadius: 12,
    marginBottom: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  topicImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  audioCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  topicInfo: {
    padding: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  topicSubject: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  topicMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});

export default HomeScreen;