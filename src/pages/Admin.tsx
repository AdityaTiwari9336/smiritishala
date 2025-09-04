import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DatabaseService } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileAudio, Loader2, Trash2, Users, BarChart3, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
  order_index: number;
}

interface Topic {
  id: string;
  name: string;
  subject_id: string;
  chapter_id: string;
  order_index: number;
}

interface Audio {
  id: string;
  title: string;
  description: string;
  url: string;
  subject_id: string;
  topic_id: string;
  chapter_id: string;
  is_premium: boolean;
  play_count: number;
  duration: number;
  created_at: string;
  subjects: { name: string };
  topics: { name: string };
  chapters: { name: string };
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalAudios: 0,
    totalSubjects: 0,
    totalPlays: 0,
    premiumUsers: 0
  });

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // New content creation
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");

  // Check if user is admin
  const isAdmin = user?.email === "at9997152@gmail.com";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      // Fetch subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      // Fetch chapters
      const { data: chaptersData } = await supabase
        .from("chapters")
        .select("*")
        .order("order_index");

      // Fetch topics
      const { data: topicsData } = await supabase
        .from("topics")
        .select("*")
        .order("order_index");

      // Fetch audios
      const { data: audiosData } = await supabase
        .from("audios")
        .select(`
          *,
          subjects(name),
          topics(name),
          chapters(name)
        `)
        .order("created_at", { ascending: false });

      // Fetch analytics data
      const analyticsData = await DatabaseService.getAdminAnalytics();

      setSubjects(subjectsData || []);
      setChapters(chaptersData || []);
      setTopics(topicsData || []);
      setAudios(audiosData || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(chapter => chapter.subject_id === selectedSubject);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an audio file",
        variant: "destructive",
      });
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
    }
  };

  const createSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const { error } = await supabase
        .from("subjects")
        .insert({ name: newSubjectName.trim() });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject created successfully",
      });

      setNewSubjectName("");
      fetchData();
    } catch (error) {
      console.error("Error creating subject:", error);
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive",
      });
    }
  };

  const createChapter = async () => {
    if (!newChapterName.trim() || !selectedSubject) return;

    try {
      const { error } = await supabase
        .from("chapters")
        .insert({ 
          name: newChapterName.trim(),
          subject_id: selectedSubject,
          order_index: filteredChapters.length
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Chapter created successfully",
      });

      setNewChapterName("");
      fetchData();
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast({
        title: "Error",
        description: "Failed to create chapter",
        variant: "destructive",
      });
    }
  };

  const uploadAudio = async () => {
    if (!audioFile || !title || !selectedSubject || !selectedChapter || !newTopicName) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields and add a topic name",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // First create the topic
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .insert({
          name: newTopicName.trim(),
          subject_id: selectedSubject,
          chapter_id: selectedChapter,
          order_index: topics.filter(t => t.chapter_id === selectedChapter).length
        })
        .select()
        .single();

      if (topicError) throw topicError;

      // Upload audio file
      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("audios")
        .upload(filePath, audioFile);

      if (uploadError) throw uploadError;

      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverImage) {
        const imageExt = coverImage.name.split('.').pop();
        const imageName = `${Date.now()}.${imageExt}`;
        const imagePath = `covers/${imageName}`;

        const { error: imageUploadError } = await supabase.storage
          .from("audios")
          .upload(imagePath, coverImage);

        if (!imageUploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("audios")
            .getPublicUrl(imagePath);
          coverImageUrl = publicUrl;
        }
      }

      // Get public URL for audio
      const { data: { publicUrl } } = supabase.storage
        .from("audios")
        .getPublicUrl(filePath);

      // Get names for the audio record
      const selectedSubjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
      const selectedChapterName = chapters.find(c => c.id === selectedChapter)?.name || '';

      // Create audio record
      const { error: insertError } = await supabase
        .from("audios")
        .insert({
          title,
          description,
          url: publicUrl,
          subject: selectedSubjectName,
          topic: newTopicName.trim(),
          subject_id: selectedSubject,
          topic_id: topicData.id,
          chapter_id: selectedChapter,
          is_premium: isPremium,
          file_name: fileName,
          size: audioFile.size,
          mime_type: audioFile.type,
          cover_image_url: coverImageUrl,
          uploaded_by: user?.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Audio uploaded successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedSubject("");
      setSelectedChapter("");
      setNewTopicName("");
      setIsPremium(false);
      setAudioFile(null);
      setCoverImage(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload audio file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content and monitor platform activity</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="manage">Manage Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Upload Content Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Subject/Chapter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Structure
                  </CardTitle>
                  <CardDescription>Add new subjects and chapters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Create New Subject</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="Subject name"
                      />
                      <Button onClick={createSubject} disabled={!newSubjectName.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Create New Chapter</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject first" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        placeholder="Chapter name"
                        disabled={!selectedSubject}
                      />
                      <Button 
                        onClick={createChapter} 
                        disabled={!newChapterName.trim() || !selectedSubject}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Audio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Audio Lecture
                  </CardTitle>
                  <CardDescription>Add new audio content with topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter audio title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter detailed topic notes and description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Subject *</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Chapter *</Label>
                    <Select 
                      value={selectedChapter} 
                      onValueChange={setSelectedChapter}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredChapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="topic">Topic Name *</Label>
                    <Input
                      id="topic"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Enter new topic name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cover">Cover Image</Label>
                    <Input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="audio">Audio File *</Label>
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="premium"
                      checked={isPremium}
                      onCheckedChange={setIsPremium}
                    />
                    <Label htmlFor="premium">Premium Content</Label>
                  </div>

                  <Button 
                    onClick={uploadAudio} 
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Audio
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Content Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Uploaded Content ({audios.length})
                </CardTitle>
                <CardDescription>Manage your uploaded audio lectures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {audios.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No audios uploaded yet
                    </p>
                  ) : (
                    audios.map((audio) => (
                      <div
                        key={audio.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{audio.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {audio.subjects?.name} → {audio.chapters?.name} → {audio.topics?.name}
                            </p>
                            {audio.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {audio.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span>Plays: {audio.play_count}</span>
                              <span>Duration: {Math.round(audio.duration / 60)}m</span>
                              {audio.is_premium && (
                                <span className="text-amber-600">Premium</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // TODO: Implement delete functionality
                              console.log('Delete audio:', audio.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>Monitor and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Audios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalAudios.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across {analytics.totalSubjects} subjects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalPlays.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">All time plays</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.premiumUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.totalUsers > 0 ?
                      `${((analytics.premiumUsers / analytics.totalUsers) * 100).toFixed(1)}% of users` :
                      'No users yet'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;