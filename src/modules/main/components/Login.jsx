import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validator.isEmail(loginData.email)) {
            toast.error("Email must have @ with domain and .");
            return false;
        }
        else if (!validator.isStrongPassword(loginData.password)) {  // check letter only
            toast.error("Password must be minimum 8 characters with atleast one Capital and one small alphabet characters,one special characters and with number");
            return false;
        }

        fetch("http://localhost:3001/login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/card');
                } 
                return response.json();
            })
            .then(data => {
                if (data.message = "Wrong Crendentials") {
                    toast.error("Wrong email or password");
                }
            })
            .catch(error => toast.error(error));

    };

    return (
        <>
            <div className="form-section">
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-header">
                        <div><h2 style={{ textAlign: "center" }}>Login</h2></div>
                        <img src={require("../../../assets/login_profile_pic.png")} alt="Profile"
                            className="profile-pic" />
                    </div>
                    <div className="register-Input-Section">

                        <div className="register-input-data">
                            <label>Email</label>
                            <input
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Password</label>
                            <input name="password" value={loginData.password} onChange={handleChange}
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
            <ToastContainer />
        </>
    );
}

export default Login;
