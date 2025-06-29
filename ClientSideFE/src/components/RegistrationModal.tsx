import React, { useState } from 'react';
import './RegistrationModal.css';
import { Link, useNavigate } from "react-router-dom";
import { register, RegisterRequest } from '../api/authService';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    onClose: () => void;
    onRegisterSuccess: () => void;
    onLoginPress: () => void;
}

// RegistrationModal handles user registration form and validation
const RegistrationModal: React.FC<Props> = ({ onClose, onRegisterSuccess, onLoginPress }) => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userIcon, setUserIcon] = useState<string>('');

    const isPasswordStrong = (pwd: string) => {
        // At least 8 characters, one special character, one number, one uppercase, one lowercase
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
    };

    const isEmailValid = (email: string) => {
        // Simple email regex for validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle registration form submission and validation
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
            if (password !== passwordConfirm) {
                setError("Passwords don't match");
                return;
            }
            if (!isPasswordStrong(password)) {
                setError("Password must be at least 8 characters, include upper and lower case letters, a number, and a special symbol.");
                return;
            }
        if (!isEmailValid(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const userData: RegisterRequest = {
                username: nickname,
                email,
                phoneNumber: phone,
                password,
                userIcon
            };

            const token = await register(userData);
            if (token) {
                login(token);
                window.location.reload();
            }

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Registration</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>
                        Create your nickname:
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Enter your email address:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            required
                        />
                    </label>
                    <label>
                        Enter your phone number:
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+XXX XX XXX XXXX"
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
                    <label>
                        Password confirmation:
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </label>
                    <div className="checkboxes">
                        <label>
                            <input type="checkbox" required />
                            I confirm that I am 21 years old and do not have a gambling addiction.
                        </label>
                        <label>
                            <input type="checkbox" required />
                            <p>I consent to the processing of my personal data and I have read and agreed to the
                                <Link to="/terms" style={{color: "#F0CE77"}}> Terms & Conditions</Link> and <Link to="/privacy-policy" style={{color: "#F0CE77"}}>Privacy Policy</Link></p>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="btn-register"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Registration'}
                    </button>

                </form>
                <button className="modal-close" onClick={onClose}>×</button>
                <a className="modal-login" onClick={onLoginPress}>Already have an account?</a>
            </div>
        </div>
    );
};

export default RegistrationModal;