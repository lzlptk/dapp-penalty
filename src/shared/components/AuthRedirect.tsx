import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default AuthRedirect;
