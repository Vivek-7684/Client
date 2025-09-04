import { X } from 'lucide-react';
import AccountSettingIcon from '../../../assets/Account_Setting_icon.png';
import defaultUserPic from "../../../assets/profileUser.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dashboard from '../../../assets/dashboard.png';
import { Link } from 'react-router-dom';

const account = (props) => {
    return (
        <div className='profile-overlay'>
            <div className='profile-view'>
                <X className="cross-button" onClick={() => { props.setShowProfile(false) }} />
                <div>
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>My Account</h3>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                        <img src={props.userProfile ? `data:image/png;base64,${props.userProfile}` : defaultUserPic} alt="Profile"
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
                                style={{ display: "flex", alignContent: "center", justifyContent: "center", padding: "0.2rem", gap: "1rem" }}>
                                <AccountCircleIcon sx={{ color: "black", fontSize: "35" }} />
                                <span className='profile-options' style={{ fontSize: "17" }}>
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