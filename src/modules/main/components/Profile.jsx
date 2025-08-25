import { useState, useEffect } from "react";
import * as yup from "yup";
import passwordValidator from "password-validator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import defaultUserPic from "../../../assets/profileUser.png";
import EditPencil from "../../../assets/edit-pencil.png";
import saveData from "../../../assets/save-data.png";
import backtick from "../../../assets/back-left.png";
import uploadImage from "../../../assets/upload_image.png";
import eye from "../../../assets/eye.png";
import eyeHide from "../../../assets/eyeHide.png";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({    // store userData
        username: "",
        email: "",
        country: "",
        state: "",
        city: "",
        profile_image: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [originalUser, setOriginalUser] = useState({});  // userData for compare edit changes done or not

    const [editField, setEditField] = useState(null); // set edit field name to open input 

    const [error, setError] = useState({ name: "", message: "" }); // real time error message

    const [profileImage, setProfileImage] = useState(""); // show profile image

    const [showOldPassword, setShowOldPassword] = useState(false); // toogle state for passwword hide/show 

    const [showNewPassword, setShowNewPassword] = useState(false); // toogle state for passwword hide/show 

    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toogle state for passwword hide/show 

    // Username Validation Schema
    const usernameSchema = yup.object().shape({
        username: yup
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(15, "Name cannot exceed 15 characters")
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces allowed")
            .required("Name is required")
    });

    // password Validation Schema
    const passwordSchema = new passwordValidator(); // set schema for validation

    passwordSchema
        .is().min(4, 'minimum 4 character required')
        .is().max(8, 'maximum 8 character password')
        .has().uppercase(1, 'atleast one uppercase')
        .has().lowercase(1, 'atleast one lowercase')
        .has().digits(2, 'atleast two digits')
        .has().not().spaces(); // set rules

    useEffect(() => {
        fetch("http://localhost:3001/profile/user-profile", { credentials: "include" })

            .then((res) => res.json())

            .then((data) => {                                                                     // set UserData
                setUser((prev) => ({
                    ...prev, // keep oldPassword, newPassword, confirmPassword
                    username: data.username || "",
                    email: data.email || "",
                    country: data.country || "",
                    state: data.state || "",
                    city: data.city || "",
                    profile_image: `data:image/png;base64,${data.image}` || ""
                }));

                setOriginalUser({                                                                 // set OriginalUserData
                    username: data.username || "",
                    email: data.email || "",
                    country: data.country || "",
                    state: data.state || "",
                    city: data.city || "",
                    profile_image: `data:image/png;base64,${data.image}` || ""
                });

                setProfileImage(data.image ? `data:image/png;base64,${data.image}` : "");                                      // set OriginalUserData

            })
            .catch(() => toast.error("It's not your issue.Server Side Error"));
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value.trimStart();   // remove leading space

        if (name === "email") {
            updatedValue = updatedValue.replace(/\s+/g, "");
        }

        setUser((prev) => ({ ...prev, [name]: updatedValue }));  // update specific value with type

        // Username Validation
        if (name === "username") {
            usernameSchema
                .validate({ username: updatedValue })
                .then(() => setError({ name: "", message: "" }))
                .catch((err) => setError({ name: "username", message: err.message }));
        }

        // Email Validation
        else if (name === "email") {
            if (e.target.value.indexOf('@') === -1 && e.target.value.indexOf('.') === -1) { setError({ name: "email", message: "@ and .missing" }); }
            else if (e.target.value.indexOf('@') === -1) { setError({ name: "email", message: "@ missing" }) }
            else if (e.target.value.indexOf('.') === -1) { setError({ name: "email", message: "(.) Dot missing" }) }
            else { setError({ name: "", message: "" }) }
        }
        // password validation

        else if (
            (name === "oldPassword" || name === "newPassword") &&
            !passwordSchema.validate(e.target.value)
        ) {
            if (updatedValue.length === 0) {
                // agar empty hai to error hatao
                setError({ name: "", message: "" });
            }
            else if (!passwordSchema.validate(updatedValue)) {
                // show error when invalid
                setError({
                    name,
                    message: passwordSchema.validate(updatedValue, { details: true }),
                });
            }
        }
        else if (name === "confirmPassword" && e.target.value !== user.newPassword) {

            if (user.newPassword === undefined || user.newPassword.trim() === "") setError({ name: "confirmPassword", message: "Please First Enter New Password" });

            else if (updatedValue !== user.newPassword) setError({ name: "confirmPassword", message: "Confirm Password Should match with New Password" });

        }
        else {
            // clear error when valid
            setError({ name: "", message: "" });
        }
    };

    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {

            const imageData = reader.result;

            setUser((prev) => ({ ...prev, profile_image: imageData }));

            setProfileImage(imageData);

            setEditField("image");
        };

        reader.readAsDataURL(file);

    };

    const isDataEdited = (field) => {     // track data changes

        switch (field) {
            case "username":
                return user.username !== originalUser.username;
            case "email":
                return user.email !== originalUser.email;
            case "country":
                return user.country !== originalUser.country;
            case "state":
                return user.state !== originalUser.state;
            case "city":
                return user.city !== originalUser.city;
            case "image":
                return profileImage !== originalUser.profile_image;
            case "updatedPassword":
                return user.oldPassword !== user.newPassword;

        }

    };

    const saveChanges = async (field) => {

        if (!isDataEdited(field)) {
            toast.info("No changes made");
            return;
        }

        if (error.name) {
            return;
        }

        let bodyData = {};

        bodyData = { [field]: user[field] };

        try {
            const res = await fetch("http://localhost:3001/profile/edit-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                toast.success(`${field} updated successfully!`);
                setEditField(null); // set edit off
                setOriginalUser(user); // set data for check changes done or not 
            } else {
                toast.error("Failed to update profile");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const saveImage = async () => {
        if (!isDataEdited("image")) {
            toast.info("No changes made");
            return;
        }
        try {
            const res = await fetch("http://localhost:3001/profile/upload-profile-image", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ profile_image: user.profile_image })
            });

            if (res.ok) {
                toast.success("Profile Image updated successfully!");
                setEditField(null);  // set edit off
                setOriginalUser(user); // updated data store in original state
                setProfileImage(user.profile_image);// set updated image
            } else {
                toast.error("Failed to upload image");
            }

        } catch (err) {
            toast.error("Something went wrong");
        }
    };
    
    const savePassword = () => {

        const passwordData = {
            oldPassword: user.oldPassword,
            newPassword: user.newPassword,
            confirmPassword: user.confirmPassword
        }

        fetch("http://localhost:3001/profile/update-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(passwordData)
        })
            .then(async (res) => {
                if (res.status === 200) {
                    toast.success("Password updated successfully!");
                    setUser(prev => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" }));  // clear password fields
                    setEditField(null);
                    return;
                }
                return await res.json();
            })
            .then((data) => {

                toast.error(data.message);
            })
            .catch((err) => { console.log(err.message) });



    };


    return (
        <div className="profile-form" style={{ position: "relative" }}>
            <span style={{ border: "none", cursor: "pointer", position: "relative", top: "150", left: "280" }} onClick={() => navigate("/")}>
                <img src={backtick} style={{ width: "15px", height: "15px" }} />
                <span style={{
                    paddingLeft: "15px", font: "900", color: "#111111",

                    fontFamily: "Arial, sans-serif", fontSize: "17px", marginBottom: "32px", fontWeight: "500"
                }}>Back</span>
            </span>
            <form className="profile-form-edit" onSubmit={(e) => e.preventDefault()}>


                <p style={{
                    font: "630 1.5rem / 1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111",
                    padding: "16px",
                    fontFamily: "Arial, sans-serif", fontSize: "24px",

                }}>Account Settings</p>

                <div style={{ font: "540 1.3rem / 1 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111", marginBottom: "1rem", marginTop: "1rem" }}>Bio</div>

                {/* Profile Image */}
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <img
                        src={profileImage ? profileImage : defaultUserPic}
                        alt="Profile Image"
                        style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.9rem" }}
                    />

                    <label htmlFor="fileImage">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={uploadImage} style={{ width: "30px", height: "30px", cursor: "pointer" }} />
                            <span>Upload</span>
                        </div>
                    </label>

                    <input
                        id="fileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />

                    <div>
                        {editField === "image" && isDataEdited("image") && (
                            <span onClick={saveImage} style={{ width: "12px", height: "12px", cursor: "pointer" }}>
                                <img src={saveData} style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                                {" "}<span>Save</span>
                            </span>

                        )}

                    </div>

                </div>

                {/* Username */}
                <div>
                    <div className="profile-edit-input">
                        <fieldset>
                            <legend style={{
                                font: "500", color: "grey", fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"
                            }}>Name</legend>

                            {editField === "username" ? (
                                <input type="text" name="username" value={user.username} onChange={handleChange} style={{ font: "500 1rem / 1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111" }} />

                            ) : (
                                <p style={{ font: "500 1rem / 1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111" }}>{user.username || "N/A"}</p>
                            )}

                        </fieldset>
                        <div className="edit-option-icons">
                            <div>
                                <img src={EditPencil} onClick={() => setEditField("username")} style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                                {" "}Edit
                            </div>
                            <div>
                                {editField === "username" && isDataEdited("username") && (
                                    <span>
                                        <img src={saveData} onClick={() => saveChanges("username")} style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                                        {" "}<span>Save</span>
                                    </span>

                                )}

                            </div>
                        </div>
                    </div>
                    <div style={{ display: "block", color: "red", fontSize: "0.7rem" }}>{error.name === "username" && <p className="error">{error.message}</p>}</div>
                </div>

                {/* Email */}
                <div>
                    <div className="profile-edit-input">
                        <fieldset>
                            <legend style={{
                                font: "500", color: "grey",
                                fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"

                            }}>Email</legend>
                            {editField === "email" ? (
                                <input type="email" name="email" value={user.email} onChange={handleChange} style={{ font: "500 1rem / 1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111" }} />
                            ) : (
                                <p style={{ font: "500 1rem / 1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111" }}>{user.email || "N/A"}</p>
                            )}

                        </fieldset>
                        <div className="edit-option-icons">
                            <div>
                                <img src={EditPencil} onClick={() => setEditField("email")} style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                                {" "}Edit
                            </div>
                            <div>
                                {editField === "email" && isDataEdited("email") && (
                                    <span>
                                        <img src={saveData} onClick={() => saveChanges("email")} style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                                        {" "}<span>Save</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "block", color: "red", fontSize: "0.7rem" }}>{error.name === "email" && <p className="error">{error.message}</p>}</div>
                </div>

                <div style={{ font: "540 1.3rem / 1 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111", marginBottom: "1rem", marginTop: "1rem" }}>Location</div>

                {/* Country */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend style={{
                            font: "500", color: "grey",

                            fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"

                        }}>Country</legend>
                        {editField === "country" ? (
                            <input type="text" name="country" value={user.country} onChange={handleChange} />
                        ) : (
                            <p>{user.country || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("country")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                            {" "}Edit
                        </div>
                        <div>
                            {editField === "country" && isDataEdited("country") && (
                                <span>
                                    <img src={saveData} onClick={() => saveChanges("country")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                                    {" "}<span>Save</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* State */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend style={{
                            font: "500", color: "grey",

                            fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"

                        }}>State</legend>
                        {editField === "state" ? (
                            <input type="text" name="state" value={user.state} onChange={handleChange} />
                        ) : (
                            <p>{user.state || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("state")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                            {" "}Edit
                        </div>
                        <div>
                            {editField === "state" && isDataEdited("state") && (
                                <span>
                                    <img src={saveData} onClick={() => saveChanges("state")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                                    {" "}<span>Save</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* City */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend style={{
                            font: "500", color: "grey",

                            fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"

                        }}>City</legend>
                        {editField === "city" ? (
                            <input type="text" name="city" value={user.city} onChange={handleChange} />
                        ) : (
                            <p>{user.city || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("city")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                            {" "}Edit
                        </div>
                        <div>
                            {editField === "city" && isDataEdited("city") && (
                                <span>
                                    <img src={saveData} onClick={() => saveChanges("city")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                                    {" "}<span>Save</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ font: "540 1.3rem / 1 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif", color: "#111111", marginBottom: "1rem", marginTop: "1rem" }}>Password</div>

                <div className="profile-edit-input" style={{ display: "flex", flexDirection: "column" }}>
                    {/* Old Password */}
                    <fieldset >
                        <legend
                            style={{
                                font: "500",
                                color: "grey",
                                fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"
                            }}
                        >
                            Old Password
                        </legend>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                value={user.oldPassword}
                                onChange={(e) => handleChange(e)}
                            />
                            <span
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                style={{
                                    position: "absolute",
                                    right: "-70px",
                                    top: "40%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                }}
                            >
                                {showOldPassword ?
                                    <img src={eyeHide} style={{ width: "20px", height: "20px" }} /> :
                                    <img src={eye} style={{ width: "20px", height: "20px" }} />}

                            </span>
                        </div>

                    </fieldset>

                    <div className="register-input-data">
                        {error.name === "oldPassword" && ( // error when type with password input
                            <div className="errorMessage">
                                <ul className="error-List">
                                    {error.message.map((msg) => (
                                        <li key={msg.validation}>{msg.message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* New Password */}

                    <fieldset >
                        <legend
                            style={{
                                font: "500",
                                color: "grey",
                                fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"
                            }}
                        >
                            New Password
                        </legend>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={user.newPassword}
                                onChange={(e) => handleChange(e)}
                            />
                            <span
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    position: "absolute",
                                    right: "-70px",
                                    top: "40%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                }}
                            >
                                {showNewPassword ?
                                    <img src={eyeHide} style={{ width: "20px", height: "20px" }} /> :
                                    <img src={eye} style={{ width: "20px", height: "20px" }} />}

                            </span>
                        </div>

                    </fieldset>

                    <div className="register-input-data">
                        {error.name === "newPassword" && ( // error when type with password input
                            <div className="errorMessage">
                                <ul className="error-List">
                                    {error.message.map((msg) => (
                                        <li key={msg.validation}>{msg.message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <fieldset >
                        <legend
                            style={{
                                font: "500",
                                color: "grey",
                                fontFamily: "Arial, sans-serif", fontSize: "12px", textIndent: "10px"
                            }}
                        >
                            Confirm Password
                        </legend>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={(e) => handleChange(e)}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "-70px",
                                    top: "40%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                }}
                            >
                                {showConfirmPassword ?
                                    <img src={eyeHide} style={{ width: "20px", height: "20px" }} /> :
                                    <img src={eye} style={{ width: "20px", height: "20px" }} />}

                            </span>
                        </div>

                    </fieldset>

                    <div className="register-input-data">
                        {error.name === "confirmPassword" && ( // error when type with password input
                            <div className="errorMessage">
                                <ul className="error-List">
                                    {error.message}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Edit + Save Icons */}
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("newPassword")} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                            {" "}Edit
                        </div>
                        <div>
                            {isDataEdited('updatedPassword') &&
                                user.oldPassword &&
                                user.newPassword &&
                                user.confirmPassword &&
                                (
                                    <span>
                                        <img src={saveData} onClick={(e) => savePassword(e)} style={{ width: "15px", height: "15px", cursor: "pointer" }} />
                                        {" "}<span>Save</span>
                                    </span>
                                )}
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Profile;
