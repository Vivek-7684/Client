import React, { useState } from "react";

const UserProfilePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div>
      {/* Button to open popup */}
      <button 
        onClick={togglePopup} 
        style={buttonStyle}
      >
        View Profile
      </button>

      {/* Popup */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>User Profile</h2>
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              style={{ borderRadius: "50%", marginBottom: "10px" }}
            />
            <h3>John Doe</h3>
            <p>Email: johndoe@example.com</p>
            <p>Location: New York</p>
            <button onClick={togglePopup} style={closeButtonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Styles
const buttonStyle = {
  padding: "10px 20px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
};

const closeButtonStyle = {
  marginTop: "10px",
  padding: "8px 15px",
  background: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default UserProfilePopup;
