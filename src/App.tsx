import { Routes, Route } from 'react-router';
import { LibraryPage } from '@/pages/LibraryPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/watch/:id" element={<VideoPlayerPage />} />
    </Routes>
  );
}

export default App;
