// src/components/LoginModal.tsx
import React, { useState, useEffect } from 'react';
import './LoginModal.css';
import './RegistrationModal.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface Props {
    onClose: () => void;
    onLoginSuccess: () => void;
    onRegisterClick: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose, onLoginSuccess, onRegisterClick }) => {
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { refreshUser } = useUser();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('LoginModal mounted');
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Form submit triggered');
        doLogin();
    };

    const doLogin = async () => {
        console.log('Starting login process', { contact, password });
        setError('');
        setIsLoading(true);

        try {
            await login({ email: contact, password });
            console.log('Login successful');

            onLoginSuccess();

            await refreshUser();
            navigate('/profile');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            console.error('Login error:', errorMsg, err);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Email changed:', e.target.value);
        setContact(e.target.value);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={contact}
                            onChange={handleEmailChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                        onClick={(e) => {
                            console.log('Login button clicked');
                            if (!isLoading) handleSubmit(e);
                        }}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-login" onClick={onRegisterClick}>Don't have an account?</div>
            </div>
        </div>
    );
};

export default LoginModal;