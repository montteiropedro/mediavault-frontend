function required(key: keyof ImportMetaEnv, fallback?: string): string {
  const value = import.meta.env[key];
  if (!value) {
    if (fallback && import.meta.env.DEV) return fallback;
    throw new Error(`Missing env: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', 'http://localhost:3000'),
} as const;
