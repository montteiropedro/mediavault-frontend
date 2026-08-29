import { Routes, Route } from 'react-router';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { LibraryPage } from '@/pages/LibraryPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';
import { LoginPage } from './pages/LoginPage';

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/watch/:id" element={<VideoPlayerPage />} />
      </Route>
    </Routes>
  );
}

export default App;
