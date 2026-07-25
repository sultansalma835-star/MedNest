import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./pharmacistHome.css";
import SideBar from "./Components/SideBar";

export default function PharmacistHome() {
  const cookie = new Cookies();
  const token = cookie.get("token");

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

   
    axios.get("http://127.0.0.1:8000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setOrders(res.data.data || []))
    .catch(err => console.log(err));

    
    axios.get("http://127.0.0.1:8000/api/pharmacist/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setInventory(res.data.data || []))
    .catch(err => console.log(err));

   
    axios.get("http://127.0.0.1:8000/api/notifications/unread", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setNotifications(res.data.data || []))
    .catch(err => console.log(err));

  }, [token]);

  const lowStock = inventory.filter(item => item.quantity < 10);
  const pendingOrders = orders.filter(o => o.status === "pending");

  return (
    <div className="pharmacist-page">
      <SideBar/>

      <h1> Pharmacist Dashboard</h1>

      {/* CARDS */}
      <div className="cards">

        <div className="card">
          <h3> Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card">
          <h3> Pending</h3>
          <p>{pendingOrders.length}</p>
        </div>

        <div className="card">
          <h3> Inventory</h3>
          <p>{inventory.length}</p>
        </div>

        <div className="card danger">
          <h3> Low Stock</h3>
          <p>{lowStock.length}</p>
        </div>

        <div className="card">
          <h3> Notifications</h3>
          <p>{notifications.length}</p>
        </div>

      </div>

      {/* ORDERS LIST */}
      <div className="section">
        <h2> Latest Orders</h2>

        {orders.slice(0, 5).map((order, i) => (
          <div key={i} className="order-item">
            <p>Order #{order.id}</p>
            <span>{order.status}</span>
          </div>
        ))}
      </div>

    </div>
  );
}