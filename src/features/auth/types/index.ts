interface User {
  username: string;
  tokenBalance: number;
}

interface AuthState {
  username: string;
  balance: number;
  isLoggedIn: boolean;
}

export type { User, AuthState };
