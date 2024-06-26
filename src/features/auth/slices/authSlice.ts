import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageUtil } from '@/shared';
import { type AuthState } from '@/features/auth';

const initialState: AuthState = {
  username: '',
  balance: 0,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logs in a user by setting the username and login status.
     * Updates the username in localStorage.
     *
     * @param {AuthState} state - The current auth state.
     * @param {PayloadAction<{ username: string }>} action - The login action.
     */
    login: (state: AuthState, { payload: { username } }: PayloadAction<{ username: string }>) => {
      state.username = username;
      state.isLoggedIn = true;
      const [, setUsernameLocalStorage] = localStorageUtil<string>('user', '');

      // Ideally, communicate with the backend to authenticate the user and set a JWT
      setUsernameLocalStorage(username);
    },
    /**
     * Logs out a user by resetting the username and login status.
     * Removes the username from localStorage.
     *
     * @param {AuthState} state - The current auth state.
     */
    logout: (state: AuthState) => {
      state.username = '';
      state.isLoggedIn = false;
      const [, , removeUsernameLocalStorage] = localStorageUtil<string | null>('user', null);

      // Ideally, communicate with the backend to log out the user.
      removeUsernameLocalStorage();
    },
    /**
     * Checks if a user is authenticated by reading the username from localStorage.
     * Updates the state based on the presence of a username.
     *
     * @param {AuthState} state - The current auth state.
     */
    checkAuth: (state: AuthState) => {
      const [username] = localStorageUtil<string>('user', '');

      state.username = username || '';
      state.isLoggedIn = !!username;
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
