import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext, type IUser } from './AuthContext';
import { Loading } from '@/components/Loading';
import { api } from '@/services/api';

type AuthProviderProps = { children: ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/api/v1/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, token: string) {
    const response = await api.post('/api/v1/session', { username, token });
    setUser(response.data);
  }

  async function logout() {
    await api.delete('/api/v1/session').finally(() => {
      setUser(null);
      navigate('/login');
    });
  }

  if (loading) return <Loading size="lg" />;

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
