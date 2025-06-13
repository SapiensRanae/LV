import apiClient from './client';
import { LoginRequest, LoginResponse } from '../types';
import { jwtDecode} from "jwt-decode";

export interface RegisterRequest {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    userIcon?: string;
}

export const login = async (credentials: LoginRequest): Promise<string> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
};

export const register = async (userData: RegisterRequest): Promise<string> => {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return token;
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        // Check if token is expired
        const { exp } = jwtDecode<{ exp: number }>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    } catch (error) {
        // If token is invalid or can't be decoded
        localStorage.removeItem('token');
        return false;
    }
};