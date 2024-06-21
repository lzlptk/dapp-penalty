interface User {
  username: string;
  tokenBalance: number;
}

interface AuthState {
  username: string | null;
}

export type { User, AuthState };
