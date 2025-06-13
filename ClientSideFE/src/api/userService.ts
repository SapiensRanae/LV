import apiClient from './client';
import { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
};

export const createUser = async (user: Omit<User, 'userID'>): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
};

export const updateUser = async (id: number, user: User): Promise<void> => {
    await apiClient.put(`/users/${id}`, user);
};

export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};
