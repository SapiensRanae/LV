
export interface User {
    userID: number;
    role: string;
    username: string;
    email: string;
    phoneNumber?: string;
    passwordHash?: string;
    balance: number;
    userIcon?: string;
    description?: string;
}
export interface Game {
    gameID: number;
    name: string;
    description: string;
    imageUrl?: string;
}

export interface GameWithRatio {
    ratioID: number;
    gameID: number;
    winRatio: number;
    game?: Game;
}

export interface GameTransaction {
    gameTransactionID: number;
    userID: number;
    gameID: number;
    amount: number;

    isWin: boolean;
    timestamp: string;
    user?: User;
    game?: Game;
}

export interface FinancialTransaction {
    financialTransactionID: number;
    userID: number;
    cashAmount: number;
    date: string;
    transactionType: 'deposit' | 'withdrawal';
    previousBalance: number;
    newBalance: number;
}
export interface UserHistory {
    statisticID: number;
    userID: number;
    gameTransactionID: number;
    user?: User;
    gameTransaction?: GameTransaction;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}