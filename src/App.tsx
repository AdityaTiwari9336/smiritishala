import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import SubjectPlaylist from "./pages/SubjectPlaylist";
import TopicDetail from "./pages/TopicDetail";
import Downloads from "./pages/Downloads";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/subject/:subjectName" element={<SubjectPlaylist />} />
      <Route path="/topic/:topicId" element={<TopicDetail />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;