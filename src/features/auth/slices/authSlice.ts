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
    login: (state, { payload: { username, balance = 10 } }: PayloadAction<{ username: string; balance?: number }>) => {
      state.username = username;
      state.balance = balance;
      state.isLoggedIn = true;
      const [, setUsernameLocalStorage] = localStorageUtil<string>('user', '');
      setUsernameLocalStorage(username);
    },
    logout: (state) => {
      state.username = '';
      state.balance = 0;
      state.isLoggedIn = false;
      const [, , removeUsernameLocalStorage] = localStorageUtil<string | null>('user', null);
      removeUsernameLocalStorage();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
