import { Navigate, Route, Routes } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '@/app/store';
import Login from '@/features/auth/components/Login';
import TokenDashboard from '@/features/tokens/components/TokenDashboard';
import PrivateRoute from '@/shared/components/PrivateRoute';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={<TokenDashboard />}
          />
        </Route>
        <Route
          path="*"
          element={<AuthRedirect />}
        />
      </Routes>
    </Provider>
  );
};

const AuthRedirect = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  return isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default App;
