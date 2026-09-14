import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '@/contexts/auth/useAuth';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import axios from 'axios';

export function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, token);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Credenciais inválidas.');
        } else {
          setError('Algo deu errado. Por favor, tente novamente em instantes.');
        }
      } else {
        setError('Algo deu errado. Por favor, tente novamente em instantes.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex flex-col bg-primary text-zinc-100 h-screen w-full p-8 sm:p-0">
      <form onSubmit={handleSubmit} className="flex flex-col m-auto gap-6 w-full sm:w-100">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Logo className="text-4xl sm:text-5xl" />
          <h2 className="text-muted text-base sm:text-lg">Acesse seu cofre de mídia.</h2>
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          <input
            placeholder="Usuário"
            id="user"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 rounded-lg text-sm text-zinc-200 placeholder-muted outline-none transition-all px-4 py-1.5 h-11 w-full"
          />
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          <input
            placeholder="Senha"
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 rounded-lg text-sm text-zinc-200 placeholder-muted outline-none transition-all px-4 py-1.5 h-11 w-full"
          />
        </div>

        {error && <p>{error}</p>}

        <Button text={loading ? <Loading /> : 'Entrar'} type="submit" disabled={loading} useAccentColor={true} />
      </form>
    </div>
  );
}
