import type { Token } from '@/features/tokens';
import type { User } from '@/features/auth';

export const adjustUserBalance = (username: string, tokens: Token[], initialBalance: number) => {
  let balance = initialBalance;

  tokens.forEach((token) => {
    if (token.recipient === username && token.status === 'approved') {
      balance += token.tokenAmount;
    }
  });

  return balance;
};

export const setUsersWithBalanceAdjustment = (
  username: string,
  users: User[],
  tokens: Token[],
  initialBalance: number
): User[] => {
  console.log('Current users:', users);
  const userBalance = adjustUserBalance(username, tokens, initialBalance);
  const userExists = users.some((user) => user.username === username);

  if (!userExists) {
    const newUser: User = { username, tokenBalance: userBalance };
    const updatedUsers = [...users, newUser];
    console.log('Added new user with balance adjustment:', newUser);
    return updatedUsers;
  } else {
    const updatedUsers = users.map((user) =>
      user.username === username ? { ...user, tokenBalance: userBalance } : user
    );
    console.log(
      'Updated user with balance adjustment:',
      updatedUsers.find((user) => user.username === username)
    );
    return updatedUsers;
  }
};

export const updateUserBalance = (username: string, amount: number) => {
  const users = JSON.parse(localStorage.getItem('users') ?? '[]') as User[];
  const updatedUsers = users.map((user) => {
    if (user.username === username) {
      return { ...user, tokenBalance: user.tokenBalance + amount };
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};
