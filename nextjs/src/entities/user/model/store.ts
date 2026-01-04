import { create } from 'zustand';
import { UserState, UserActions, User } from './types';

// User state management store
export const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user: User | null) => set({ user }),

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

