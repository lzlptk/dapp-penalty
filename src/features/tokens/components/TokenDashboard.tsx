import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const TokenDashboard = () => {
  const username = useSelector((state: RootState) => state.auth.username);

  return (
    <div>
      <h2>Welcome, {username}</h2>
    </div>
  );
};

export default TokenDashboard;
