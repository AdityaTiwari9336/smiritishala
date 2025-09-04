import { useState, useEffect } from "react";
import { TopicCard } from "@/components/audio/TopicCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { DatabaseService, TopicWithStats } from "@/lib/database";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const FeaturedSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendingTopics, setTrendingTopics] = useState<TopicWithStats[]>([]);
  const [recommendedTopics, setRecommendedTopics] = useState<TopicWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [user]);

  const fetchContent = async () => {
    try {
      // Fetch trending topics
      const trending = await DatabaseService.getTrendingTopics(10);
      setTrendingTopics(trending);

      // Fetch recommended topics
      const recommended = await DatabaseService.getRecommendedTopics(user?.id, 8);
      setRecommendedTopics(recommended);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading content...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 space-y-16">
      {/* Trending Now */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Trending Topics</h2>
                <p className="text-muted-foreground">Most popular topics this week</p>
              </div>
            </div>
            <Button variant="glass" className="group">
              See More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {trendingTopics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onTopicClick={handleTopicClick}
                  size="small"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No trending topics available. Content will appear here based on user engagement.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recommended For You */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {user ? "Recommended Topics" : "Popular UPSC Topics"}
              </h2>
              <p className="text-muted-foreground">
                {user
                  ? "Based on your listening history and preferences"
                  : "Top-rated topics and current affairs analysis"
                }
              </p>
            </div>
            <Button variant="glass" className="group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {recommendedTopics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onTopicClick={handleTopicClick}
                  size="medium"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {user
                  ? "Start listening to content to get personalized recommendations!"
                  : "No content available. Admin can upload audio lectures to populate this section."
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};