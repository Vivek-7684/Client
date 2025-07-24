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
    .is().min(4)
    .is().max(12)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(2)
    .has().not().spaces(); // set rules

  // prevent white space with first input
  const setClearSpace = (e) => {
    if (e.target.value.trimStart() === '') {
      e.target.value = '';
      SetError({ name: "", message: "" });
    }
    // clear error with first input 
  }

  const handleChange = (e) => {
    if (e.target.name === "email") {
      if (e.target.value.indexOf('@') === -1 && e.target.value.indexOf('.') === -1) { SetError({ name: "email", message: "@ and .missing" }); }
      else if (e.target.value.indexOf('@') === -1) { SetError({ name: "email", message: "@ missing" }) }
      else if (e.target.value.indexOf('.') === -1) { SetError({ name: "email", message: "(.) Dot missing" }) }
      else { SetError({ name: "email", message: "" }) }

      setClearSpace(e);
    } else if (
      e.target.name === "password" &&
      !schema.validate(e.target.value)
    ) {
      SetError({
        name: "password",
        message: schema.validate(e.target.value, { details: true }),
      });

      setClearSpace(e);
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

    if(loginData.email.trim() === '') {
      toast.error("The email field cannot be left blank. Kindly provide a valid email address.");
      return false;
    }

    else if(loginData.password.trim() === '') {
      toast.error("Password field cannot be empty. Kindly enter your password.");
      return false
    }

    else if (!validator.isEmail(loginData.email)) {
      return false;
    } else if (!schema.validate(loginData.password)) {
      // check letter only
      return false;
    }

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
      credentials: "include" // include cookies in request
    })
      .then((response) => {
        if (response.status === 200) {
         
          navigate("/", { replace: true }); // redirect to home page and prevent go back to login page
        }

        return response.json();
      })
      .then((data) => {
        if (data.message !== "Welcome back! You’ve logged in Successfully.") {
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
          <div className="register-Input-Section">
            <div>
              <h2 style={{ textAlign: "center" }}>Login</h2>
            </div>
            <div className="register-input-data">
              <label>Email<span style={{ color: "red" }}>*</span></label>
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
              <label>Password<span style={{ color: "red" }}>*</span></label>
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
      {/* <ToastContainer position="bottom-right" theme="colored" /> */}
    </>
  );
}

export default Login;
