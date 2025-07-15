import { authApi } from './api';
import type { AuthData, User } from '../store/authStore';

// Removed redundant LoginResponse interface; use AuthData directly

interface RegisterResponse {
  message: string;
  user: User;
}

// Removed redundant GoogleLoginResponse interface; use AuthData directly

interface ConfirmEmailResponse {
  message: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthData> => {
    const response = await authApi.post<AuthData>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponse> => {
    const response = await authApi.post<RegisterResponse>('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  googleLogin: async (idToken: string): Promise<AuthData> => {
    const response = await authApi.post<AuthData>('/api/auth/oauth/google', {
      idToken,
    });
    return response.data;
  },

  confirmEmail: async (token: string): Promise<ConfirmEmailResponse> => {
    const response = await authApi.get<ConfirmEmailResponse>(`/api/auth/confirm?token=${token}`);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await authApi.post<RefreshTokenResponse>('/api/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};