import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";

function Login() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });

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
                            <label>Password</label>
                            <input type="password" name="password" value={registerData.password} onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button type="submit" className="register-button">Login</button>
                        <span className="form-link">
                            No Account,Get Register? <Link to="/register">Sign Up</Link>
                        </span>
                    </div>
                </form>
            </div>
            {/* <ToastContainer /> */}
        </>
    );
}

export default Register;
