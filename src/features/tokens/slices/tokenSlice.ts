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
    adjustUserBalance: (state, action: PayloadAction<{ username: string; balance: number }>) => {
      const { username, balance } = action.payload;
      state.balance[username] = balance;

      const [users] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);
      const updatedUsers = users.map((user) =>
        user.username === username ? { ...user, tokenBalance: balance } : user
      );
      saveUsersToLocalStorage(updatedUsers);
    },
    setInitialBalance: (state, action: PayloadAction<{ username: string; initialBalance?: number }>) => {
      const { username, initialBalance = 10 } = action.payload;
      const [users, setUsers] = localStorageUtil<{ username: string; tokenBalance: number }[]>('users', []);
      const [tokens] = localStorageUtil<Token[]>('tokens', []);
      const updatedUsers = setUsersWithBalanceAdjustment(username, users, tokens, initialBalance);
      setUsers(updatedUsers);

      const user = updatedUsers.find((user) => user.username === username);
      if (user) {
        state.balance[username] = user.tokenBalance;
      } else {
        state.balance[username] = initialBalance;
      }
    },
    suggestTransfer: (state, action: PayloadAction<{ sender: string; recipient: string; amount: number }>) => {
      const newTransfer: Token = {
        sender: action.payload.sender,
        recipient: action.payload.recipient,
        tokenAmount: action.payload.amount,
        status: 'pending',
        approver: '',
      };
      state.transfers.push(newTransfer);
      saveTransfersToLocalStorage(state.transfers);
    },
    approveTransfer: (state, action: PayloadAction<{ index: number; approver: string }>) => {
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
        saveUsersToLocalStorage(updatedUsers);

        saveTransfersToLocalStorage(state.transfers);
      } else {
        alert('Sender does not have enough balance to approve the transfer.');
      }
    },
    rejectTransfer: (state, action: PayloadAction<{ index: number; approver: string }>) => {
      const { index, approver } = action.payload;
      const transfer = state.transfers[index];
      if (transfer) {
        transfer.status = 'rejected';
        transfer.approver = approver;
        saveTransfersToLocalStorage(state.transfers);
      }
    },
  },
});

export const { adjustUserBalance, setInitialBalance, suggestTransfer, approveTransfer, rejectTransfer } =
  tokenSlice.actions;
export default tokenSlice.reducer;
