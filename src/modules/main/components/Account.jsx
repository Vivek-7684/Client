import { X } from 'lucide-react';
import AccountSettingIcon from '../../../assets/Account_Setting_icon.png';
import Dashboard from '../../../assets/dashboard.png';
import { Link } from 'react-router-dom';

const account = (props) => {
    console.log(props);
    return (
        <div className='profile-overlay'>
            <div className='profile-view'>
                <X className="cross-button" onClick={() => { props.setShowProfile(false) }} />
                <div>
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>My Account</h3>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <img src={`data:image/png;base64,${props.userProfile}`} alt="Profile"
                            style={{ width: "fit-content", height: "70px", borderRadius: "50%" }} />

                        <ul style={{ listStyle: "none" }}>
                            <li>{props.userData.username}</li>
                            <li>{props.userData.email}</li>
                        </ul>
                    </div>
                    <hr></hr>
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                        <div>
                            <Link to="/profile" onClick={() => { props.setShowProfile(false) }}
                                style={{ display: "flex", alignContent: "center", justifyContent: "center", padding: "0.3rem", gap: "5rem" }}>
                                <img src={AccountSettingIcon} style={{ height: "30px", borderRadius: "50%" }} />
                                <span className='profile-options'>
                                    Account Settings
                                </span>
                            </Link>
                        </div>
                    </div>


                    {props.userData.user_role === 'admin' && (<>
                        <hr></hr>
                        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                            <div>
                                <Link to="/dashboard" onClick={() => { props.setShowProfile(false) }}
                                    style={{ display: "flex", alignContent: "center", justifyContent: "center", padding: "0.3rem", gap: "7rem" }}>
                                    <img src={Dashboard} style={{ height: "30px", borderRadius: "50%" }} />
                                    <span className='profile-options'>
                                        Dashboard
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </>)}

                </div>
            </div>
        </div >

    )
}

export default account;