import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  username: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string }>) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
      localStorage.setItem('loggedInUser', action.payload.username);
      localStorage.setItem('isLoggedIn', 'true');
    },
    logout: (state) => {
      state.username = null;
      state.isLoggedIn = false;
      localStorage.removeItem('loggedInUser');
      localStorage.setItem('isLoggedIn', 'false');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
