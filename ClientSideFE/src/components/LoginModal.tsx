// src/components/LoginModal.tsx
import React from 'react';
import './LoginModal.css';
import './RegistrationModal.css';

interface Props {
    onClose: () => void;
    onLoginSuccess: () => void;
    onRegisterClick: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose, onLoginSuccess, onRegisterClick }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // call your login API
        onLoginSuccess();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email or phone:
                        <input type="text" name="contact" required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" required />
                    </label>
                    <button type="submit" className="btn-login">
                        Log In
                    </button>
                </form>
                <button className="modal-close" onClick={onClose}>×</button>
                <a className="modal-login" onClick={onRegisterClick}>Already have an account?</a>
            </div>
        </div>
    );
};

export default LoginModal;
