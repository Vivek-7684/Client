import { useState, useEffect } from "react";
import * as yup from "yup";
import defaultUserPic from "../../../assets/profileUser.png";
import EditPencil from "../../../assets/edit-pencil.png";
import saveData from "../../../assets/save-data.png";
import backtick from "../../../assets/back-left.png";
import validator from "validator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        email: "",
        country: "",
        state: "",
        city: "",
        profile_image: ""
    });

    const [originalUser, setOriginalUser] = useState({});
    const [editField, setEditField] = useState(null);
    const [error, setError] = useState({ name: "", message: "" });
    const [imagePreview, setImagePreview] = useState("");

    // ✅ For password
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // ✅ Username Validation Schema
    const usernameSchema = yup.object().shape({
        username: yup
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(15, "Name cannot exceed 15 characters")
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces allowed")
            .required("Name is required")
    });

    useEffect(() => {
        fetch("http://localhost:3001/profile/user-profile", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setOriginalUser(data);
                setImagePreview(data.profile_image || "");
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value.trimStart();

        if (name === "email") {
            updatedValue = updatedValue.replace(/\s+/g, "");
        }

        setUser((prev) => ({ ...prev, [name]: updatedValue }));

        // ✅ Username Validation
        if (name === "username") {
            usernameSchema
                .validate({ username: updatedValue })
                .then(() => setError({ name: "", message: "" }))
                .catch((err) => setError({ name: "username", message: err.message }));
        }

        // ✅ Email Validation
        if (name === "email") {
            if (!updatedValue) {
                setError({ name: "email", message: "Email is required" });
            } else if (!validator.isEmail(updatedValue)) {
                setError({ name: "email", message: "Invalid email format" });
            } else {
                setError({ name: "", message: "" });
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prev) => ({ ...prev, profile_image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Password Input Change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));

        // ✅ Real-time Validation
        if (name === "newPassword") {
            if (value.length < 6) {
                setPasswordError((prev) => ({ ...prev, newPassword: "Password must be at least 6 characters" }));
            } else {
                setPasswordError((prev) => ({ ...prev, newPassword: "" }));
            }
        }

        if (name === "confirmPassword") {
            if (value !== passwordData.newPassword) {
                setPasswordError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
            } else {
                setPasswordError((prev) => ({ ...prev, confirmPassword: "" }));
            }
        }
    };

    const isDataModified = (field) => {
        if (field === "username") return user.username !== originalUser.username;
        if (field === "email") return user.email !== originalUser.email;
        if (field === "country") return user.country !== originalUser.country;
        if (field === "state") return user.state !== originalUser.state;
        if (field === "city") return user.city !== originalUser.city;
        if (field === "image") return user.profile_image !== originalUser.profile_image;
        return false;
    };

    const saveChanges = async (field) => {
        if (!isDataModified(field)) {
            toast.info("No changes made");
            return;
        }

        if (error.name) {
            toast.error("Please fix the errors before saving");
            return;
        }

        let bodyData = {};
        if (["username", "email", "country", "state", "city"].includes(field)) {
            bodyData = { [field]: user[field] };
        }

        try {
            const res = await fetch("http://localhost:3001/profile/edit-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                toast.success("Profile Updated Successfully!");
                setEditField(null);
                setOriginalUser(user);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const saveImage = async () => {
        if (!isDataModified("image")) {
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
                setEditField(null);
                setOriginalUser(user);
            } else {
                toast.error("Failed to upload image");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const savePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        if (passwordError.newPassword || passwordError.confirmPassword) {
            toast.error("Please fix the errors first");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/profile/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(passwordData)
            });

            if (res.ok) {
                toast.success("Password updated successfully!");
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setEditField(null);
            } else {
                toast.error("Failed to update password");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="profile-form">
            <form className="profile-form-edit" onSubmit={(e) => e.preventDefault()}>
                <div  style={{ border: "none" }} onClick={() => navigate("/")}>
                    {/* <BsArrowLeft style={{ fontSize: "30px" }} /> */}
                    <img src={backtick} style={{ width: "13px", height: "13px" }} />
                    Back
                </div>
                <h3>Account Settings</h3>

                {/* Profile Image */}
                <fieldset>
                    <legend>Profile Image</legend>
                    <img
                        src={imagePreview || defaultUserPic}
                        alt="Profile Preview"
                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                    />
                    {editField === "image" && <input type="file" accept="image/*" onChange={handleImageChange} />}
                </fieldset>

                <div className="edit-option-icons">
                    <div>
                        <img src={EditPencil} onClick={() => setEditField("image")} style={{ width: "15px", height: "15px" }} />
                    </div>
                    <div>
                        {editField === "image" && isDataModified("image") && (
                            <img src={saveData} onClick={saveImage} style={{ width: "15px", height: "15px" }} />
                        )}
                    </div>
                </div>


                {/* Username */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>Name</legend>
                        {editField === "username" ? (
                            <input type="text" name="username" value={user.username} onChange={handleChange} />
                        ) : (
                            <p>{user.username || "N/A"}</p>
                        )}
                        {error.name === "username" && <p className="error">{error.message}</p>}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("username")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "username" && isDataModified("username") && (
                                <img src={saveData} onClick={() => saveChanges("username")} style={{ width: "15px", height: "15px" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>Email</legend>
                        {editField === "email" ? (
                            <input type="email" name="email" value={user.email} onChange={handleChange} />
                        ) : (
                            <p>{user.email || "N/A"}</p>
                        )}
                        {error.name === "email" && <p className="error">{error.message}</p>}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("email")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "email" && isDataModified("email") && (
                                <img src={saveData} onClick={() => saveChanges("email")} style={{ width: "15px", height: "15px" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Country */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>Country</legend>
                        {editField === "country" ? (
                            <input type="text" name="country" value={user.country} onChange={handleChange} />
                        ) : (
                            <p>{user.country || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("country")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "country" && isDataModified("country") && (
                                <img src={saveData} onClick={() => saveChanges("country")} style={{ width: "15px", height: "15px" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* State */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>State</legend>
                        {editField === "state" ? (
                            <input type="text" name="state" value={user.state} onChange={handleChange} />
                        ) : (
                            <p>{user.state || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("state")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "state" && isDataModified("state") && (
                                <img src={saveData} onClick={() => saveChanges("state")} style={{ width: "15px", height: "15px" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* City */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>City</legend>
                        {editField === "city" ? (
                            <input type="text" name="city" value={user.city} onChange={handleChange} />
                        ) : (
                            <p>{user.city || "N/A"}</p>
                        )}
                    </fieldset>
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("city")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "city" && isDataModified("city") && (
                                <img src={saveData} onClick={() => saveChanges("city")} style={{ width: "15px", height: "15px" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* ✅ Change Password */}
                <div className="profile-edit-input">
                    <fieldset>
                        <legend>Password</legend>
                        {editField === "password" ? (
                            <>
                                <fieldset>
                                    <legend>Old Password</legend>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>New Password</legend>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {passwordError.newPassword && <p className="error">{passwordError.newPassword}</p>}
                                </fieldset>

                                <fieldset>
                                    <legend>Confirm New Password</legend>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {passwordError.confirmPassword && <p className="error">{passwordError.confirmPassword}</p>}
                                </fieldset>
                            </>
                        ) : (
                            <p>********</p>
                        )}
                    </fieldset>

                    {/* Edit + Save Icons */}
                    <div className="edit-option-icons">
                        <div>
                            <img src={EditPencil} onClick={() => setEditField("password")} style={{ width: "15px", height: "15px" }} />
                        </div>
                        <div>
                            {editField === "password" &&
                                passwordData.oldPassword &&
                                passwordData.newPassword &&
                                passwordData.confirmPassword &&
                                !passwordError.newPassword &&
                                !passwordError.confirmPassword && (
                                    <img src={saveData} onClick={savePassword} style={{ width: "15px", height: "15px" }} />
                                )}
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Profile;
