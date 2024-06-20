interface Token {
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  sender: string;
  recipient: string;
  tokenAmount: number;
}

export type { Token };
