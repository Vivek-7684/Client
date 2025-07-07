import * as yup from "yup";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import passwordValidator from "password-validator";
import { ToastContainer, toast } from "react-toastify";
function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, SetError] = useState({
    name: "",
    message: "",
  });

  const schema = new passwordValidator(); // set schema for validation

  schema
    .is()
    .min(4)
    .is()
    .max(12)
    .has()
    .uppercase(1)
    .has()
    .lowercase(1)
    .has()
    .digits(2)
    .has()
    .not()
    .spaces(); // set rules

  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Email must have @ with domain and ."),
  });

  const handleChange = (e) => {
    if (e.target.name === "email") {
      emailSchema
        .validate({ email: e.target.name })
        .then(() => SetError({ name: "", message: "" }))
        .catch((err) => SetError({ name: "email", message: err.message }));
    } else if (
      e.target.name === "password" &&
      !schema.validate(loginData.password)
    ) {
      SetError({
        name: "password",
        message: schema.validate(loginData.password, { details: true }),
      });
    } else {
      SetError("");
    }

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
    } else if (!validator.isStrongPassword(loginData.password)) {
      // check letter only
      toast.error(
        "Password must be minimum 8 characters with atleast one Capital and one small alphabet characters,one special characters and with number"
      );
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
          navigate("/home/card");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message !== "Logged In") {
            throw new Error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <div className="form-section">
        <form onSubmit={handleSubmit} className="register-form">
          {/* <div className="form-header">
                        
                        <img src={require("../../../assets/login_profile_pic.png")} alt="Profile"
                            className="profile-pic" />
                    </div> */}
          <div className="register-Input-Section">
            <div>
              <h2 style={{ textAlign: "center" }}>Login</h2>
            </div>
            <div className="register-input-data">
              <label>Email</label>
              <input
                name="email"
                onChange={handleChange}
                placeholder="Enter email"
              />
              {error.name === "email" && (
                <div className="errorMessage">{error.message}</div>
              )}
            </div>
            <div className="register-input-data">
              <label>Password</label>
              <input
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
              />
              {error.name === "password" && ( // error when type with password input
                <div className="errorMessage">
                  <ul className="error-List">
                    {error.message.map((msg) => (
                      <li key={msg.validation}>{msg.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button type="submit" className="register-button">
              Login
            </button>
            <hr />
            <span className="form-link">
              No Account, Get Register? <Link to="/signup">Sign Up</Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default Login;
