import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { tokenReducer } from '@/features/tokens';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tokens: tokenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
