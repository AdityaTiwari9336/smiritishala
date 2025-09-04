import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { DatabaseService, TopicWithStats } from '@/lib/database';
import { TopicCard } from '@/components/audio/TopicCard';

interface SubjectTopics {
  subject_name: string;
  topics: TopicWithStats[];
}

const SubjectPlaylist = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopics>({
    subject_name: '',
    topics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectName) {
      fetchTopicsForSubject(decodeURIComponent(subjectName));
    }
  }, [subjectName]);

  const fetchTopicsForSubject = async (subject: string) => {
    try {
      // Get all topics for this subject with their stats
      const allTopics = await DatabaseService.getTrendingTopics(100);
      const filteredTopics = allTopics.filter(topic =>
        topic.subject_name.toLowerCase() === subject.toLowerCase()
      );

      setSubjectTopics({
        subject_name: subject,
        topics: filteredTopics
      });
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading topics...</div>
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subjectTopics.subject_name}</h1>
            <p className="text-muted-foreground">
              {subjectTopics.topics.length} topics available
            </p>
          </div>
        </div>

        {subjectTopics.topics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No topics available for this subject yet. Admin can upload content to populate this section.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Topics in {subjectTopics.subject_name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjectTopics.topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onTopicClick={handleTopicClick}
                  size="medium"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom padding for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default SubjectPlaylist;