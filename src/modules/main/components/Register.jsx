import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";

function Register() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        profile_image: null,
    });

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setRegisterData({
                ...registerData,
                [e.target.name]: e.target.files[0],
            });
        } else {
            setRegisterData({
                ...registerData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {

    };

    return (
        <>
            <div className="form-section">
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-header">
                        <div><h2 style={{ textAlign: "center" }}>Register</h2></div>
                        <img src={require("../../../assets/login_profile_pic.png")} alt="Profile"
                            className="profile-pic" />
                    </div>
                    <div className="register-Input-Section">
                        <div className="register-input-data">
                            <label>Username</label><br></br>
                            <input
                                type="text"
                                name="username"
                                value={registerData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Password  </label>
                            <input type="password" name="password" value={registerData.password} onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Profile Image</label>
                            <input type="file" name="profile_image" onChange={handleChange} />
                        </div>
                        <button type="submit" className="register-button">Register</button>

                        <span className="form-link">
                            Already have an account? <Link to="/login">Login here</Link>
                        </span>
                    </div>
                </form>
            </div>
            {/* <ToastContainer /> */}
        </>
    );
}

export default Register;
