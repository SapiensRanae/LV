import React, {useState} from 'react';
import './PaymentModal.css';

interface Props {
    package: { price: string; coins: string }
    onClose: () => void;
    onPaymentSuccess: () => void;
}

function luhnCheck(cardNumber: string): boolean {
    // 1) strip non-digits, split into array of numbers
    const digits = cardNumber.replace(/\D/g, '').split('').map(d => parseInt(d, 10));
    // 2) from the rightmost, double every second digit
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = digits[i];
        if (shouldDouble) {
            d *= 2;
            if (d > 9) d -= 9;        // subtract 9 = sum of digits for any 10+ result
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }
    // 3) valid if sum % 10 === 0
    return sum % 10 === 0;
}

export const PaymentModal: React.FC<Props> = ({package: pkg, onClose, onPaymentSuccess}) => {
    const [cardNumber, setCardNumber] = useState('');
    const rawNumber = cardNumber.replace(/\s+/g, '');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try{
            if (!luhnCheck(rawNumber)) {
                setError('Card number is invalid');
                return;
            }
            if (!/^\d{2}$/.test(expMonth) || !/^\d{2}$/.test(expYear)) {
                setError('Expiration must be MM/YY');
                return;
            }
            const monthNum = parseInt(expMonth, 10);
            const yearNum  = 2000 + parseInt(expYear, 10);

            const now       = new Date();
            const thisYear  = now.getFullYear();
            const thisMonth = now.getMonth() + 1;

            if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                setError('Expiration month must be between 01 and 12');
                return;
            }
            if (yearNum < thisYear || (yearNum === thisYear && monthNum < thisMonth)) {
                setError('Your card has expired');
                return;
            }

            if (!/^\d{3,4}$/.test(cvv)) {
                setError('CVV must be 3 or 4 digits');
                return;
            }

            await onPaymentSuccess()

} catch (err: any) {
    setError('Payment failed, please try again.' + '\n' + (err?.message || err));
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Payment</h2>
                <h2>Purchase {pkg.coins} coins for {pkg.price}</h2>
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
                        Pay {pkg.price}
                    </button>
                </form>
                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default PaymentModal;