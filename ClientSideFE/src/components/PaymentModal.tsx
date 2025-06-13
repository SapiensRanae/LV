import React, {useState} from 'react';
import './PaymentModal.css';

interface Props {
    onClose: () => void;
    onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<Props> = ({onClose, onPaymentSuccess}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
            setError('Card number must be 16 digits');
            return;
        }
        if (!/^\d{2}$/.test(expMonth) || !/^\d{2}$/.test(expYear)) {
            setError('Expiration must be MM/YY');
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            setError('CVV must be 3 or 4 digits');
            return;
        }

        try {
            // to do: call your payment API here
            // await api.pay({ cardNumber, expMonth, expYear, cvv, receiptEmail: email });
            onPaymentSuccess();
        } catch (err: any) {
            setError(err.message || 'Payment failed');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content">
                <h2>Payment</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handlePay}>
                    <label>
                        Card number
                        <input
                            type="text"
                            maxLength={19}
                            placeholder="1111 2222 3333 4444"
                            value={cardNumber}
                            onChange={(e) =>
                                setCardNumber(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .replace(/(.{4})/g, '$1 ')
                                        .trim()
                                )
                            }
                            required
                        />
                    </label>
                    <div className="exp-cvv-row">
                        <div className="expiration">
                            <label>
                                Expiration date
                                <div className="exp-inputs">
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        maxLength={2}
                                        value={expMonth}
                                        onChange={(e) =>
                                            setExpMonth(e.target.value.replace(/\D/g, ''))
                                        }
                                        required
                                    />
                                    <span>/</span>
                                    <input
                                        type="text"
                                        placeholder="YY"
                                        maxLength={2}
                                        value={expYear}
                                        onChange={(e) =>
                                            setExpYear(e.target.value.replace(/\D/g, ''))
                                        }
                                        required
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="cvv">
                            <label>
                                CVV2/CVC2
                                <input
                                    type="text"
                                    placeholder="123"
                                    maxLength={4}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <label>
                        Email for receipt
                        <input
                            type="email"
                            placeholder="Optional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="btn-pay">
                        Pay
                    </button>
                </form>
                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default PaymentModal;