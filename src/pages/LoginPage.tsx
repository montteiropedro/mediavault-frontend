import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
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
    <div className="flex flex-col text-zinc-100 h-screen w-full p-8 sm:p-0">
      <form onSubmit={handleSubmit} className="flex flex-col m-auto gap-6 w-full sm:w-100">
        <div className="uppercase flex items-center justify-center text-4xl sm:text-5xl">
          <h1 className="font-bold tracking-tight text-zinc-100 mb-10">
            Media<span className="text-red-400">Vault</span>
          </h1>
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          <label htmlFor="user">Usuário</label>
          <input
            id="user"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 rounded-lg px-4 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all pr-8 h-10 w-full"
          />
        </div>

        <div className="flex flex-col items-start gap-2 w-full">
          <label htmlFor="token">Senha</label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 rounded-lg px-4 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all pr-8 h-10 w-full"
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center rounded-lg bg-secondary hover:bg-zinc-600 text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 gap-2 mt-4 px-4 h-10"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
