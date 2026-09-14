import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedHosts = env.ALLOWED_HOSTS ? env.ALLOWED_HOSTS.split(',').map((host) => host.trim()) : [];

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts,
      host: '0.0.0.0',
      port: Number(env.PORT) || 5173,
      watch: {
        usePolling: true,
      },
    },
  };
});
