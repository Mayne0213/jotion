// User entity types
export interface User {
  id: string;
  username: string;
  name?: string;
  image?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// User state
export interface UserState {
  user: User | null;
  isLoading: boolean;
}

// User actions
export interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

