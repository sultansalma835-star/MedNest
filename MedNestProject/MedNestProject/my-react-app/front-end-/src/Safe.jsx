
import { useContext } from "react";
import { User } from "./Context/UserContext";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

import "./Safe.css";
import waitblue from "./assets/waitblue.png";
import checkpoint from "./assets/checkpoint.png";

import Footer from "./components/Footer";
import SideBar from "./Components/SideBar";

export default function Safe() {
  const { cart, setCart} = useContext(User);
  const navigate = useNavigate();

 async function handleOrder() {
  const cookie = new Cookies();
  const token = cookie.get("token");

  console.log("CART:", cart); 

  if (!cart || cart.length === 0) {
    alert("Cart is empty ");
    return;
  }

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/orders",
      {
        delivery_address: "Damascus - Kafarsousa",
        payment_method: "cash",
        items: cart.map((item) => ({
          medicine_id: item.id,
          quantity: item.qty || 1,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    console.log("ORDER SUCCESS:", res.data);

    alert("Order placed ");

    setCart([]);

    navigate("/my-orders");

  } catch (err) {
    console.log("ORDER ERROR:", err.response?.data || err);

    alert(err.response?.data?.message || "Order failed ");
  }
}

  return (
    <div className="safe-container">

      <SideBar />

      <div className="success-message">

       
        <h2>Analyzing your Order....</h2>

       
        <div className="waitblue">
          <img src={waitblue} alt="analyzing" />
        </div>

      
        <h4>Your Order is safe </h4>

  
        <div className="safety-tips">

          <div className="tip">
            <img src={checkpoint} alt="check" />
            <span>No allergies detected</span>
          </div>

          <div className="tip">
            <img src={checkpoint} alt="check" />
            <span>No drug interaction found</span>
          </div>

          <div className="tip">
            <img src={checkpoint} alt="check" />
            <span>Safe dosage confirmed</span>
          </div>

        </div>

        <div className="back-button">
          <button onClick={handleOrder}>
            Order Now<link></link>
          </button>
        </div>

        <Footer />

      </div>
    </div>
  );
}