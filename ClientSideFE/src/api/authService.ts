import apiClient from './client';
import { LoginRequest, LoginResponse } from '../types';
import { jwtDecode } from "jwt-decode";

export interface RegisterRequest {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    userIcon?: string;
}

// Logs in the user and stores the JWT token in localStorage
export const login = async (credentials: LoginRequest): Promise<string> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
};

// Registers a new user and stores the JWT token in localStorage
export const register = async (userData: RegisterRequest): Promise<string> => {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
};

// Logs out the user by removing the JWT token from localStorage
export const logout = (): void => {
    localStorage.removeItem('token');
};

// Deletes a user by userId
export const deleteUser = async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
};

// Checks if the user is authenticated by validating the JWT token
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
};