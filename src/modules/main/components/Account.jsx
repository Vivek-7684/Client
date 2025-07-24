import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const account = (props) => {
    return (
        <div className='profile-overlay'>
            <div className='profile-view'>
                <X className="cross-button" onClick={() => { props.setShowProfile(false) }} />
                <div>
                    <h3>My Account</h3>
                    <hr></hr>
                    <div >
                        <Link to="/profile" onClick={() => { props.setShowProfile(false) }}><span className='profile-options'>Profile</span></Link>
                        <hr></hr>
                        {/* <Link ><span>Change Password</span></Link>
                        <Link >Profile Picture Upload</Link> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default account;