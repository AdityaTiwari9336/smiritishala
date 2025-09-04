import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { User, Clock, BookOpen, TrendingUp, Calendar, Settings, Award, Target } from 'lucide-react';
import { DatabaseService, UserProfileStats, SubjectProgress, RecentActivity } from '@/lib/database';

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  preferredLanguage: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    username: '',
    email: user?.email || '',
    preferredLanguage: 'English',
    avatarUrl: ''
  });

  const [profileStats, setProfileStats] = useState<UserProfileStats>({
    total_listening_time: 0,
    total_audios_completed: 0,
    listening_streak: 0,
    last_listening_date: '',
    subject_progress: [],
    recent_activity: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user?.id) return;
    
    try {
      const stats = await DatabaseService.getUserProfileStats(user.id);
      setProfileStats(stats);
    } catch (error) {
      console.error('Error fetching user profile stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const overallProgress = Math.round(
    (profileStats.subject_progress.reduce((sum, subject) => sum + subject.completed, 0) /
     profileStats.subject_progress.reduce((sum, subject) => sum + subject.total, 0)) * 100
  ) || 0;

  const handleSaveProfile = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading profile...</div>
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
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and track your learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profile.fullName || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">@{profile.username || 'username'}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Choose a username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select value={profile.preferredLanguage} onValueChange={(value) => setProfile(prev => ({ ...prev, preferredLanguage: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Bengali">Bengali</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm">{profile.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Language</Label>
                      <p className="text-sm">{profile.preferredLanguage}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileStats.listening_streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{overallProgress}%</div>
                    <div className="text-xs text-muted-foreground">Overall Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Progress Dashboard
                </CardTitle>
                <CardDescription>Track your UPSC preparation journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{formatTime(profileStats.total_listening_time)}</div>
                    <div className="text-sm text-muted-foreground">Total Listening Time</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold">{profileStats.total_audios_completed}</div>
                    <div className="text-sm text-muted-foreground">Audios Completed</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold">{overallProgress}%</div>
                    <div className="text-sm text-muted-foreground">Overall Progress</div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall UPSC Preparation</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Subject-wise Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Progress</CardTitle>
                <CardDescription>Your progress across different UPSC subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileStats.subject_progress.length > 0 ? (
                    profileStats.subject_progress.map((subject) => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{subject.subject}</span>
                          <span className="text-muted-foreground">
                            {subject.completed}/{subject.total} ({subject.progress}%)
                          </span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Start listening to content to track your progress!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileStats.recent_activity.length > 0 ? (
                    profileStats.recent_activity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'completed' ? 'bg-success' :
                          activity.type === 'started' ? 'bg-primary' : 'bg-warning'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.type === 'completed' ? 'Completed: ' :
                             activity.type === 'started' ? 'Started: ' : 'Bookmarked: '}
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.subject} • {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No recent activity. Start listening to see your progress here!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bottom padding for fixed player */}
      <div className="h-24"></div>
    </div>
  );
};

export default Profile;