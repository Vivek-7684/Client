import { useState, useEffect } from "react";
import * as yup from "yup";
import { BsArrowLeft } from "react-icons/bs";
import defaultUserPic from "../../../assets/profileUser.png";
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

    const usernameSchema = yup.object().shape({
        username: yup
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(15, "Name cannot exceed 15 characters")
            .test("IsAlpha", "Only alphabets and spaces allowed", (value) =>
                value ? [...value].every((c) =>
                    (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) ||
                    (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) ||
                    c === " "
                ) : false
            )
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

        if (name === "username") {
            usernameSchema
                .validate({ username: updatedValue })
                .then(() => setError({ name: "", message: "" }))
                .catch((err) => setError({ name: "username", message: err.message }));
        } else if (name === "email") {
            if (!updatedValue) {
                setError({ name: "email", message: "Email is required" });
            } else if (!updatedValue.includes("@") && !updatedValue.includes(".")) {
                setError({ name: "email", message: "@ and . missing" });
            } else if (!updatedValue.includes("@")) {
                setError({ name: "email", message: "@ missing" });
            } else if (!updatedValue.includes(".")) {
                setError({ name: "email", message: "(.) Dot missing" });
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
            reader.readAsDataURL(file); // Convert to Base64
        }
    };

    const isDataModified = (field) => {
        if (field === "username") return user.username !== originalUser.username;
        if (field === "email") return user.email !== originalUser.email;
        if (field === "location")
            return user.country !== originalUser.country ||
                user.state !== originalUser.state ||
                user.city !== originalUser.city;
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
        if (field === "username") bodyData = { username: user.username };
        if (field === "email") bodyData = { email: user.email };
        if (field === "location") bodyData = { country: user.country, state: user.state, city: user.city };

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

    return (
        <div className="profile-form">
            <form className="profile-form-edit" onSubmit={(e) => e.preventDefault()}>
                <div className="Back_Products" onClick={() => navigate("/")}>
                    <BsArrowLeft style={{ fontSize: "30px" }} />
                    <span>Back</span>
                </div>
                <h2>Account Settings</h2>

                {/* Profile Image */}
                <fieldset>
                    <legend>Profile Image</legend>
                    <div>
                        <img
                            src={imagePreview || defaultUserPic}
                            alt="Profile Preview"
                            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                        />
                        {editField === "image" && (
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        )}
                    </div>
                </fieldset>
                <div className="profile-action-buttons">
                    <button type="button" className="profile-edit-button" onClick={() => setEditField("image")}>
                        Edit
                    </button>
                    {editField === "image" && isDataModified("image") && (
                        <button type="button" className="profile-save-button" onClick={saveImage}>
                            Save
                        </button>
                    )}
                </div>

                {/* Username */}
                <fieldset>
                    <legend>Name</legend>
                    <div>
                        {editField === "username" ? (
                            <input type="text" name="username" value={user.username} onChange={handleChange} />
                        ) : (
                            <p>{user.username || "N/A"}</p>
                        )}
                    </div>
                    {error.name === "username" && <div className="errorMessage">{error.message}</div>}
                </fieldset>
                <div className="profile-action-buttons">
                    <button type="button" className="profile-edit-button" onClick={() => setEditField("username")}>
                        Edit
                    </button>
                    {editField === "username" && isDataModified("username") && (
                        <button type="button" className="profile-save-button" onClick={() => saveChanges("username")}>
                            Save
                        </button>
                    )}
                </div>

                {/* Email */}
                <fieldset>
                    <legend>Email</legend>
                    <div>
                        {editField === "email" ? (
                            <input type="email" name="email" value={user.email} onChange={handleChange} />
                        ) : (
                            <p>{user.email || "N/A"}</p>
                        )}
                    </div>
                    {error.name === "email" && <div className="errorMessage">{error.message}</div>}
                </fieldset>
                <div className="profile-action-buttons">
                    <button type="button" className="profile-edit-button" onClick={() => setEditField("email")}>
                        Edit
                    </button>
                    {editField === "email" && isDataModified("email") && (
                        <button type="button" className="profile-save-button" onClick={() => saveChanges("email")}>
                            Save
                        </button>
                    )}
                </div>

                {/* Location */}
                <fieldset>
                    <legend>Location</legend>
                    <div>
                        {editField === "location" ? (
                            <>
                                <input type="text" name="country" value={user.country} onChange={handleChange} placeholder="Country" />
                                <input type="text" name="state" value={user.state} onChange={handleChange} placeholder="State" />
                                <input type="text" name="city" value={user.city} onChange={handleChange} placeholder="City" />
                            </>
                        ) : (
                            <p>{user.country || "N/A"}, {user.state || "N/A"}, {user.city || "N/A"}</p>
                        )}
                    </div>
                </fieldset>
                <div className="profile-action-buttons">
                    <button type="button" className="profile-edit-button" onClick={() => setEditField("location")}>
                        Edit
                    </button>
                    {editField === "location" && isDataModified("location") && (
                        <button type="button" className="profile-save-button" onClick={() => saveChanges("location")}>
                            Save
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Profile;
