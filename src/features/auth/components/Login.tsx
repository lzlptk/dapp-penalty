import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, type User } from '@/features/auth';
import { setInitialBalance, type Token, setUsersWithBalanceAdjustment } from '@/features/tokens';
import { localStorageUtil } from '@/shared';

const Login = () => {
  const [username, setUsernameValue] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const [storedUsername] = localStorageUtil<string>('user', '');
    const [storedUsers] = localStorageUtil<User[]>('users', []);
    const [storedTokens] = localStorageUtil<Token[]>('tokens', []);
    setUsernameValue(storedUsername);
    setUsers(storedUsers);
    setTokens(storedTokens);
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsernameValue(newUsername);
    const [, setStoredUsername] = localStorageUtil<string>('user', '');
    setStoredUsername(newUsername);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Invalid');
      return;
    }

    const updatedUsers = setUsersWithBalanceAdjustment(username, users, tokens, 10);
    setUsers(updatedUsers);
    const [, setStoredUsers] = localStorageUtil<User[]>('users', []);
    setStoredUsers(updatedUsers);

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
          onChange={handleUsernameChange}
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
