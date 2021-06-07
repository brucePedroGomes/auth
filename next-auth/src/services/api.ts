import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

const cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response.status == 401) {
      // renovar token
      if (error.response.data?.code === 'token.expired') {
        const { 'nextauth.refreshToken': refreshToken } = parseCookies();

        api
          .post('/refresh', {
            refreshToken,
          })
          .then((res) => {
            const { token, refreshToken: newRefreshToken } = res.data;

            setCookie(undefined, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/',
            });

            setCookie(undefined, 'nextauth.refreshToken', newRefreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/',
            });

            api.defaults.headers['authorization'] = `Bearer ${token}`;
          });
      }
    } else {
      // deslogar
    }
  }
);
