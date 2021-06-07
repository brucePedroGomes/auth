import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';
import Router from 'next/router';
import { parseCookies, setCookie } from 'nookies';

type SignInCredentials = {
  email: string;
  password: string;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then((r) => setUser(r.data));
    }
  }, []);

  console.log('users', user);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data } = await api.post('sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = data;

      setUser({
        email,
        permissions,
        roles,
      });

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      api.defaults.headers['authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');

      console.log('data', data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};
