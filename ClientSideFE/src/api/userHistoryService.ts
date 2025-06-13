import apiClient from './client';
import { UserHistory } from '../types';

export const getUserHistory = async (): Promise<UserHistory[]> => {
    const response = await apiClient.get<UserHistory[]>('/userhistory');
    return response.data;
};

export const getUserHistoryByUser = async (userId: number): Promise<UserHistory[]> => {
    const response = await apiClient.get<UserHistory[]>(`/userhistory/user/${userId}`);
    return response.data;
};