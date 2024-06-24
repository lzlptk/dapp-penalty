import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageUtil } from '@/shared';
import { type User, type AuthState } from '@/features/auth';

const [initialUsername] = localStorageUtil<string>('user', '');
const [initialUsers] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);

const initialBalance = initialUsers.find((user: User) => user.username === initialUsername)?.tokenBalance ?? 0;

const initialState: AuthState = {
  username: initialUsername,
  balance: initialBalance,
  isLoggedIn: !!initialUsername,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logs in a user by setting the username, balance, and isLoggedIn state.
     * Also updates the username in localStorage.
     *
     * @param {AuthState} state - The current state of authentication.
     * @param {PayloadAction<{ username: string; balance?: number }>} action - The action to be dispatched.
     * @param {string} action.payload.username - The username of the user logging in.
     * @param {number} [action.payload.balance=10] - The initial token balance of the user. Defaults to 10 if not provided.
     */
    login: (
      state: AuthState,
      { payload: { username, balance = 10 } }: PayloadAction<{ username: string; balance?: number }>
    ) => {
      state.username = username;
      state.balance = balance;
      state.isLoggedIn = true;
      const [, setUsernameLocalStorage] = localStorageUtil<string>('user', '');

      // This is where it would be ideal to communicate with the backend to authenticate the user.
      setUsernameLocalStorage(username);
    },
    /**
     * Logs out a user by resetting the username, balance, and isLoggedIn state.
     * Also removes the username from localStorage.
     *
     * @param {AuthState} state - The current state of authentication.
     */
    logout: (state: AuthState) => {
      state.username = '';
      state.balance = 0;
      state.isLoggedIn = false;
      const [, , removeUsernameLocalStorage] = localStorageUtil<string | null>('user', null);

      // This is where it would be ideal to communicate with the backend to log out the user.
      removeUsernameLocalStorage();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
