import apiClient from './client';
import { UserHistory } from '../types';

// Fetches all user history records
export const getUserHistory = async (): Promise<UserHistory[]> => {
    const response = await apiClient.get<UserHistory[]>('/userhistory');
    return response.data;
};

// Fetches user history records for a specific user
export const getUserHistoryByUser = async (userId: number): Promise<UserHistory[]> => {
    const response = await apiClient.get<UserHistory[]>(`/userhistory/user/${userId}`);
    return response.data;
};