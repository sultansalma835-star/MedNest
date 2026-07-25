import "./Profile.css";
import SideBar from "./components/SideBar";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import profileIcon from "./assets/Profile.png";
import securityIcon from "./assets/Security.png";
import logoutIcon from "./assets/Logout.png";
import calendarIcon from "./assets/Calendar.png";
import phoneIcon from "./assets/Phone.png";
import axios from "axios";

export default function Profile() {
  // const navigate = useNavigate();
  const cookies = new Cookies();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const role = user?.role  ||"patient";

  const roleLabel =
    role === "doctor"
      ? "Doctor"
      : role === "pharmacist"
      ? "Pharmacist"
      : "Patient";

  useEffect(() => {
    const token = cookies.get("token");

    fetch("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const token = cookies.get("token");

    await fetch("http://127.0.0.1:8000/api/user/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, address, phone }),
    });
  };

  const handlePasswordChange = async () => {
    const token = cookies.get("token");

    await fetch("http://127.0.0.1:8000/api/user/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });
  };

  const handleLogout =async () => {
  const token = cookies.get("token");

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/logout-all",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    cookies.remove("token");
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
  }
  if (loading) return <div>Loading...</div>;

  return (
    <div className="layout">
      <SideBar />

      <div className="profile-page">

        <h1>My Profile</h1>

        <div className="profile-grid">

          {/* ================= CARD 1 ================= */}
       {/* ================= CARD 1 ================= */}
<div className="card profile-card">

<img src={profileIcon} className="avatar" />

<h2>{user?.name}</h2>
<p>{user?.email}</p>

<span className="role">{roleLabel}</span>

{/* INFO LIST UPDATED */}
<div className="info-list">

  <div className="info-row">
    <img src={phoneIcon} className="info-icon" />
    <span>{phone}</span>
  </div>

  <div className="info-row">
    <img src={calendarIcon} className="info-icon" />
    <span>
      {user?.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "Unknown"}
    </span>
  </div>

  <div className="info-row">
    <img src={securityIcon} className="info-icon" />
    <span>{roleLabel} Account</span>
  </div>

</div>

</div>

          {/* ================= CARD 2 ================= */}
          <div className="card">
            <h3>Edit Info</h3>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <button onClick={handleSave} className="action-btn">
              Save Info
            </button>
          </div>

          {/* ================= CARD 3 ================= */}
          <div className="card">
            <h3>Change Password</h3>

            <input type="password" placeholder="Current Password" onChange={(e) => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />

            <button onClick={handlePasswordChange} className="action-btn">
              Update Password
            </button>
          </div>

        </div>

        {/* ================= LOGOUT CENTER ================= */}
        <div className="logout" onClick={handleLogout}>
        <div className="logout-inner">
        <img src={logoutIcon} alt="" />
        <div><h3>Log Out</h3>
      <p>Sign out from your account</p>
      </div>
        
        </div>
        </div>

      </div>
    </div>
  );
}