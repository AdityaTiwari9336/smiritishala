import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Play, Trash2, HardDrive, Clock } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService, DownloadedContent } from '@/lib/database';

interface SubjectGroup {
  subject: string;
  audios: DownloadedContent[];
  totalSize: number;
}

const Downloads = () => {
  const { playAudio } = useAudio();
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<SubjectGroup[]>([]);
  const [totalStorage, setTotalStorage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDownloads();
    }
  }, [user]);

  const fetchDownloads = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const downloadedContent = await DatabaseService.getUserDownloads(user.id);

      // Group by subject
      const grouped = downloadedContent.reduce((acc: { [key: string]: DownloadedContent[] }, download) => {
        const subject = download.audio.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(download);
        return acc;
      }, {});

      const subjectGroups: SubjectGroup[] = Object.entries(grouped).map(([subject, audios]) => ({
        subject,
        audios: audios.sort((a, b) => new Date(b.downloaded_at).getTime() - new Date(a.downloaded_at).getTime()),
        totalSize: audios.reduce((sum, download) => sum + download.file_size, 0)
      }));

      setDownloads(subjectGroups);
      setTotalStorage(downloadedContent.reduce((sum, download) => sum + download.file_size, 0));
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handlePlay = (download: DownloadedContent) => {
    playAudio({
      id: download.audio.id,
      title: download.audio.title,
      url: download.audio.url,
      subject: download.audio.subject,
      topic: download.audio.topic,
      duration: download.audio.duration,
      is_premium: false
    });
  };

  const handleRemoveDownload = async (audioId: string) => {
    if (!user) return;

    try {
      await DatabaseService.removeDownload(user.id, audioId);
      setDownloads(prev =>
        prev.map(group => ({
          ...group,
          audios: group.audios.filter(download => download.audio.id !== audioId),
          totalSize: group.audios
            .filter(download => download.audio.id !== audioId)
            .reduce((sum, download) => sum + download.file_size, 0)
        })).filter(group => group.audios.length > 0)
      );
      
      // Update total storage
      setTotalStorage(prev => {
        const removedDownload = downloads
          .flatMap(group => group.audios)
          .find(download => download.audio.id === audioId);
        return prev - (removedDownload?.file_size || 0);
      });
    } catch (error) {
      console.error('Error removing download:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading downloads...</div>
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
          <h1 className="text-3xl font-bold mb-2">My Downloads</h1>
          <p className="text-muted-foreground">Access your offline content</p>
        </div>

        {/* Storage Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatFileSize(totalStorage)}</p>
                <p className="text-sm text-muted-foreground">
                  {downloads.reduce((sum, group) => sum + group.audios.length, 0)} audios downloaded
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        {downloads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Downloads Yet</h3>
              <p className="text-muted-foreground mb-4">
                Download audios to listen offline anytime, anywhere
              </p>
              <Button variant="hero" onClick={() => window.history.back()}>
                Browse Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {downloads.map((group) => (
              <Card key={group.subject}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{group.subject}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {formatFileSize(group.totalSize)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {group.audios.length} audio{group.audios.length !== 1 ? 's' : ''} downloaded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.audios.map((download) => (
                      <div
                        key={download.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                      >
                        {/* Play Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePlay(download)}
                          className="flex-shrink-0"
                        >
                          <Play className="w-5 h-5" />
                        </Button>

                        {/* Audio Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{download.audio.title}</h4>
                          <p className="text-sm text-muted-foreground">{download.audio.topic}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDuration(download.audio.duration)}</span>
                            </div>
                            <span>{formatFileSize(download.file_size)}</span>
                            <span>Downloaded {new Date(download.downloaded_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDownload(download.audio.id)}
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

export default Downloads;