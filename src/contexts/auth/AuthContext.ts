import { createContext } from 'react';

export type User = {
  display_name: string;
};

type AuthContext = {
  user: User | null;
  login: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);
