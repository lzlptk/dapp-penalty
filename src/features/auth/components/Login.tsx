import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '@/features/auth/slices/authSlice';
import { setInitialBalance } from '@/features/tokens/slices/tokenSlice';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { setUsersWithBalanceAdjustment } from '@/features/tokens/utils/tokenUtils';
import type { User } from '@/features/auth/types';
import type { Token } from '@/features/tokens/types';

const Login = () => {
  const [username, setUsername] = useLocalStorage<string>('user', '');
  const [password, setPassword] = useState<string>('');
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [tokens] = useLocalStorage<Token[]>('tokens', []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const updatedUsers = setUsersWithBalanceAdjustment(username, users, tokens, 10);
      setUsers(updatedUsers); // Update local storage with the new users array
      const user = updatedUsers.find((user) => user.username === username);
      if (user) {
        dispatch(setInitialBalance({ username: user.username, balance: user.tokenBalance }));
      }
      dispatch(login({ username }));
      navigate('/');
    } else {
      alert('Invalid');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
