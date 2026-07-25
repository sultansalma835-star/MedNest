
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "./style.css";
export default function SideBar() {
  const cookie = new Cookies();
  const role = cookie.get("role");
  console.log(role);

  return (
    <div className="sidebar">

    
      {role === "patient" && (
        <>
          <Link to="/patient" className="item">
            <i className="fas fa-home icon"></i>
            <span>Home</span>
          </Link>

          <Link to="/categories" className="item">
            <i className="fas fa-capsules icon"></i>
            <span>categories</span>
          </Link>

          <Link to="/cart" className="item">
            <i className="fas fa-shopping-cart icon"></i>
            <span>Cart</span>
          </Link>

          <Link to="/upload" className="item">
            <i className="fas fa-file-medical icon"></i>
            <span>Prescription</span>
          </Link>

          <Link to="/notifaction" className="item">
            <i className="fas fa-bell icon"></i>
            <span>Alerts</span>
          </Link>

          <Link to="/recommendations" className="item">
  <i className="fa-solid fa-notes-medical icon"></i>
  <span>Med Tips</span>
</Link>

<Link to="/patientChat" className="item">
            <i className="fas fa-comments icon"></i>
            <span>Chat</span>
          </Link>

          <Link to="/profile" className="item">
            <i className="fa-solid fa-circle-user icon"></i>
            <span>Profile</span>
          </Link>
        </>
      )}

    
      {role === "doctor" && (
        <>
          <Link to="/doctor" className="item">
            <i className="fas fa-user-md icon"></i>
            <span>Home</span>
          </Link>

          <Link to="/doctor/prescriptions" className="item">
            <i className="fas fa-file-prescription icon"></i>
            <span>Prescriptions</span>
          </Link>

          <Link to="/doctor/chat" className="item">
            <i className="fas fa-comments icon"></i>
            <span>Chat</span>
          </Link>

          <Link to="/notifaction" className="item">
            <i className="fas fa-bell icon"></i>
            <span>Alerts</span>
          </Link>
        </>
      )}

    
      {role === "pharmacist" && (
        <>
          <Link to="/pharmacist" className="item">
            <i className="fas fa-clinic-medical icon"></i>
            <span>Home</span>
          </Link>

          <Link to="/inventory" className="item">
            <i className="fas fa-boxes icon"></i>
            <span>Inventory</span>
          </Link>

          <Link to="/orders" className="item">
            <i className="fas fa-clipboard-list icon"></i>
            <span>Orders</span>
          </Link>

          <Link to="/pharmacistChat" className="item">
            <i className="fas fa-comments icon"></i>
            <span>Chat</span>
          </Link>

          <Link to="/notifaction" className="item">
            <i className="fas fa-bell icon"></i>
            <span>Alerts</span>
          </Link>
          <Link to="/profile" className="item">
            <i className="fa-solid fa-circle-user icon"></i>
            <span>Profile</span>
          </Link>
        </>
      )}

    </div>
  );
}