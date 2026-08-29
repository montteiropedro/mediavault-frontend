import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext, type IUser } from './AuthContext';
import { api } from '@/services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
