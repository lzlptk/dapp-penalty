import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageUtil } from '@/shared';
import type { AuthState } from '@/features/auth';

const [initialUsername, setUsernameLocalStorage, removeUsernameLocalStorage] = localStorageUtil<string | null>(
  'user',
  null
);

const initialState: AuthState = {
  username: initialUsername,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload: { username } }: PayloadAction<{ username: string }>) => {
      state.username = username;
      setUsernameLocalStorage(username);
    },
    logout: (state) => {
      state.username = null;
      removeUsernameLocalStorage();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
