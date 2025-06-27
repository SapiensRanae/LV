import React, { useState, useEffect } from 'react';
import './Profile.css';
import profileIco from "../assets/profile.png";
import coin from "../assets/coin.png";
import hidden from "../assets/Hidden.png";
import visible from "../assets/Visible.png";
import { getUserHistoryByUser } from '../api/userHistoryService';
import {deleteUser, updateUser} from '../api/userService';
import { UserHistory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ProfileEditModal from '../components/ProfileEditModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import VipCancelModal from "../components/VipCancelModal";

// Props for Profile component
interface ProfileProps {
    onBuyVIPClick: () => void;
    onLogoutClick: () => void;
}

// Profile page displays user info, game history, and allows editing/deleting account
const Profile: React.FC<ProfileProps> = ({onLogoutClick, onBuyVIPClick }) => {
    const { user, refreshUser } = useUser();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [resolveModalClose, setResolveModalClose] = useState<(() => void) | null>(null);
    const [history, setHistory] = useState<UserHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailVisible, setEmailVisible] = useState(false);
    const [phoneVisible, setPhoneVisible] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalWinnings, setTotalWinnings] = useState<number>(0);

    const navigate = useNavigate();

    // Format phone number for display (masked/unmasked)
    const formatPhoneNumber = (phone: string | undefined) => {
        if (!phone || phone.trim() === '') {
            return {
                visible: "Not provided",
                hidden: "Not provided"
            };
        }
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length >= 10) {
            const lastFourVisible = digitsOnly.slice(-4);
            const restHidden = digitsOnly.slice(0, -4);
            return {
                visible: phone,
                hidden: `+${restHidden.slice(0, 3)} ** *** ${lastFourVisible}`
            };
        }
        return {
            visible: phone,
            hidden: phone.slice(0, 3) + "****" + phone.slice(-3)
        };
    };

    // Refresh user and history after profile update
    const handleProfileUpdate = async () => {
        setShowEditModal(false);
        setLoading(true);
        try {
            await refreshUser();
            if (user) {
                const historyData = await getUserHistoryByUser(user.userID);
                setHistory(historyData);
            }
        } catch (err) {
            setError('Failed to refresh profile data');
        } finally {
            setLoading(false);
        }
    };

    // Delete user account and logout
    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            await deleteUser(user.userID);
            logout();
            navigate('/');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to delete account';
            setDeleteError(errorMsg);
            setShowDeleteModal(false);
        }
    };

    // Fetch user game history on mount or user change
    useEffect(() => {
        const fetchHistory = async () => {
            if (user) {
                try {
                    const historyData = await getUserHistoryByUser(user.userID);
                    console.log('User history:', historyData);
                    setHistory(historyData)
                } catch {
                    setError('Failed to load profile data');
                }
            }
            setLoading(false);
        };
        if (isAuthenticated && user) {
            setLoading(true);
            fetchHistory();
        } else if (!isAuthenticated) {
            setLoading(false);
            setError('User not authenticated');
        }
    }, [isAuthenticated, user]);

    if (loading) return <div className="profile-bg"><div className="loading">Loading profile...</div></div>;
    if (error || !user) return (
        <div className="profile-bg">
            <div className="error-container">
                <div className="error-message">
                    {error || "User not found"}
                </div>
                <button className="btn Logout error-logout" onClick={onLogoutClick}>
                    Logout
                </button>
            </div>
        </div>
    );

    // Wait for VIP cancel modal to close
    const waitForModalClose = () =>
        new Promise<void>((resolve) => {
            setShowCancelModal(true);
            setResolveModalClose(() => resolve);
        });

    // Handle VIP cancel modal close
    const handleVipCancelModalClose = () => {
        setShowCancelModal(false);
        if (resolveModalClose) {
            resolveModalClose();
            setResolveModalClose(null);
        }
    };

    // Cancel VIP subscription and refresh user
    const handleVipCancel = async () => {
        if (!user) return;
        try {
            await updateUser(user.userID, {
                userID: user.userID,
                role: 'player',
                username: user.username,
                email: user.email,
                balance: user.balance,
                phoneNumber: user.phoneNumber,
                userIcon: user.userIcon,
                description: user.description
            });
            await waitForModalClose();
            await refreshUser();
        } catch (error: any) {
            console.error('Failed to cancel VIP subscription:', error);
            alert('Failed to cancel.');
        }
    };

    return (
        <>
            {showCancelModal && <VipCancelModal onClose={handleVipCancelModalClose} />}

            <div className="profile-bg">
                <section className="profile">
                    <section className="profile-left">
                        <img
                            src={user.userIcon ? user.userIcon : profileIco}
                            alt="Profile icon"
                            className="Profile-icon"
                        />
                        <section className="NicknameBalance">
                            <section className={user?.role === 'vip' ? "NicknameVip" : "Nickname"}>{user.username}</section>
                            <section className={user?.role === 'vip' ? "BalanceVip" : "Balance"}>
                                <span>{user.balance}</span>
                                <img src={coin} alt="Balance icon" className="balance-icon" />
                            </section>
                        </section>
                        <section className={user?.role === 'vip' ? "DescriptionVip" : "Description"}>
                            {user.description
                                ? user.description
                                : "No description provided. Click 'Change' to add one."
                            }
                        </section>
                        <section className="Btns-left">
                            <section className="ChangeBtn">
                                <button className={user?.role === 'vip' ? "change-btnVip" : "btn change-btn"} onClick={() => setShowEditModal(true)}>Change</button>
                            </section>
                            <section className="BuyVIPBtn">
                                <button
                                    className={user?.role === 'vip' ? "btn CancelVipBtn" : "btn BuyVIPBtn"}
                                    onClick={user?.role === 'vip' ? handleVipCancel : onBuyVIPClick}
                                >
                                    {user?.role === 'vip' ? "Cancel VIP" : "Buy VIP"}
                                </button>
                            </section>
                        </section>
                    </section>
                    <section className={user?.role === 'vip' ? "dividerVip" : "divider"}></section>
                    <section className="profile-right">
                        <h2>Game History</h2>
                        <section className={user?.role === 'vip' ? "TableVip" : "Table"}>
                            <table className={user?.role === 'vip' ? "GameTableVip" : "GameTable"}>
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Game</th>
                                    <th>Your bet</th>
                                    <th>Result</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {history.length > 0 ? (
                                    history.map((item, index) => {
                                        const tx = item.gameTransaction;
                                        if (!tx) return null;
                                        const bet = tx.amount;
                                        const winnings = typeof tx.gameResult !== "undefined" ? tx.gameResult : (tx.isWin ? bet : 0);
                                        return (
                                            <tr key={item.statisticID}>
                                                <td>{index + 1}</td>
                                                <td>{tx.game?.name || 'Unknown'}</td>
                                                <td>{bet}</td>
                                                <td style={{color: winnings > 0 ? 'green' : 'crimson'}}>
                                                    {winnings > 0 ? `+${winnings}` : '0'}
                                                </td>
                                                <td>{new Date(tx.timestamp).toLocaleString()}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>No game history yet</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </section>
                        <section className="Btns-right">
                            <section className="LogoutBtn">
                                <button className="btn Logout" onClick={onLogoutClick}>Logout</button>
                            </section>
                            <section className="DeleteBtn">
                                <button
                                    className="btn Delete"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete
                                </button>
                            </section>
                        </section>
                        <section className="ContactInfo">
                            <section className="Email">
                                <section className={user?.role === 'vip' ? "EmailTextVip" : "EmailText"}>Email:</section>
                                <section className={user?.role === 'vip' ? "EmailPlaceHolderVip" : "EmailPlaceHolder"}>
                                    {emailVisible ? user.email : user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                                    <img
                                        src={emailVisible ? visible : hidden}
                                        alt={emailVisible ? "Hide" : "Show"}
                                        onClick={() => setEmailVisible(!emailVisible)}
                                    />
                                </section>
                            </section>
                            <section className="Phone">
                                <section className={user?.role === 'vip' ? "PhonetextVip" : "Phonetext"}>Phone:</section>
                                <section className={user?.role === 'vip' ? "PhonePlaceHolderVip" : "PhonePlaceHolder"}>
                                    {phoneVisible
                                        ? formatPhoneNumber(user.phoneNumber).visible
                                        : formatPhoneNumber(user.phoneNumber).hidden
                                    }
                                    <img
                                        src={phoneVisible ? visible : hidden}
                                        alt={phoneVisible ? "Hide" : "Show"}
                                        onClick={() => setPhoneVisible(!phoneVisible)}
                                    />
                                </section>
                            </section>
                        </section>
                    </section>
                </section>
                {/* Edit profile modal */}
                {showEditModal && user && (
                    <ProfileEditModal
                        user={user}
                        onClose={() => setShowEditModal(false)}
                        onUpdateSuccess={handleProfileUpdate}
                    />
                )}

                {/* Delete confirmation modal */}
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteAccount}
                    />
                )}

                {/* Show error if deletion fails */}
                {deleteError && (
                    <div className="error-message delete-error">
                        {deleteError}
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;