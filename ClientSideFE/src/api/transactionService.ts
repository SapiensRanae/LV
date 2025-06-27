import apiClient from './client';
import { GameTransaction, FinancialTransaction } from '../types';

// Fetches all game transactions
export const getGameTransactions = async (): Promise<GameTransaction[]> => {
    const response = await apiClient.get<GameTransaction[]>('/gametransactions');
    return response.data;
};

// Creates a new game transaction
export const createGameTransaction = async (transaction: Omit<GameTransaction, 'gameTransactionID'>): Promise<GameTransaction> => {
    const response = await apiClient.post<GameTransaction>('/gametransactions', transaction);
    return response.data;
};

// Fetches all financial transactions
export const getFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
    const response = await apiClient.get<FinancialTransaction[]>('/financialtransactions');
    return response.data;
};

// Creates a new financial transaction
export const createFinancialTransaction = async (transaction: Omit<FinancialTransaction, 'financialTransactionID'>): Promise<FinancialTransaction> => {
    const response = await apiClient.post<FinancialTransaction>('/financialtransactions', transaction);
    return response.data;
};

// Fetches financial transactions for a specific user
export const getFinancialTransactionsByUser = async (userId: number): Promise<FinancialTransaction[]> => {
    const response = await apiClient.get<FinancialTransaction[]>(`/financialtransactions/user/${userId}`);
    return response.data;
};