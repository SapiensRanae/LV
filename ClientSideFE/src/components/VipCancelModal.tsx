import React from 'react';
import './VipCancelModal.css';

interface VipCancelModalProps {
    onClose: () => void;
}

// VipCancelModal displays a message after VIP subscription cancellation
const VipCancelModal: React.FC<VipCancelModalProps> = ({ onClose }) => (
    <div className="vip-cancel-overlay" onClick={onClose}>
        <div className="vip-cancel-modal" onClick={e => e.stopPropagation()}>
            <button className="vip-cancel-close" onClick={onClose}>
                ×
            </button>
            <h2>Cancelation</h2>
            <p>
                You've canceled the VIP subscription. We hope to see you back soon!
            </p>
            <button className="vip-cancel-button" onClick={onClose}>
                Okay
            </button>
        </div>
    </div>
);

export default VipCancelModal;