import { Routes, Route } from 'react-router';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/auth/useAuth';
import { LibraryPage } from '@/pages/LibraryPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { usePlatform } from './hooks/usePlatform';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { LibraryScanProvider } from './contexts/libraryScan/LibraryScanProvider';
import { SearchProvider } from './contexts/search/SearchProvider';

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

function MainLayout() {
  const { isMobile } = usePlatform();

  return (
    <>
      <Header />
      {isMobile && <MobileMenu />}
      <Outlet />
    </>
  );
}

export function App() {
  return (
    <SearchProvider>
      <LibraryScanProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
          </Route>
          <Route path="/player/:type/:id" element={<VideoPlayerPage />} />
        </Routes>
      </LibraryScanProvider>
    </SearchProvider>
  );
}

export default App;
