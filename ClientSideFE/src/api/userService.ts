import apiClient from './client';
import { User } from '../types';

// Fetches all users
export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
};

// Fetches a user by ID
export const getUserById = async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
};

// Creates a new user
export const createUser = async (user: Omit<User, 'userID'>): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
};

// Updates an existing user by ID
export const updateUser = async (id: number, user: User): Promise<void> => {
    await apiClient.put(`/users/${id}`, user);
};

// Deletes a user by ID
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};