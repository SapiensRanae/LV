import React, {useState} from 'react'
import PaymentModal from './PaymentModal'
import './TransactionsModal.css'
import closeIcon from '../assets/close.png'
import coinIcon from '../assets/coin.png'
import {useUser} from "../contexts/UserContext";
import {createFinancialTransaction} from "../api/transactionService";
import {updateUser} from "../api/userService";
import VipAccessModal from "../components/VipAccessModal";

interface Props {
    onClose: () => void
}

const leftPackages = [
    { price: '4,99 USD', coins: '1' },
    { price: '49,99 USD', coins: '10' },
    { price: '124,99 USD', coins: '25' },
    { price: '249,99 USD', coins: '50' },
]

const rightPackages = [
    { price: '499,99 USD', coins: '100' },
    { price: '1249,99 USD', coins: '250' },
    { price: '2499,99 USD', coins: '500' },
    { price: '4999,99 USD', coins: '1000' },
]

const vipFeatures = [
    'Deposit bonus',
    'Cashback',
    'Higher withdrawal limits',
    'Higher stake limit',
    'Early access to new games',
    'Free spins',
    'Bake a cake:',
]

// TransactionsModal displays coin purchase options and VIP upgrade
export const TransactionsModal: React.FC<Props> = ({ onClose}) => {
    const [showModal, setShowModal] = useState(false);
    const [resolveModalClose, setResolveModalClose] = useState<(() => void) | null>(null);
    const {user, refreshUser} = useUser();
    const [selectedPkg, setSelectedPkg] = useState<{ price: string; coins: string } | null>(null)

    // Handle successful payment: create transaction and update user
    const handlePaymentSuccess = async () => {
        if (!user || !selectedPkg) return;
        try {
            const coins = parseInt(selectedPkg.coins, 10);
            const previousBalance = user.balance;
            const newBalance = previousBalance + coins;
            await createFinancialTransaction({
                userID: user.userID,
                cashAmount: coins,
                transactionType: 'deposit',
                previousBalance,
                newBalance,
                date: new Date().toISOString()
            });

            console.log('Transaction created',);
            await refreshUser();
            setSelectedPkg(null);
            onClose();
        } catch (err) {
            console.error('Payment or transaction failed:', err);
        }
    };

    // Wait for VIP modal to close before continuing
    const waitForModalClose = () =>
        new Promise<void>((resolve) => {
            setShowModal(true);
            setResolveModalClose(() => resolve);
        });

    // Handle closing of VIP modal
    const handleVipModalClose = () => {
        setShowModal(false);
        if (resolveModalClose) {
            resolveModalClose();
            setResolveModalClose(null);
        }
    };

    // Handle VIP purchase: update user role and refresh
    const handleVipPurchase = async () => {
        if (!user) return;
        try {
            await updateUser(user.userID, {
                userID: user.userID,
                role: 'vip',
                username: user.username,
                email: user.email,
                balance: user.balance,
                phoneNumber: user.phoneNumber,
                userIcon: user.userIcon,
                description: user.description
            });
            await waitForModalClose();
            await refreshUser();
            onClose();
        } catch (error: any) {
            console.error('Failed to upgrade user to VIP:', error);
            alert('Failed to complete purchase.');
        }
    };

    return (
        <>
            {showModal && <VipAccessModal onClose={handleVipModalClose} />}

            <div className="transactions-overlay" onClick={onClose}>
                <div className="transactions-modal" onClick={e => e.stopPropagation()}>
                    <button className="transactions-close" onClick={onClose}>
                        <img src={closeIcon} alt="Close"/>
                    </button>
                    <div className="transactions-grid">
                        <div className="transactions-col">
                            {leftPackages.map((pkg, i) => (
                                <div
                                    key={i}
                                    className="txn-row"
                                    onClick={() => setSelectedPkg(pkg)}
                                >
                                    <span className="txn-price">{pkg.price}</span>
                                    <span className="txn-coins">{pkg.coins} <img src={coinIcon} alt="coin"/></span>
                                </div>
                            ))}
                        </div>

                        <div className="transactions-divider"/>

                        <div className="transactions-col">
                            {rightPackages.map((pkg, i) => (
                                <div
                                    key={i}
                                    className="txn-row"
                                    onClick={() => setSelectedPkg(pkg)}
                                >
                                    <span className="txn-price">{pkg.price}</span>
                                    <span className="txn-coins">{pkg.coins} <img src={coinIcon} alt="coin"/></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedPkg && (
                        <PaymentModal
                            package={selectedPkg}
                            onClose={() => setSelectedPkg(null)}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    )}

                    <div className="vip-section">
                        <div className="vip-table">
                            <div className="vip-header">
                                <span>Bonuses:</span>
                                <span>Standard</span>
                                <span style={{justifyContent: "center;"}}>VIP</span>
                            </div>
                            {vipFeatures.map((feat, i) => (
                                <div key={i} className="vip-row">
                                    <span className="feat-name">{feat}</span>
                                    <span className="std">{i === 6 ? '-' : '-'}</span>
                                    <span className="vip">{i === 6 ? '-' : '+'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="vip-promo">
                            <h3>VIP ACCESS</h3>
                            <p className="vip-price">249,99 USD<span className="per-month">/month</span></p>
                            <button className={user?.role === 'vip' ? "vip-btn-owned" : "vip-btn"}
                                    onClick={user?.role !== 'vip' ? handleVipPurchase : undefined}>{user?.role === 'vip' ? "Owned" : "Purchase"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionsModal;