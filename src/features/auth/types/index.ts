interface User {
  username: string;
  balance: number;
}

interface LoggedInState {
  isLoggedIn: boolean;
}

type AuthState = User & LoggedInState;

export type { User, AuthState };
