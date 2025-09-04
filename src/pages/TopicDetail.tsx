import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Clock, Users, BookOpen, Download, Bookmark } from 'lucide-react';
import { DatabaseService } from '@/lib/database';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';

interface AudioData {
  id: string;
  title: string;
  description: string;
  url: string;
  subject: string;
  topic: string;
  duration: number;
  is_premium: boolean;
  play_count: number;
}

interface TopicInfo {
  id: string;
  name: string;
  subject_name: string;
  chapter_name: string;
  description?: string;
  cover_image_url?: string;
  audio_count: number;
  total_duration: number;
}

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { playAudio, currentAudio, isPlaying } = useAudio();
  const { user } = useAuth();
  
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const [audios, setAudios] = useState<AudioData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      fetchTopicData(topicId);
    }
  }, [topicId]);

  const fetchTopicData = async (id: string) => {
    try {
      // Get topic audios
      const audioData = await DatabaseService.getTopicAudios(id);
      setAudios(audioData || []);

      // Get topic info from trending topics (this will include stats)
      const trendingTopics = await DatabaseService.getTrendingTopics(100);
      const topic = trendingTopics.find(t => t.id === id);
      
      if (topic) {
        setTopicInfo({
          id: topic.id,
          name: topic.name,
          subject_name: topic.subject_name,
          chapter_name: topic.chapter_name,
          description: topic.description,
          cover_image_url: topic.cover_image_url,
          audio_count: topic.audio_count,
          total_duration: topic.total_duration
        });
      }
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handlePlayAudio = (audio: AudioData) => {
    playAudio(audio);
  };

  const handlePlayAll = () => {
    if (audios.length > 0) {
      handlePlayAudio(audios[0]);
    }
  };

  const handleBookmarkTopic = async () => {
    if (!user || !topicInfo) return;
    
    // TODO: Implement topic bookmarking
    console.log('Bookmark topic:', topicInfo.id);
  };

  const handleDownloadTopic = async () => {
    if (!user || !topicInfo) return;
    
    // TODO: Implement topic download
    console.log('Download topic:', topicInfo.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading topic...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!topicInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Topic Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            <div className="aspect-square rounded-lg overflow-hidden bg-gradient-secondary shadow-lg">
              {topicInfo.cover_image_url ? (
                <img 
                  src={topicInfo.cover_image_url} 
                  alt={topicInfo.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-card">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Topic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{topicInfo.name}</h1>
              <p className="text-lg text-muted-foreground">
                {topicInfo.subject_name} • {topicInfo.chapter_name}
              </p>
            </div>

            {topicInfo.description && (
              <p className="text-muted-foreground leading-relaxed">
                {topicInfo.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{topicInfo.audio_count} lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(topicInfo.total_duration)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handlePlayAll}
                disabled={audios.length === 0}
              >
                <Play className="w-5 h-5 mr-2" />
                Play All
              </Button>
              
              {user && (
                <>
                  <Button variant="outline" onClick={handleBookmarkTopic}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark Topic
                  </Button>
                  
                  <Button variant="outline" onClick={handleDownloadTopic}>
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Audio List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lectures in this Topic</h2>
          
          {audios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No lectures available in this topic yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {audios.map((audio, index) => {
                const isCurrentlyPlaying = currentAudio?.id === audio.id && isPlaying;
                
                return (
                  <div
                    key={audio.id}
                    className="glass-card p-4 hover:shadow-card transition-smooth cursor-pointer"
                    onClick={() => handlePlayAudio(audio)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Index & Play Button */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-6 text-center">
                          {index + 1}
                        </span>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <Play className={`w-6 h-6 ${isCurrentlyPlaying ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${isCurrentlyPlaying ? 'text-primary' : ''}`}>
                          {audio.title}
                        </h3>
                        {audio.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {audio.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(audio.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{audio.play_count.toLocaleString()} plays</span>
                          </div>
                          {audio.is_premium && (
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom padding for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default TopicDetail;