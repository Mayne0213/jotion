import type { User } from '../model/types';
import { apiGet, apiPost } from '@/shared/api';

// User API functions
export const userApi = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiGet<User>('/api/auth/me');
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  // Login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      return await apiPost<{ user: User; token: string }>('/api/auth/login', {
        email,
        password,
      });
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  },

  // Register
  register: async (email: string, password: string, name?: string): Promise<{ user: User; token: string }> => {
    try {
      return await apiPost<{ user: User; token: string }>('/api/auth/register', {
        email,
        password,
        name,
      });
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiPost<void>('/api/auth/logout');
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  },
};

