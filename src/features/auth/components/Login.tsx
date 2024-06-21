import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, type User } from '@/features/auth';
import { setInitialBalance, type Token, setUsersWithBalanceAdjustment } from '@/features/tokens';
import { useLocalStorage } from '@/shared/';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [tokens] = useLocalStorage<Token[]>('tokens', []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Invalid');
      return;
    }

    const updatedUsers = setUsersWithBalanceAdjustment(username, users, tokens, 10);
    setUsers(updatedUsers);

    const user = updatedUsers.find((user) => user.username === username);
    if (user) {
      dispatch(setInitialBalance({ username: user.username, balance: user.tokenBalance }));
    }
    dispatch(login({ username }));
    navigate('/');
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
