import * as yup from "yup";
import { useState } from "react";
import passwordValidator from "password-validator";
import validator from "validator";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // show real time error with type
  const [error, SetError] = useState({
    name: "",
    message: "",
  });

  const successMessage = "Welcome! Your account has been created successfully. Start exploring amazing products now!";

  const passwordSchema = new passwordValidator(); // set schema for validation

  passwordSchema
    .is().min(4, 'minimum 4 character required')
    .is().max(8, 'maximum 8 character password')
    .has().uppercase(1, 'atleast one uppercase')
    .has().lowercase(1, 'atleast one lowercase')
    .has().digits(2, 'atleast two digits')
    .has().not().spaces(); // set rules

  const usernameSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Name at least 3 characters") // minimum 3 characters
      .max(15, "Name at most 15 characters") // maximum 15 characters
      .test(
        'IsAlpha',
        'Alphabet allowed Only',
        (value) =>
          value
            ? [...value].every(
              (c) =>
                (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || // for capital letter
                (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) || // for small letter
                c === ' ' // allow space
            )
            : false
      )
      .required()
  });


  // prevent white space with first input
  const setClearSpace = (e) => {
    if (e.target.value.trimStart() === '') {
      e.target.value = '';
    }
  }

  const handleChange = (e) => {
    // validation checks with input data type and store
    setClearSpace(e);
    // clear error when backspace input 
    // if (e.target.value.trim() === '') {
    //   SetError({ name: "", message: "" });
    // } else {

    if (e.target.name === "username") {
      usernameSchema
        .validate({ username: e.target.value })
        .then(() => {
          SetError({ name: "", message: "" });
        }) // clear error
        .catch((err) => {
          SetError({ name: "username", message: err.message });
        });

      // setClearSpace(e);
    } else if (e.target.name === "email") {

      if (e.target.value.indexOf('@') === -1 && e.target.value.indexOf('.') === -1) { SetError({ name: "email", message: "@ and .missing" }); }

      else if (e.target.value.indexOf('@') === -1) { SetError({ name: "email", message: "@ missing" }) }

      else if (e.target.value.indexOf('.') === -1) { SetError({ name: "email", message: "(.) Dot missing" }) }

      else if (e.target.value.includes(" ")) { SetError({ name: "email", message: "Email should not contain spaces" }); }

      else { SetError({ name: "email", message: "" }) }

      // setClearSpace(e);
    } 
    
    else if (
      e.target.name === "password" &&
      !passwordSchema.validate(e.target.value)
    ) {
      SetError({
        name: "password",
        message: passwordSchema.validate(e.target.value, {
          details: true,
        }),
      });

      // setClearSpace(e);
    } else {
      SetError("");
    }

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
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (error.name) {
      return false;
    }

    if (registerData?.username) {
      usernameSchema
        .validate({ username: registerData.username })
        .catch(() => {
          return false;
        });
    }
    // if (registerData.username === "") {
    //   toast.error("Please enter your name to continue.");
    //   return false;
    // }
    if (!registerData.email.trim()) {
      toast.error("The email field cannot be left blank. Kindly provide a valid email address.");
      return false;
    } else if (registerData.password === "") {
      toast.error("Password field cannot be empty. Kindly enter your password.");
      return false;
    } else if (!validator.isEmail(registerData.email)) {
      return false;
    } else if (
      e.target.name === "password" &&
      !passwordSchema.validate(registerData.password)
    ) {
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
          toast.success(successMessage);
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message !== successMessage) {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="form-section">
        <form className="register-form" method="post">
          <div className="register-Input-Section">
            <div>
              <h2 style={{ textAlign: "center" }}>Create Account</h2>
            </div>

            <div className="register-input-data">
              <label>
                Name<span style={{ color: "red" }}>*</span></label>
              <br></br>
              <input
                name="username"
                onChange={handleChange}
                placeholder="Enter Name"
              />
              {error.name === "username" && (
                <div className="errorMessage">{error.message}</div>
              )}
            </div>

            <div className="register-input-data">
              <label>
                Email<span style={{ color: "red" }}>*</span>
              </label>
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
              <label>Password </label>
              <span style={{ color: "red" }}>*</span>
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

            <button
              type="submit"
              className="register-button"
              onClick={handleSubmit}
            >
              Register
            </button>

            <hr />
            <span className="form-link">
              Already have an account? <Link to="/login">Login here</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;