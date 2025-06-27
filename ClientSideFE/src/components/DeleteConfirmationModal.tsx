import React, { useState } from 'react';
import './RegistrationModal.css';

interface Props {
    onClose: () => void;
    onConfirm: (password: string) => void;
}

const DeleteConfirmationModal: React.FC<Props> = ({ onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Handle the confirm button click
    const handleConfirm = () => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        setIsLoading(true);
        onConfirm(password);
    };

    // Enable confirm button only if requirements are met
    const isConfirmEnabled =
        confirmText.toLowerCase() === 'delete' &&
        password.length > 0 &&
        confirmPassword.length > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Delete Account</h2>
                <p className="delete-warning">
                    Warning: This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>

                <p>To confirm, type "delete" below:</p>
                <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="confirm-delete-input"
                />

                {passwordError && <div className="error-message">{passwordError}</div>}

                <p>Enter your password:</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                    }}
                    className="confirm-password-input"
                    placeholder="Your current password"
                />

                <p>Confirm your password:</p>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                    }}
                    className="confirm-password-input"
                    placeholder="Enter password again"
                />

                <div className="modal-buttons">
                    <button
                        className="btn Delete"
                        onClick={handleConfirm}
                        disabled={!isConfirmEnabled || isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete My Account'}
                    </button>
                    <button className="btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>

                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;