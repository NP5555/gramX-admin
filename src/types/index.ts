export interface User {
  _id: string;
  name: string;
  referralCode: string;
  tokens: number;
  shares: number;
  profileImage?: string;
}

export interface Task {
  _id: string;
  task: string;
  reward: number;
}

export interface LeaderboardEntry {
  _id: string;
  postion: number;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  coins: number;
  shares: number;
}

export interface Batch {
  _id: string;
  batchNumber: number;
  currentPrice: number;
  nextPrice: number;
  tokensSold: number;
  totalTokens: number;
}

export interface ApiError {
  message: string;
  status?: number;
}