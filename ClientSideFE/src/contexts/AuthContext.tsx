import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../api/authService';
import { LoginRequest } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<string>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider manages authentication state and provides login/logout methods
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    // Handle user login and update authentication state
    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await authService.login(credentials);
            setIsAuthenticated(true);
            setIsLoading(false);
            return token;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            setIsLoading(false);
            throw err;
        }
    };

    // Handle user logout and clear authentication state
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth provides access to authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};