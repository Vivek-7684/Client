import { useState } from "react";
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: ""
        // profile_image: null,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.isAlpha(registerData.username.split(' ').join(''))) {  // remove white space in username from both side 
            toast.error("Name must letter only");
            return false;
        }
        else if (!validator.isEmail(registerData.email)) {
            toast.error("Email must have @ with domain and .");
            return false;
        }
        else if (!validator.isStrongPassword(registerData.password)) {  // check letter only
            toast.error("Password must be minimum 8 characters with atleast one Capital and one small alphabet characters,one special characters and with number");
            return false;
        }

        fetch("http://localhost:3001/signup", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("User Successfully Registered");
                    setTimeout(()=>{navigate('/login')}, 2000);
                }
                return response.json();
            })
            .then(data => {
                if (data.message !== "Created") {
                    toast.error(data.message);
                }
            })
            .catch((error) => { console.log(error); toast.error(error) });

    };

    return (
        <>
            <div className="form-section">
                <form className="register-form" method="post">
                    <div className="form-header">
                        <div><h2 style={{ textAlign: "center" }}>Register</h2></div>
                        <img src={require("../../../assets/login_profile_pic.png")} alt="Profile"
                            className="profile-pic" />
                    </div>
                    <div className="register-Input-Section">
                        <div className="register-input-data">
                            <label>Username</label><br></br>
                            <span className="errorMessage"></span>
                            <input
                                name="username"
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Email</label>
                            <span className="errorMessage"></span>
                            <input
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="register-input-data">
                            <label>Password  </label>
                            <span className="errorMessage"></span>
                            <input name="password"
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        {/* <div className="register-input-data">
                            <label>Profile Image</label>
                            <input type="file" name="profile_image" onChange={handleChange} />
                        </div> */}
                        <button type="submit" className="register-button" onClick={handleSubmit}>Register</button>

                        <span className="form-link">
                            Already have an account? <Link to="/login">Login here</Link>
                        </span>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}

export default Register;
