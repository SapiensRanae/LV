import React from 'react';
import './Profile.css';
import profileIco from "../assets/profile.png";

const Profile: React.FC = () => {
    return (
        <div className="profile-bg">
            <section className="profile">
                <section className="profile-left">
                    <img src={profileIco} alt={"Profile icon"}></img>
                    <section className="NicknameBalance">
                        <section className="Nickname"></section>
                        <section className="Balance"></section>
                    </section>
                    <section className="Description">
                    </section>
                    <section className="Btns-left">
                        <section className="ChangeBtn">
                            <button>Change</button>
                        </section>
                        <section className="BuyVIPBtn">
                            <button>Buy VIP</button>
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

                        </section>
                        <section className="DeleteBtn">

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