// src/components/ProfileEditModal.tsx
import React, { useState, useRef } from 'react';
import './LoginModal.css';
import { updateUser } from '../api/userService';
import { User } from '../types';
import defaultProfileIcon from '../assets/profile.png';

interface Props {
    user: User;
    onClose: () => void;
    onUpdateSuccess: () => void;
}

interface UserUpdateRequest extends Omit<User, 'passwordHash'> {
    currentPassword: string;
    newPassword?: string;
}

// ProfileEditModal allows users to update profile info, icon, and password
const ProfileEditModal: React.FC<Props> = ({ user, onClose, onUpdateSuccess }) => {
    const [username, setUsername] = useState(user.username);
    const [description, setDescription] = useState(user.description || '');
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');

    // File upload state
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState('');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle profile icon file selection and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 15MB file size limit
        const MAX_SIZE = 15 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setUploadError(`File size exceeds 15MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
            return;
        }

        setUploadError('');
        setIconFile(file);

        // Preview selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setIconPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Validate form fields and password change
    const validateForm = () => {
        setError('');
        setPasswordError('');

        if (!currentPassword) {
            setError('Current password is required to save changes');
            return false;
        }

        if (newPassword) {
            if (newPassword.length < 8) {
                setPasswordError('New password must be at least 8 characters');
                return false;
            }
            if (newPassword !== confirmPassword) {
                setPasswordError('New passwords do not match');
                return false;
            }
        }

        return true;
    };

    // Handle form submission and update user profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let iconUrl = user.userIcon;

            // Convert uploaded file to base64 if present
            if (iconFile) {
                iconUrl = await convertFileToBase64(iconFile);
            }

            const updateData: UserUpdateRequest = {
                userID: user.userID,
                role: user.role,
                email: user.email,
                balance: user.balance,
                username,
                phoneNumber,
                description,
                userIcon: iconUrl,
                currentPassword,
                newPassword: newPassword || undefined
            };

            await updateUser(user.userID, updateData);
            onUpdateSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Convert file to base64 string
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-profile-modal" onClick={e => e.stopPropagation()}>
                <h2>Edit Profile</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="profile-icon-upload">
                        <img
                            src={iconPreview || user.userIcon || defaultProfileIcon}
                            alt="Profile"
                            className="profile-icon-preview"
                        />
                        <div>
                            <button
                                type="button"
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Profile Picture
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            {iconFile && <div className="file-name">{iconFile.name}</div>}
                            {uploadError && <div className="upload-error">{uploadError}</div>}
                        </div>
                    </div>

                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </label>

                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </label>

                    <div className="password-section">
                        <h3>Change Password</h3>
                        {passwordError && <div className="password-error">{passwordError}</div>}

                        <label>
                            New Password:
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                            />
                        </label>

                        <label>
                            Confirm New Password:
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </label>
                    </div>

                    <div className="confirm-section">
                        <label>
                            Current Password (required to save changes):
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>

                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default ProfileEditModal;