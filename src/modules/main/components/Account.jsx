import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const account = (props) => {
    console.log(props);
    return (
        <div className='profile-overlay'>
            <div className='profile-view'>
                <X className="cross-button" onClick={() => { props.setShowProfile(false) }} />
                <div>
                    <h3>My Account</h3>
                    <img src={`data:image/png;base64,${props.userProfile}`} alt="Profile" style={{ width: "fit-content", height: "70px" }} />
                    <ul>
                        {/* <li>{props</li> */}
                    </ul>
                    <div >
                        <Link to="/profile" onClick={() => { props.setShowProfile(false) }}><span className='profile-options'>Profile</span></Link>

                        {/* <Link ><span>Change Password</span></Link>
                        <Link >Profile Picture Upload</Link> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default account;