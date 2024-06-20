import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateUserBalance } from '@/features/tokens/utils/tokenUtils';

interface Token {
  sender: string;
  recipient: string;
  tokenAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
}

interface TokenState {
  balance: Record<string, number>;
  transfers: Token[];
}

const initialState: TokenState = {
  balance: {},
  transfers: JSON.parse(localStorage.getItem('tokens') || '[]'),
};

const saveTransfersToLocalStorage = (transfers: Token[]) => {
  localStorage.setItem('tokens', JSON.stringify(transfers));
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setInitialBalance: (state, action: PayloadAction<{ username: string; balance: number }>) => {
      state.balance[action.payload.username] = action.payload.balance;
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
        updateUserBalance(transfer.sender, -transfer.tokenAmount);
        updateUserBalance(transfer.recipient, transfer.tokenAmount);
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

export const { setInitialBalance, suggestTransfer, approveTransfer, rejectTransfer } = tokenSlice.actions;
export default tokenSlice.reducer;
