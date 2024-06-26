import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { suggestTransfer, approveTransfer, rejectTransfer, setTransfers, setBalances } from '@/features/tokens';
import { logout } from '@/features/auth';

const TokenDashboard = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const balance = useSelector((state: RootState) => state.tokens.balances[username]);
  const transfers = useSelector((state: RootState) => state.tokens.transfers);
  const [sender, setSender] = useState<string>(username);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const handleSuggestTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(suggestTransfer({ sender, recipient, amount }));
  };

  const handleApproveTransfer = (index: number) => {
    dispatch(approveTransfer({ index, approver: username }));
  };

  const handleRejectTransfer = (index: number) => {
    dispatch(rejectTransfer({ index, approver: username }));
  };

  useEffect(() => {
    dispatch(setTransfers());
    dispatch(setBalances());
  }, [dispatch, username]);

  return (
    <div>
      <h2>Token Dashboard</h2>
      <p>
        {username} Your balance: {balance}
      </p>
      <button
        type="button"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
      <form onSubmit={handleSuggestTransfer}>
        <div>
          <label>Sender:</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>
        <div>
          <label>Recipient:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          disabled={!sender || !recipient}
        >
          Suggest Transfer
        </button>
      </form>
      <h3>Pending Transfers</h3>
      <ul>
        {transfers.map((transfer, index) => (
          <li key={index}>
            {`${transfer.sender} -> ${transfer.recipient}: ${transfer.tokenAmount} tokens [${transfer.status}]`}
            {transfer.status === 'pending' && (
              <>
                <button onClick={() => handleApproveTransfer(index)}>Approve</button>
                <button onClick={() => handleRejectTransfer(index)}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenDashboard;
