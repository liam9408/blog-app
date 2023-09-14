/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateUserPayload, User } from '../types/user.type';
import { apiService } from '../services/api.service';

class AuthApi {
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = apiService.post('/auth/signin', {
          email,
          password,
        });

        resolve(user);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async reAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const resp = apiService.get(`/auth/reauth`);
        resolve(resp);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async logout(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(apiService.get('/auth/signout'));
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register({ email, password }: CreateUserPayload): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = apiService.post('/auth/register', {
          email,
          password,
        });
        resolve(user);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
