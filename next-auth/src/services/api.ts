import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

const cookies = parseCookies();

let isRefreshing: Boolean = false;
let failedRequestQueue: FailedRequest[] = [];

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
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

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

              api.defaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestQueue.forEach((request) => request.resolve(token));

              failedRequestQueue = [];
            })
            .catch((error) => {
              failedRequestQueue.forEach((request) => request.reject(error));

              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        //workaround - axios
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            resolve: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            reject: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      }
    } else {
      // deslogar
    }
  }
);
