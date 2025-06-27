import React from 'react';
import './VipAccessModal.css';

interface VipAccessModalProps {
    onClose: () => void;
}

// VipAccessModal displays a confirmation for VIP subscription purchase
const VipAccessModal: React.FC<VipAccessModalProps> = ({ onClose }) => (
    <div className="vip-access-overlay" onClick={onClose}>
        <div className="vip-access-modal" onClick={e => e.stopPropagation()}>
            <button className="vip-access-close" onClick={onClose}>
                ×
            </button>
            <h2>Congratulations!</h2>
            <p>
                You've bought our VIP subscription, welcome to the elite of our casino!
            </p>
            <button className="vip-access-button" onClick={onClose}>
                Neat
            </button>
        </div>
    </div>
);

export default VipAccessModal;