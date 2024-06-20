import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@/features/auth/components/Login';
import TokenDashboard from '@/features/tokens/components/TokenDashboard';
import PrivateRoute from '@/shared/components/PrivateRoute';
import { RootState } from './store';

const App = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
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

const AuthRedirect = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default App;
