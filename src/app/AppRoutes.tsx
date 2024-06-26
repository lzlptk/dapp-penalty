import { Login } from '@/features/auth';
import { TokenDashboard } from '@/features/tokens';
import { AuthRedirect, PrivateRoute } from '@/shared';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useEffect } from 'react';
import { checkAuth } from '@/features/auth';

const AppRoutes = () => {
  const isLoggedIn = !!useSelector((state: RootState) => state.auth.username);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <Login />}
      />
      <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
        <Route
          path="/"
          element={<TokenDashboard />}
        />
      </Route>
      <Route
        path="*"
        element={<AuthRedirect isLoggedIn={isLoggedIn} />}
      />
    </Routes>
  );
};

export default AppRoutes;
