import React from 'react';
import './Profile.css';
import profileIco from "../assets/profile.png";
import coin from "../assets/coin.png"

const Profile: React.FC = () => {
    return (
        <div className="profile-bg">
            <section className="profile">
                <section className="profile-left">
                    <img src={profileIco} alt={"Profile icon"} className="Profile-icon"></img>
                    <section className="NicknameBalance">
                        <section className="Nickname">TestDummy</section>
                        <section className="Balance">
                            <span>NaN</span>
                            <img src={coin} alt="Balance icon" className="balance-icon" />
                        </section>
                    </section>
                    <section className="Description">This is a basic test dummy for a placeholder profile!
                    </section>
                    <section className="Btns-left">
                        <section className="ChangeBtn">
                            <button className="btn change-btn">Change</button>
                        </section>
                        <section className="BuyVIPBtn">
                            <button className="btn vip-btn">Buy VIP</button>
                        </section>
                    </section>

                </section>
                <section className="divider"></section>
                <section className="profile-right">
                    <h2>Game History</h2>
                    <section className="Table">
                    </section>
                    <section className="Btns-right">
                        <section className="LogoutBtn">
                            <button className="btn red-btn">Logout</button>
                        </section>
                        <section className="DeleteBtn">
                            <button className="btn red-btn">Delete</button>
                        </section>
                    </section>

                    <section className="ContactInfo">
                        <section className="Email">

                        </section>
                        <section className="Phone">

                        </section>
                    </section>
                </section>
            </section>
        </div>
    );
};

export default Profile;