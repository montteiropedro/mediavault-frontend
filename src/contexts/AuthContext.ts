import { createContext } from 'react';

export interface IUser {
  display_name: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (username: string, token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
