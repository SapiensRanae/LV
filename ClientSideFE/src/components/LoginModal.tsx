
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

// LoginModal component handles user login logic and UI
const LoginModal: React.FC<Props> = ({ onClose, onLoginSuccess, onRegisterClick }) => {
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { refreshUser } = useUser();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Log when modal is mounted
        console.log('LoginModal mounted');
    }, []);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        doLogin();
    };

    // Perform login and handle navigation
    const doLogin = async () => {
        setError('');
        setIsLoading(true);

        try {
            await login({ email: contact, password });
            onLoginSuccess();
            await refreshUser();
            navigate('/profile');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Update contact (email) state
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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