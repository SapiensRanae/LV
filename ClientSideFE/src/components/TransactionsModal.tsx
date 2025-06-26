import React, {useState} from 'react'
import PaymentModal from './PaymentModal'
import './TransactionsModal.css'
import closeIcon from '../assets/close.png'
import coinIcon from '../assets/coin.png'
import {useUser} from "../contexts/UserContext";

interface Props {
    onClose: () => void
    onBuying: () => void
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

export const TransactionsModal: React.FC<Props> = ({ onClose, onBuying }) => {
    const { user, refreshUser } = useUser();
    const [selectedPkg, setSelectedPkg] = useState<{ price: string; coins: string }|null>(null)

    const handlePaymentSuccess = async () => {
        if (!user || !selectedPkg) return
        // 1) POST transaction API
        await fetch('/api/FinancialTransactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                userId: user.ID,
                amount: parseFloat(selectedPkg.price),
                coins: parseInt(selectedPkg.coins, 10),
                type: 'purchase'
            })
        })
        // 2) refresh your user context (so coins balance updates)
        await refreshUser()
        // 3) close everything
        setSelectedPkg(null)
        onClose()
    }

    return (
        <div className="transactions-overlay" onClick={onClose}>
            <div className="transactions-modal" onClick={e => e.stopPropagation()}>
                <button className="transactions-close" onClick={onClose}>
                    <img src={closeIcon} alt="Close" />
                </button>
                <div className="transactions-grid">
                    <div className="transactions-col">
                        {leftPackages.map((pkg, i) => (
                            <div key={i} className="txn-row" onClick={onBuying}>
                                <span className="txn-price">{pkg.price}</span>
                                <span className="txn-coins">{pkg.coins } <img src={coinIcon} alt="coin"/> </span>
                            </div>
                        ))}
                    </div>

                    <div className="transactions-divider" />

                    <div className="transactions-col">
                        {rightPackages.map((pkg, i) => (
                            <div key={i} className="txn-row" onClick={onBuying}>
                                <span className="txn-price">{pkg.price}</span>
                                <span className="txn-coins">{pkg.coins} <img src={coinIcon} alt="coin"/> </span>
                            </div>
                        ))}
                    </div>
                </div>

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
                        <button className={user?.role === 'vip' ? "vip-btn-owned" : "vip-btn"}>{user?.role === 'vip' ? "Owned" : "Purchase"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionsModal
