import { Login } from '@/features/auth';
import { TokenDashboard } from '@/features/tokens';
import { AuthRedirect, PrivateRoute } from '@/shared';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const AppRoutes = () => {
  const isLoggedIn = !!useSelector((state: RootState) => state.auth.username);

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
