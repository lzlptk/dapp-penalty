import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageUtil } from '@/shared';
import { type Token, type TokenState } from '@/features/tokens';
import { type User } from '@/features/auth';

const initialState: TokenState = {
  balances: {},
  transfers: [],
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    /**
     * Sets the initial balance for a new user or updates an existing user's balance if they already exist.
     *
     * @param {TokenState} state - The current token state.
     * @param {PayloadAction<{ username: string }>} action - The action payload with the username.
     */
    setInitialBalance: (state: TokenState, action: PayloadAction<{ username: string }>) => {
      const { username } = action.payload;
      const [users, setUsers] = localStorageUtil<User[]>('users', []);
      const [tokens] = localStorageUtil<Token[]>('tokens', []);
      const userExists = users.some((user) => user.username === username);
      const balance = tokens.reduce((acc, token) => {
        if (token.recipient === username && token.status === 'approved') {
          return acc + token.tokenAmount;
        }
        return acc;
      }, 0);

      if (userExists) {
        return;
      }

      const defaultBalance = 10;
      let updatedUsers;

      if (balance) {
        updatedUsers = [...users, { username, balance: balance + defaultBalance }];
        state.balances[username] = balance + defaultBalance;
      } else {
        updatedUsers = [...users, { username, balance: defaultBalance }];
        state.balances[username] = defaultBalance;
      }

      setUsers(updatedUsers);
      console.log('Added new user with balance adjustment:', { username, balance });
    },
    /**
     * Sets the balances from the initial list of users stored in localStorage.
     *
     * @param {TokenState} state - The current token state.
     */
    setBalances: (state: TokenState) => {
      const [initialUsers] = localStorageUtil<User[]>('users', []);

      state.balances = initialUsers.reduce(
        (acc, user) => {
          acc[user.username] = user.balance;
          return acc;
        },
        {} as Record<string, number>
      );
    },
    /**
     * Loads the initial list of transfers from localStorage.
     *
     * @param {TokenState} state - The current token state.
     */
    setTransfers: (state: TokenState) => {
      const [initialTransfers] = localStorageUtil<Token[]>('tokens', []);
      state.transfers = initialTransfers;
    },
    /**
     * Suggests a transfer of tokens from one user to another and marks it as pending.
     *
     * @param {TokenState} state - The current token state.
     * @param {PayloadAction<{ sender: string; recipient: string; amount: number }>} action - The action payload with transfer details.
     */
    suggestTransfer: (
      state: TokenState,
      action: PayloadAction<{ sender: string; recipient: string; amount: number }>
    ) => {
      const newTransfer: Token = {
        sender: action.payload.sender,
        recipient: action.payload.recipient,
        tokenAmount: action.payload.amount,
        status: 'pending',
        approver: '',
      };
      const [, setTransfers] = localStorageUtil<Token[]>('tokens', []);
      state.transfers.push(newTransfer);

      // Ideally, this is where you would communicate with the backend to save the suggested transfer.
      setTransfers(state.transfers);
    },
    /**
     * Approves a pending transfer, updates balances, and saves the changes.
     *
     * @param {TokenState} state - The current token state.
     * @param {PayloadAction<{ index: number; approver: string }>} action - The action payload with transfer index and approver.
     */
    approveTransfer: (state: TokenState, action: PayloadAction<{ index: number; approver: string }>) => {
      const { index, approver } = action.payload;
      const transfer = state.transfers[index];

      if (!transfer || state.balances[transfer.sender] < transfer.tokenAmount) {
        alert('Sender does not have enough balance to approve the transfer.');
        return;
      }

      transfer.status = 'approved';
      transfer.approver = approver;
      state.balances[transfer.sender] -= transfer.tokenAmount;
      state.balances[transfer.recipient] = (state.balances[transfer.recipient] || 0) + transfer.tokenAmount;

      const [users, setUsers] = localStorageUtil<User[]>('users', []);
      const [, setTransfers] = localStorageUtil<Token[]>('tokens', []);
      const updatedUsers = users.map((user) => {
        if (user.username === transfer.sender) {
          return { ...user, balance: user.balance - transfer.tokenAmount };
        } else if (user.username === transfer.recipient) {
          return { ...user, balance: (user.balance || 0) + transfer.tokenAmount };
        }
        return user;
      });

      // Ideally, this is where you would communicate with the backend to update the user balances and transfer states.
      setUsers(updatedUsers);
      setTransfers(state.transfers);
    },
    /**
     * Rejects a pending transfer and marks it as rejected.
     *
     * @param {TokenState} state - The current token state.
     * @param {PayloadAction<{ index: number; approver: string }>} action - The action payload with transfer index and approver.
     */
    rejectTransfer: (state: TokenState, action: PayloadAction<{ index: number; approver: string }>) => {
      const { index, approver } = action.payload;
      const [, setTransfers] = localStorageUtil<Token[]>('tokens', []);
      const transfer = state.transfers[index];

      if (!transfer) {
        alert('Transfer does not exist.');
        return;
      }

      transfer.status = 'rejected';
      transfer.approver = approver;

      // Ideally, this is where you would communicate with the backend to update the transfer status.
      setTransfers(state.transfers);
    },
  },
});

export const { setInitialBalance, setBalances, setTransfers, suggestTransfer, approveTransfer, rejectTransfer } =
  tokenSlice.actions;
export default tokenSlice.reducer;
