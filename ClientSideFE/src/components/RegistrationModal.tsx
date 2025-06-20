import React, { useState } from 'react';
import './RegistrationModal.css';
import { Link, useNavigate } from "react-router-dom";


import axios from 'axios';

interface Props {
    onClose: () => void;
    onRegisterSuccess: () => void;
    onLoginPress: () => void;
}

const RegistrationModal: React.FC<Props> = ({ onClose, onRegisterSuccess, onLoginPress }) => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userIcon, setUserIcon] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Validate passwords match
        if (password !== passwordConfirm) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Sending registration request');
            const response = await axios.post('http://localhost:5151/api/Auth/register', {
                username: nickname,
                email,
                phoneNumber: phone,
                password,
                userIcon
            });

            console.log('Registration successful:', response.data);
            localStorage.setItem('token', response.data.token);
            onRegisterSuccess();
            navigate('/profile');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            console.error('Registration error:', errorMsg, err);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserIcon(reader.result as string);
            };
            reader.readAsDataURL(file);
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