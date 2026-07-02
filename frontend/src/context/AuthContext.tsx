import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatUser } from '../types';
import { login as loginRequest } from '../utils/api';

const STORAGE_KEY = 'frequency-chat:user';
const USER_ID_KEY = 'frequency-chat:userId';

interface AuthContextValue {
  user: ChatUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore a previous dummy session on app launch, if there was one.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // Corrupt/missing storage is not fatal — just start logged out.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (username: string) => {
    setError(null);
    try {
      const loggedInUser = await loginRequest(username);

      // Reuse a previously stored userId for this username so messages
      // stay on the right side after re-login. Stored separately from
      // the session so it survives logout.
      try {
        const storedId = await AsyncStorage.getItem(`${USER_ID_KEY}:${loggedInUser.username}`);
        if (storedId) {
          loggedInUser.userId = storedId;
        } else {
          await AsyncStorage.setItem(`${USER_ID_KEY}:${loggedInUser.username}`, loggedInUser.userId);
        }
      } catch {
        // Non-fatal — just use the server-generated userId.
      }

      setUser(loggedInUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    // Note: we intentionally keep USER_ID_KEY entries so the same username
    // gets the same userId on next login.
  };

  const value = useMemo(
    () => ({ user, isLoading, error, login, logout }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
