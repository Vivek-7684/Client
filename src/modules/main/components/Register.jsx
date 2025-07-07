import * as yup from "yup";
import { useState } from "react";
import passwordValidator from "password-validator";
import validator from "validator";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    // profile_image: null,
  });

  // show real time error with type
  const [error, SetError] = useState({
    name: "",
    message: "",
  });

  const passwordSchema = new passwordValidator(); // set schema for validation

  passwordSchema.is().min(4)
    .is().max(12)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(2)
    .has().not().spaces(); // set rules

  const usernameSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username at least 3 characters") // minimum 3 characters
      .max(10, "Username at most 10 characters"), // maximum 10 characters
  });

  const emailSchema = yup.object().shape({
    email: yup
      .string()
      //   .required("Email is required")
      .email("Email must have @ with domain and (.)"),
  });

  const handleChange = (e) => {
    // validation checks with input data type and store

    if (e.target.name === "username") {
      usernameSchema
        .validate({ username: e.target.value })
        .then(() => {
          SetError({ name: "", message: "" });
        }) // clear error
        .catch((err) => {
          SetError({ name: "username", message: err.message });
        });
    } else if (e.target.name === "email") {
      emailSchema
        .validate({ email: e.target.value })
        .then(() => SetError({ name: "", message: "" }))
        .catch((err) => SetError({ name: "email", message: err.message }));
    } else if (
      e.target.name === "password" &&
      !passwordSchema.validate(registerData.password)
    ) {
      SetError({
        name: "password",
        message: passwordSchema.validate(registerData.password, {
          details: true,
        }),
      });
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (registerData?.username) {
      usernameSchema
        .validate({ username: registerData.username })
        .catch((err) => {
          toast.error(err.message);
          return false;
        });
    }
    if (!registerData.email.trim()) {
      toast.error("email can't be empty");
      return false;
      // } else if (registerData.email) {
      //     emailSchema.validate({ email: registerData.email })
      //     .catch((err)=>{
      //         toast.error()
      //     })
    } else if (registerData.password === "") {
      toast.error("password can't be empty");
      return false;
    } else if (!validator.isEmail(registerData.email)) {
      toast.error("Email must have @ with domain and (.)");
      return false;
    } else if (
      e.target.name === "password" &&
      !passwordSchema.validate(registerData.password)
    ) {
      // check letter only
      toast.error("Enter Valid Password");
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
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        return response.json();
      })
      .then((data) => {
        console.log("A");
        if (data.message !== "Created") {
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
              <h2 style={{ textAlign: "center" }}>Register</h2>
            </div>

            <div className="register-input-data">
              <label>Username</label>
              <br></br>
              <input
                name="username"
                onChange={handleChange}
                placeholder="Enter username"
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

            {/* <div className="register-input-data">
                            <label>Profile Image</label>
                            <input type="file" name="profile_image" onChange={handleChange} />
                        </div> */}
            <button
              type="submit"
              className="register-button"
              onClick={handleSubmit}
            >
              Register
            </button>

            <hr />
            <span className="form-link">
              Already have an account? <Link to="/">Login here</Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default Register;
