import { supabase } from "@/integrations/supabase/client";

export interface TopicWithStats {
  id: string;
  name: string;
  subject_id: string;
  chapter_id: string;
  cover_image_url?: string;
  description?: string;
  audio_count: number;
  total_duration: number;
  total_plays: number;
  subject_name: string;
  chapter_name: string;
}

export interface UserProfileStats {
  total_listening_time: number;
  total_audios_completed: number;
  listening_streak: number;
  last_listening_date: string;
  subject_progress: SubjectProgress[];
  recent_activity: RecentActivity[];
}

export interface SubjectProgress {
  subject: string;
  completed: number;
  total: number;
  progress: number;
}

export interface RecentActivity {
  id: string;
  type: 'completed' | 'started' | 'bookmarked';
  title: string;
  subject: string;
  timestamp: string;
}

export interface BookmarkedContent {
  id: string;
  audio_id: string;
  created_at: string;
  audio: {
    id: string;
    title: string;
    subject: string;
    topic: string;
    duration: number;
    play_count: number;
    url: string;
    is_premium: boolean;
  };
}

export interface DownloadedContent {
  id: string;
  audio_id: string;
  downloaded_at: string;
  file_size: number;
  audio: {
    id: string;
    title: string;
    subject: string;
    topic: string;
    duration: number;
    url: string;
  };
}

export class DatabaseService {
  // Get trending topics based on total plays
  static async getTrendingTopics(limit: number = 10): Promise<TopicWithStats[]> {
    const { data, error } = await supabase
      .from('topics')
      .select(`
        id,
        name,
        subject_id,
        chapter_id,
        cover_image_url,
        description,
        subjects!inner(name),
        chapters!inner(name),
        audios(duration, play_count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate stats for each topic
    const topicsWithStats: TopicWithStats[] = data.map((topic: any) => {
      const audios = topic.audios || [];
      const audio_count = audios.length;
      const total_duration = audios.reduce((sum: number, audio: any) => sum + (audio.duration || 0), 0);
      const total_plays = audios.reduce((sum: number, audio: any) => sum + (audio.play_count || 0), 0);

      return {
        id: topic.id,
        name: topic.name,
        subject_id: topic.subject_id,
        chapter_id: topic.chapter_id,
        cover_image_url: topic.cover_image_url,
        description: topic.description,
        audio_count,
        total_duration,
        total_plays,
        subject_name: topic.subjects?.name || '',
        chapter_name: topic.chapters?.name || ''
      };
    });

    // Sort by total plays and return top topics
    return topicsWithStats
      .sort((a, b) => b.total_plays - a.total_plays)
      .slice(0, limit);
  }

  // Get recommended topics for user (for now, most recent topics)
  static async getRecommendedTopics(userId?: string, limit: number = 8): Promise<TopicWithStats[]> {
    // TODO: Implement personalized recommendations based on user listening history
    // For now, return most recent topics with content
    const { data, error } = await supabase
      .from('topics')
      .select(`
        id,
        name,
        subject_id,
        chapter_id,
        cover_image_url,
        description,
        subjects!inner(name),
        chapters!inner(name),
        audios(duration, play_count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const topicsWithStats: TopicWithStats[] = data
      .map((topic: any) => {
        const audios = topic.audios || [];
        const audio_count = audios.length;
        
        // Only include topics that have audios
        if (audio_count === 0) return null;

        const total_duration = audios.reduce((sum: number, audio: any) => sum + (audio.duration || 0), 0);
        const total_plays = audios.reduce((sum: number, audio: any) => sum + (audio.play_count || 0), 0);

        return {
          id: topic.id,
          name: topic.name,
          subject_id: topic.subject_id,
          chapter_id: topic.chapter_id,
          cover_image_url: topic.cover_image_url,
          description: topic.description,
          audio_count,
          total_duration,
          total_plays,
          subject_name: topic.subjects?.name || '',
          chapter_name: topic.chapters?.name || ''
        };
      })
      .filter(Boolean) as TopicWithStats[];

    return topicsWithStats.slice(0, limit);
  }

  // Get subject counts for categories section
  static async getSubjectCounts(): Promise<{ [key: string]: number }> {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        name,
        audios(count)
      `);

    if (error) throw error;

    const counts: { [key: string]: number } = {};
    data.forEach((subject: any) => {
      counts[subject.name] = subject.audios?.[0]?.count || 0;
    });

    return counts;
  }

  // Get user profile statistics
  static async getUserProfileStats(userId: string): Promise<UserProfileStats> {
    // Get user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get listening history for calculations
    const { data: listeningHistory } = await supabase
      .from('listening_history')
      .select(`
        *,
        audios(subject, duration)
      `)
      .eq('user_id', userId);

    // Calculate subject progress
    const subjectStats: { [key: string]: { completed: number; total: number } } = {};
    
    // Get all subjects and their total audio counts
    const { data: subjects } = await supabase
      .from('subjects')
      .select(`
        name,
        audios(count)
      `);

    subjects?.forEach((subject: any) => {
      subjectStats[subject.name] = {
        completed: 0,
        total: subject.audios?.[0]?.count || 0
      };
    });

    // Count completed audios per subject
    listeningHistory?.forEach((history: any) => {
      if (history.completed && history.audios?.subject) {
        const subject = history.audios.subject;
        if (subjectStats[subject]) {
          subjectStats[subject].completed++;
        }
      }
    });

    const subject_progress: SubjectProgress[] = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      completed: stats.completed,
      total: stats.total,
      progress: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('listening_history')
      .select(`
        id,
        completed,
        last_played,
        audios(title, subject)
      `)
      .eq('user_id', userId)
      .order('last_played', { ascending: false })
      .limit(10);

    const recent_activity: RecentActivity[] = recentActivity?.map((activity: any) => ({
      id: activity.id,
      type: activity.completed ? 'completed' : 'started',
      title: activity.audios?.title || '',
      subject: activity.audios?.subject || '',
      timestamp: activity.last_played
    })) || [];

    return {
      total_listening_time: profile?.total_listening_time || 0,
      total_audios_completed: profile?.total_audios_completed || 0,
      listening_streak: profile?.listening_streak || 0,
      last_listening_date: profile?.last_listening_date || '',
      subject_progress,
      recent_activity
    };
  }

  // Get user bookmarks
  static async getUserBookmarks(userId: string): Promise<BookmarkedContent[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        id,
        audio_id,
        created_at,
        audios(
          id,
          title,
          subject,
          topic,
          duration,
          play_count,
          url,
          is_premium
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as BookmarkedContent[];
  }

  // Get user downloads
  static async getUserDownloads(userId: string): Promise<DownloadedContent[]> {
    const { data, error } = await supabase
      .from('downloads')
      .select(`
        id,
        audio_id,
        downloaded_at,
        file_size,
        audios(
          id,
          title,
          subject,
          topic,
          duration,
          url
        )
      `)
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false });

    if (error) throw error;

    return data as DownloadedContent[];
  }

  // Add bookmark
  static async addBookmark(userId: string, audioId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        audio_id: audioId
      });

    if (error) throw error;
  }

  // Remove bookmark
  static async removeBookmark(userId: string, audioId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('audio_id', audioId);

    if (error) throw error;
  }

  // Add download
  static async addDownload(userId: string, audioId: string, fileSize: number): Promise<void> {
    const { error } = await supabase
      .from('downloads')
      .insert({
        user_id: userId,
        audio_id: audioId,
        file_size: fileSize
      });

    if (error) throw error;
  }

  // Remove download
  static async removeDownload(userId: string, audioId: string): Promise<void> {
    const { error } = await supabase
      .from('downloads')
      .delete()
      .eq('user_id', userId)
      .eq('audio_id', audioId);

    if (error) throw error;
  }

  // Get audios for a specific topic
  static async getTopicAudios(topicId: string) {
    const { data, error } = await supabase
      .from('audios')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get admin analytics
  static async getAdminAnalytics() {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total audios count
    const { count: totalAudios } = await supabase
      .from('audios')
      .select('*', { count: 'exact', head: true });

    // Get total subjects count
    const { count: totalSubjects } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true });

    // Get total plays
    const { data: playData } = await supabase
      .from('audios')
      .select('play_count');

    const totalPlays = playData?.reduce((sum, audio) => sum + (audio.play_count || 0), 0) || 0;

    // Get premium users count (users who have listened to premium content)
    const { data: premiumListeners } = await supabase
      .from('listening_history')
      .select('user_id, audios!inner(is_premium)')
      .eq('audios.is_premium', true);

    const uniquePremiumUsers = new Set(premiumListeners?.map(l => l.user_id)).size;

    return {
      totalUsers: totalUsers || 0,
      totalAudios: totalAudios || 0,
      totalSubjects: totalSubjects || 0,
      totalPlays,
      premiumUsers: uniquePremiumUsers
    };
  }
}