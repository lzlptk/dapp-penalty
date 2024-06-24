import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { localStorageUtil } from '@/shared';
import { setUsersWithBalanceAdjustment, type Token, type TokenState } from '@/features/tokens';

const [initialTransfers] = localStorageUtil<Token[]>('tokens', []);
const [initialUsers] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);

const initialState: TokenState = {
  balance: initialUsers.reduce(
    (acc, user) => {
      acc[user.username] = user.tokenBalance;
      return acc;
    },
    {} as Record<string, number>
  ),
  transfers: initialTransfers,
};

const saveTransfersToLocalStorage = (transfers: Token[]) => {
  localStorage.setItem('tokens', JSON.stringify(transfers));
};

const saveUsersToLocalStorage = (users: { username: string; tokenBalance: number }[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    /**
     * Adjusts the token balance of a specific user and updates the users list.
     *
     * @param {TokenState} state - The current state of the tokens.
     * @param {PayloadAction<{ username: string; balance: number }>} action - The action to be dispatched.
     * @param {string} action.payload.username - The username of the user whose balance is to be adjusted.
     * @param {number} action.payload.balance - The new balance for the user.
     */
    adjustUserBalance: (state: TokenState, action: PayloadAction<{ username: string; balance: number }>) => {
      const { username, balance } = action.payload;
      state.balance[username] = balance;

      const [users] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);
      const updatedUsers = users.map((user) =>
        user.username === username ? { ...user, tokenBalance: balance } : user
      );

      // This is where it would be ideal to communicate with the backend to update the user's balance.
      saveUsersToLocalStorage(updatedUsers);
    },
    /**
     * Sets the initial balance for a new user or updates an existing user's balance if they already exist.
     *
     * @param {TokenState} state - The current state of the tokens.
     * @param {PayloadAction<{ username: string; initialBalance?: number }>} action - The action to be dispatched.
     * @param {string} action.payload.username - The username of the user whose initial balance is to be set.
     * @param {number} [action.payload.initialBalance=10] - The initial balance for the user. Defaults to 10 if not provided.
     */
    setInitialBalance: (state: TokenState, action: PayloadAction<{ username: string; initialBalance?: number }>) => {
      const { username, initialBalance = 10 } = action.payload;
      const [users, setUsers] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);
      const [tokens] = localStorageUtil<Token[]>('tokens', []);
      const updatedUsers = setUsersWithBalanceAdjustment(username, users, tokens, initialBalance);

      // This is where it would be ideal to communicate with the backend to create a new user with a balance.
      setUsers(updatedUsers);

      const user = updatedUsers.find((user) => user.username === username);
      if (user) {
        state.balance[username] = user.tokenBalance;
      } else {
        state.balance[username] = initialBalance;
      }
    },
    /**
     * Suggests a transfer of tokens from one user to another and marks the transfer as pending.
     *
     * @param {TokenState} state - The current state of the tokens.
     * @param {PayloadAction<{ sender: string; recipient: string; amount: number }>} action - The action to be dispatched.
     * @param {string} action.payload.sender - The username of the user sending the tokens.
     * @param {string} action.payload.recipient - The username of the user receiving the tokens.
     * @param {number} action.payload.amount - The amount of tokens to be transferred.
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
      state.transfers.push(newTransfer);

      // This is where it would be ideal to communicate with the backend to save the suggested transfer.
      saveTransfersToLocalStorage(state.transfers);
    },
    /**
     * Approves a pending transfer of tokens, updates the balances of the sender and recipient, and saves the changes.
     *
     * @param {TokenState} state - The current state of the tokens.
     * @param {PayloadAction<{ index: number; approver: string }>} action - The action to be dispatched.
     * @param {number} action.payload.index - The index of the transfer in the transfers array.
     * @param {string} action.payload.approver - The username of the user approving the transfer.
     */
    approveTransfer: (state: TokenState, action: PayloadAction<{ index: number; approver: string }>) => {
      const { index, approver } = action.payload;
      const transfer = state.transfers[index];
      if (transfer && state.balance[transfer.sender] >= transfer.tokenAmount) {
        transfer.status = 'approved';
        transfer.approver = approver;
        state.balance[transfer.sender] -= transfer.tokenAmount;
        state.balance[transfer.recipient] = (state.balance[transfer.recipient] || 0) + transfer.tokenAmount;

        const [users] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);
        const updatedUsers = users.map((user) => {
          if (user.username === transfer.sender) {
            return { ...user, tokenBalance: user.tokenBalance - transfer.tokenAmount };
          } else if (user.username === transfer.recipient) {
            return { ...user, tokenBalance: (user.tokenBalance || 0) + transfer.tokenAmount };
          }
          return user;
        });

        // This is where it would be ideal to communicate with the backend to update the user balances.
        saveUsersToLocalStorage(updatedUsers);
        saveTransfersToLocalStorage(state.transfers);
      } else {
        alert('Sender does not have enough balance to approve the transfer.');
      }
    },
    /**
     * Rejects a pending transfer of tokens and marks it as rejected.
     *
     * @param {TokenState} state - The current state of the tokens.
     * @param {PayloadAction<{ index: number; approver: string }>} action - The action to be dispatched.
     * @param {number} action.payload.index - The index of the transfer in the transfers array.
     * @param {string} action.payload.approver - The username of the user rejecting the transfer.
     */
    rejectTransfer: (state: TokenState, action: PayloadAction<{ index: number; approver: string }>) => {
      const { index, approver } = action.payload;
      const transfer = state.transfers[index];
      if (transfer) {
        transfer.status = 'rejected';
        transfer.approver = approver;

        // This is where it would be ideal to communicate with the backend to update the transfer status.
        saveTransfersToLocalStorage(state.transfers);
      }
    },
  },
});

export const { adjustUserBalance, setInitialBalance, suggestTransfer, approveTransfer, rejectTransfer } =
  tokenSlice.actions;
export default tokenSlice.reducer;
