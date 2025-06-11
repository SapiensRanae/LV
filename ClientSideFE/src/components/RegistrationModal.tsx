import React from 'react';
import './RegistrationModal.css';
import {Link} from "react-router-dom";

interface Props {
    onClose: () => void;
    onRegisterSuccess: () => void;
    onLoginPress: () => void;
}

const RegistrationModal: React.FC<Props> = ({ onClose, onRegisterSuccess, onLoginPress }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // actually call API here
        // on success:
        onRegisterSuccess();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Create your nickname:
                        <input type="text" name="nickname" required />
                    </label>
                    <label>
                        Enter your email address:
                        <input type="text" name="email" placeholder="example@gmail.com" required />
                    </label>
                    <label>
                        Enter your phone number:
                        <input type="text" name="phone" placeholder="+XXX XX XXX XXXX" required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" required />
                    </label>
                    <label>
                        Password confirmation:
                        <input type="password" name="passwordConfirm" required />
                    </label>
                    <div className="checkboxes">
                        <label>
                            <input type="checkbox" required />I confirm that I am 21 years old and do not have a gambling addiction.
                        </label>
                        <label>
                            <input type="checkbox" required/><p>I consent to the processing of my personal data and I have read and agreed to the
                            <Link to="/terms" style={{color: "#F0CE77"}}> Terms & Conditions</Link> and <Link to="/privacy-policy" style={{color: "#F0CE77"}}>Privacy Policy</Link></p>
                        </label>
                    </div>
                    <button type="submit" className="btn-register">
                        Registration
                    </button>
                    <a className="modal-login" onClick={onLoginPress}>Already have an account?</a>
                </form>
                <button className="modal-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default RegistrationModal;
