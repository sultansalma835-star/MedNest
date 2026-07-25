import "./Profile.css";
import SideBar from "./components/SideBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import profileIcon from "./assets/Profile.png";
import nameIcon from "./assets/Name.png";
import shieldIcon from "./assets/Shield.png";
import securityIcon from "./assets/Security.png";
import logoutIcon from "./assets/Logout.png";
import calendarIcon from "./assets/Calendar.png";
import phoneIcon from "./assets/Phone.png";
import doorbellIcon from "./assets/Doorbell.png";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");

  const [reminders, setReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [tips, setTips] = useState(true);

  const role = user?.role || "patient";

  const roleLabel =
    role === "doctor"
      ? "Doctor"
      : role === "pharmacist"
      ? "Pharmacist"
      : "Patient";

  // ================= GET USER =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    fetch("http://127.0.0.1:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        const text = await res.text(); // مهم لتجنب JSON crash
        console.log("RAW RESPONSE:", text);

        const data = JSON.parse(text);

        setUser(data);

        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBirth(data.birth || "");

        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setLoading(false);
      });
  }, []);

  // ================= LOCAL SAVE =================
  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      birth,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated locally");
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading profile...</div>;
  }

  return (
    <div className="layout">
      <SideBar />

      <div className="profile-page">
        <h1>My Profile</h1>
        <p className="subtitle">
          Manage your account information and settings
        </p>

        <div className="profile-grid">

          {/* ================= LEFT CARD ================= */}
          <div className="card profile-card">
            <img src={profileIcon} alt="profile" className="avatar" />

            <h2>{user?.name}</h2>
            <p className="email">{user?.email}</p>

            <span className="role">{roleLabel}</span>

            <hr />

            <div className="info-list">
              <div className="info-item">
                <img src={phoneIcon} alt="" />
                <span>{user?.phone || "+963 xxx xxx xxx"}</span>
              </div>

              <div className="info-item">
                <img src={calendarIcon} alt="" />
                <span>
                  Joined{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>

              <div className="info-item">
                <img src={securityIcon} alt="" />
                <span>{roleLabel} Account</span>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE CARD ================= */}
          <div className="card">
            <div className="card-title">
              <img src={nameIcon} alt="" />
              <h3>Personal Information</h3>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Date Of Birth</label>
              <input value={birth} onChange={(e) => setBirth(e.target.value)} />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>

          {/* ================= RIGHT CARD ================= */}
          <div className="right-column">

            <div className="card small">
              <h3>
                <img src={shieldIcon} alt="" /> Account Security
              </h3>
              <p>Change password</p>
            </div>

            <div className="card small">
              <h3>
                <img src={doorbellIcon} alt="" /> Notifications
              </h3>

              <div className="toggle-row" onClick={() => setReminders(!reminders)}>
                <span>Reminders</span>
                <div className={`toggle ${reminders ? "active" : ""}`}></div>
              </div>

              <div className="toggle-row" onClick={() => setPromotions(!promotions)}>
                <span>Promotions</span>
                <div className={`toggle ${promotions ? "active" : ""}`}></div>
              </div>

              <div className="toggle-row" onClick={() => setTips(!tips)}>
                <span>Health Tips</span>
                <div className={`toggle ${tips ? "active" : ""}`}></div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= LOGOUT ================= */}
        <div className="logout" onClick={handleLogout}>
          <img src={logoutIcon} alt="" />
          <div>
            <h3>Log Out</h3>
            <p>Sign out from your account</p>
          </div>
        </div>

      </div>
    </div>
  );
}