import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Play, Trash2, Clock, Users } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService, BookmarkedContent } from '@/lib/database';

interface SubjectGroup {
  subject: string;
  audios: BookmarkedContent[];
}

const Bookmarks = () => {
  const { playAudio } = useAudio();
  const { user } = useAuth();
  const [bookmarksData, setBookmarksData] = useState<SubjectGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarksData();
    }
  }, [user]);

  const fetchBookmarksData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const bookmarks = await DatabaseService.getUserBookmarks(user.id);

      // Group by subject
      const grouped = bookmarks.reduce((acc: { [key: string]: BookmarkedContent[] }, bookmark) => {
        const subject = bookmark.audio.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(bookmark);
        return acc;
      }, {});

      const subjectGroups: SubjectGroup[] = Object.entries(grouped).map(([subject, audios]) => ({
        subject,
        audios: audios.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));

      setBookmarksData(subjectGroups);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
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

  const handlePlay = (bookmark: BookmarkedContent) => {
    playAudio({
      id: bookmark.audio.id,
      title: bookmark.audio.title,
      url: bookmark.audio.url,
      subject: bookmark.audio.subject,
      topic: bookmark.audio.topic,
      duration: bookmark.audio.duration,
      is_premium: bookmark.audio.is_premium
    });
  };

  const handleRemoveBookmark = async (audioId: string) => {
    if (!user) return;

    try {
      await DatabaseService.removeBookmark(user.id, audioId);
      setBookmarksData(prev =>
        prev.map(group => ({
          ...group,
          audios: group.audios.filter(bookmark => bookmark.audio.id !== audioId)
        })).filter(group => group.audios.length > 0)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading bookmarks...</div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
          <p className="text-muted-foreground">Your saved audio lectures for quick access</p>
        </div>

        {bookmarksData.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
              <p className="text-muted-foreground mb-4">
                Save your favorite lectures to access them quickly later
              </p>
              <Button variant="hero" onClick={() => window.history.back()}>
                Browse Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Bookmark Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {bookmarksData.reduce((sum, group) => sum + group.audios.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Bookmarks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{bookmarksData.length}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round(bookmarksData.reduce((sum, group) =>
                        sum + group.audios.reduce((audioSum, bookmark) => audioSum + bookmark.audio.duration, 0), 0
                      ) / 3600)}h
                    </p>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {bookmarksData[0]?.audios[0] ?
                        new Date(bookmarksData[0].audios[0].created_at).toLocaleDateString() :
                        'N/A'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Last Added</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bookmarked Content */}
            {bookmarksData.map((group) => (
              <Card key={group.subject}>
                <CardHeader>
                  <CardTitle>{group.subject}</CardTitle>
                  <CardDescription>
                    {group.audios.length} bookmark{group.audios.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.audios.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                      >
                        {/* Play Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePlay(bookmark)}
                          className="flex-shrink-0"
                        >
                          <Play className="w-5 h-5" />
                        </Button>

                        {/* Audio Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{bookmark.audio.title}</h4>
                          <p className="text-sm text-muted-foreground">{bookmark.audio.topic}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(bookmark.audio.duration)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{bookmark.audio.play_count.toLocaleString()} plays</span>
                            </div>
                            <span>Saved {new Date(bookmark.created_at).toLocaleDateString()}</span>
                            {bookmark.audio.is_premium && (
                              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBookmark(bookmark.audio.id)}
                          className="flex-shrink-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom padding for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default Bookmarks;