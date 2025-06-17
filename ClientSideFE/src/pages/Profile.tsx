import React, { useState, useEffect } from 'react';
import './Profile.css';
import profileIco from "../assets/profile.png";
import coin from "../assets/coin.png";
import hidden from "../assets/Hidden.png";
import visible from "../assets/Visible.png";
import { getUserHistoryByUser } from '../api/userHistoryService';
import { UserHistory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import ProfileEditModal from '../components/ProfileEditModal';

interface ProfileProps {
    onBuyVIPClick: () => void;
    onLogoutClick: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogoutClick, onBuyVIPClick }) => {
    const { user, refreshUser } = useUser();
    const [history, setHistory] = useState<UserHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailVisible, setEmailVisible] = useState(false);
    const [phoneVisible, setPhoneVisible] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { isAuthenticated } = useAuth();

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

    const handleProfileUpdate = async () => {
        setShowEditModal(false);
        setLoading(true);
        try {
            await refreshUser(); // Refresh user data globally
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

    useEffect(() => {
        const fetchHistory = async () => {
            if (user) {
                try {
                    const historyData = await getUserHistoryByUser(user.userID);
                    setHistory(historyData);
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

    return (
        <div className="profile-bg">
            <section className="profile">
                <section className="profile-left">
                    <img
                        src={user.userIcon ? user.userIcon : profileIco}
                        alt="Profile icon"
                        className="Profile-icon"
                    />
                    <section className="NicknameBalance">
                        <section className="Nickname">{user.username}</section>
                        <section className="Balance">
                            <span>{user.balance}</span>
                            <img src={coin} alt="Balance icon" className="balance-icon" />
                        </section>
                    </section>
                    <section className="Description">
                        {user.description
                            ? user.description
                            : "No description provided. Click 'Change' to add one."
                        }
                    </section>
                    <section className="Btns-left">
                        <section className="ChangeBtn">
                            <button className="btn change-btn" onClick={() => setShowEditModal(true)}>Change</button>
                        </section>
                        <section className="BuyVIPBtn">
                            <button className="btn vip-btn" onClick={onBuyVIPClick}>Buy VIP</button>
                        </section>
                    </section>
                </section>
                <section className="divider"></section>
                <section className="profile-right">
                    <h2>Game History</h2>
                    <section className="Table">
                        <table className="GameTable">
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
                                history.map((item, index) => (
                                    <tr key={item.statisticID}>
                                        <td>{index + 1}</td>
                                        <td>{item.gameTransaction?.game?.name || 'Unknown'}</td>
                                        <td>{item.gameTransaction?.amount || 0}</td>
                                        <td>{item.gameTransaction?.isWin ? 'Win' : 'Loss'}</td>
                                        <td>{new Date(item.gameTransaction?.timestamp || '').toLocaleDateString()}</td>
                                    </tr>
                                ))
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
                            <button className="btn Delete">Delete</button>
                        </section>
                    </section>
                    <section className="ContactInfo">
                        <section className="Email">
                            <section className="EmailText">Email:</section>
                            <section className="EmailPlaceHolder">
                                {emailVisible ? user.email : user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                                <img
                                    src={emailVisible ? visible : hidden}
                                    alt={emailVisible ? "Hide" : "Show"}
                                    onClick={() => setEmailVisible(!emailVisible)}
                                />
                            </section>
                        </section>
                        <section className="Phone">
                            <section className="Phonetext">Phone:</section>
                            <section className="PhonePlaceHolder">
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
            {showEditModal && user && (
                <ProfileEditModal
                    user={user}
                    onClose={() => setShowEditModal(false)}
                    onUpdateSuccess={handleProfileUpdate}
                />
            )}
        </div>
    );
};

export default Profile;