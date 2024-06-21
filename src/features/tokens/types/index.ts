interface Token {
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  sender: string;
  recipient: string;
  tokenAmount: number;
}

interface TokenState {
  balance: Record<string, number>;
  transfers: Token[];
}

export type { Token, TokenState };
