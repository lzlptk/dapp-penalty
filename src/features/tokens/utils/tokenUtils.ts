import type { Token } from '@/features/tokens';
import type { User } from '@/features/auth';

/**
 * Adjusts the balance of a user based on the approved tokens they have received.
 *
 * @param {string} username - The username of the user whose balance is being adjusted.
 * @param {Token[]} tokens - The list of tokens to check for approved transfers to the user.
 * @param {number} initialBalance - The initial balance of the user before adjustments.
 * @returns {number} - The adjusted balance of the user.
 */
export const adjustUserBalance = (username: string, tokens: Token[], initialBalance: number): number => {
  let balance = initialBalance;

  tokens.forEach((token) => {
    if (token.recipient === username && token.status === 'approved') {
      balance += token.tokenAmount;
    }
  });

  return balance;
};

/**
 * Adjusts the balance of a user and updates the list of users, adding the user if they do not exist.
 *
 * @param {string} username - The username of the user whose balance is being adjusted.
 * @param {User[]} users - The current list of users.
 * @param {Token[]} tokens - The list of tokens to check for approved transfers to the user.
 * @param {number} initialBalance - The initial balance of the user before adjustments.
 * @returns {User[]} - The updated list of users with the adjusted balance for the specified user.
 */
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

/**
 * Updates the balance of a specific user and saves the updated user list.
 *
 * @param {string} username - The username of the user whose balance is being updated.
 * @param {number} amount - The amount to adjust the user's balance by.
 */
export const updateUserBalance = (username: string, amount: number): void => {
  const users = JSON.parse(localStorage.getItem('users') ?? '[]') as User[];
  const updatedUsers = users.map((user) => {
    if (user.username === username) {
      return { ...user, tokenBalance: user.tokenBalance + amount };
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};
