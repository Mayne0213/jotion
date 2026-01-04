// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

