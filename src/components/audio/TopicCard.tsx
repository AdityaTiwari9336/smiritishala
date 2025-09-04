import { Button } from "@/components/ui/button";
import { Play, Clock, BookOpen, Users } from "lucide-react";
import { TopicWithStats } from "@/lib/database";

interface TopicCardProps {
  topic: TopicWithStats;
  onTopicClick: (topicId: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export const TopicCard = ({ topic, onTopicClick, size = 'medium' }: TopicCardProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const imageClasses = {
    small: 'aspect-square mb-2',
    medium: 'aspect-square mb-3',
    large: 'aspect-[4/3] mb-4'
  };

  const titleClasses = {
    small: 'text-sm font-semibold',
    medium: 'text-base font-semibold',
    large: 'text-lg font-bold'
  };

  return (
    <div 
      className="glass-card shadow-card hover:shadow-player transition-smooth hover:scale-[1.02] group cursor-pointer"
      onClick={() => onTopicClick(topic.id)}
    >
      <div className={sizeClasses[size]}>
        {/* Cover Image */}
        <div className={`relative ${imageClasses[size]} rounded-lg overflow-hidden bg-gradient-secondary`}>
          {topic.cover_image_url ? (
            <img 
              src={topic.cover_image_url} 
              alt={topic.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-card">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-primary ml-1" />
            </div>
          </div>

          {/* Audio Count Badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {topic.audio_count}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`${titleClasses[size]} leading-tight line-clamp-2 group-hover:text-primary transition-smooth`}>
            {topic.name}
          </h3>
          
          <p className="text-xs text-muted-foreground">
            {topic.subject_name} • {topic.chapter_name}
          </p>
          
          {/* Description */}
          {topic.description && size !== 'small' && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {topic.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(topic.total_duration)}</span>
              </div>
              {size !== 'small' && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{topic.total_plays.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar (if user has progress) */}
          {/* TODO: Add user progress tracking */}
          
        </div>
      </div>
    </div>
  );
};