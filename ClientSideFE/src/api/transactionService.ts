import apiClient from './client';
import { GameTransaction, FinancialTransaction } from '../types';

export const getGameTransactions = async (): Promise<GameTransaction[]> => {
    const response = await apiClient.get<GameTransaction[]>('/gametransactions');
    return response.data;
};

export const createGameTransaction = async (transaction: Omit<GameTransaction, 'gameTransactionID'>): Promise<GameTransaction> => {
    const response = await apiClient.post<GameTransaction>('/gametransactions', transaction);
    return response.data;
};

export const getFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
    const response = await apiClient.get<FinancialTransaction[]>('/financialtransactions');
    return response.data;
};

export const createFinancialTransaction = async (transaction: Omit<FinancialTransaction, 'financialTransactionID'>): Promise<FinancialTransaction> => {
    const response = await apiClient.post<FinancialTransaction>('/financialtransactions', transaction);
    return response.data;
};
