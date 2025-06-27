import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserById } from '../api/userService';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';

interface UserContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider manages user state and provides a method to refresh user data
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Refresh user data from API using user ID from JWT
    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return setUser(null);
        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.sub ? parseInt(decoded.sub) : null;
            if (userId) {
                const userData = await getUserById(userId);
                setUser(userData);
            }
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

// useUser provides access to user context
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within a UserProvider');
    return ctx;
};