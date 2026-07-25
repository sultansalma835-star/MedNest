
import { useState, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { User } from "./context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/smart.jpeg";
import Footer from "./components/Footer";
import "./signup.css";

export default function SignUp() {
const { setAuth } = useContext(User);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [passwordConfirmation, setPasswordConfirmation] = useState("");
const [address, setAddress] = useState("");
const [role, setRole] = useState("patient");

const [accept, setAccept] = useState(false);
const [emailError, setEmailError] = useState("");

const cookie = new Cookies();
const nav = useNavigate();

async function submit(e) {
e.preventDefault();

setAccept(true);
setEmailError("");

if (password.length < 8) {
  return;
}

if (password !== passwordConfirmation) {
  return;
}

try {
  const res = await axios.post(
    "http://127.0.0.1:8000/api/register",
    {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      address,
      role,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const token = res.data.token;
  const user = res.data.user;

  if (!token) {
    setEmailError("Token not found");
    return;
  }

  cookie.set("token", token, { path: "/" });
  cookie.set("role", role, { path: "/" });

  setAuth({
    token,
    user,
  });

  if (role === "patient") {
    nav("/patient");
  } else if (role === "doctor") {
    nav("/doctor");
  } else if (role === "pharmacist") {
    nav("/pharmacist");
  }
} catch (err) {
  console.log(err.response?.data);

  if (err.response?.data?.message) {
    setEmailError(err.response.data.message);
  } else {
    setEmailError("Registration failed");
  }
}

}

return (
<div className="signup-container">
<div className="image-sectionsignup">
<img src={logo} alt="logo" />
</div>

  <div className="forms">
    <h1>Create Account</h1>

    <form onSubmit={submit}>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
        <option value="pharmacist">Pharmacist</option>
      </select>

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {password.length < 8 && accept && (
        <p className="error">
          Password must be at least 8 characters
        </p>
      )}

      <input
        type="password"
        placeholder="confirm password"
        value={passwordConfirmation}
        onChange={(e) =>
          setPasswordConfirmation(e.target.value)
        }
      />

      {passwordConfirmation &&
        passwordConfirmation !== password &&
        accept && (
          <p className="error">
            Password does not match
          </p>
        )}

      {emailError && (
        <p className="error">{emailError}</p>
      )}

      <button type="submit">Register</button>

      <div>
        Already have account?
        <Link to="/"> Login</Link>
      </div>
    </form>
  </div>

  <Footer />
</div>

);
}