import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/smart.jpeg"; 
import Footer from "./components/Footer";
import "./signup.css";
export default function SignUp() {
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
console.log(accept);
  async function submit(e) {
    e.preventDefault();
    setAccept(true);
    setEmailError("");

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

      console.log(res.data);

    
      const token = res.data.token;

      if (!token) {
        setEmailError("Server error: token not found");
        return;
      }

      cookie.set("token", token, { path: "/" });
      cookie.set("role", res.data.role || role, { path: "/" });
console.log(role);
      nav("/patient");

    } catch (err) {
      console.log(err.response?.data);
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

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
          </select>

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />  {password.length<8&&accept &&(<p className ="error">
              password must be more than 8 char
            </p>)

            }

          <input
            type="password"
            placeholder="confirm password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />  {passwordConfirmation!== password&&accept&&(
              <p className="error"> password dose not match</p>
            )}

          <button type="submit">Register</button>

          {emailError && <p className="error">{emailError}</p>}

          <div >
            Already have account? <Link to="/">Login</Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}