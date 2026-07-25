
import SideBar from "./Components/SideBar";
import Footer from "./Components/Footer";
import { useContext, useEffect, useState } from "react";
import { User } from "./Context/UserContext";
import axios from "axios";
import "./Cart.css";
 import plus from "./assets/Plus.png";
 import minus from "./assets/Minus.png";
 import remove from "./assets/Remove.png";
 import { useNavigate } from "react-router-dom";
export default function Cart() {
  const { cart, setCart,auth} = useContext(User);

  const [medicines, setMedicines] = useState([]);
const [loading, setLoading] = useState(false);
  const token = auth.token;
 const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };


  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [cartRes, medRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/cart", { headers }),
          axios.get("http://127.0.0.1:8000/api/medicines", { headers }),
        ]);

        setCart(cartRes.data.data || []);
        setMedicines(medRes.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [token]);

 
  const findImage = (medicine_id) => {
    const med = medicines.find((m) => m.id === medicine_id);

    if (!med || !med.image) return "/no-image.png";

    return `http://127.0.0.1:8000/storage/${med.image}`;
  };


 const increase = async (medicine_id) => {
  setCart((prev) =>
    prev.map((item) =>
      item.medicine_id === medicine_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/cart/items",
      {
        medicine_id,
        quantity: 1,
      },
      { headers }
    );
  } catch (err) {
    console.log(err);
  }
};


  const decrease = (item_id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === item_id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

 
  const removeItem = async (item_id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart/items/${item_id}`,
        { headers }
      );

      setCart((prev) => prev.filter((item) => item.id !== item_id));
    } catch (err) {
      console.log(err);
    }
  };


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,0
  );
async function checkInteractions() {
  try {
    setLoading(true);

    const ids = cart.map((item) => item.medicine_id);

    const medicineNames = cart.map((item) =>
      item.name.split(" ")[0]
    );

    console.log("Medicine Names:", medicineNames);
    console.log("Medicine IDs:", ids);

    const res = await axios.post(
      "http://127.0.0.1:8000/api/safety-check",
      {
        medicine_ids: ids,
        medicines: medicineNames,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    console.log("API Response:", res.data);

    setLoading(false);

    if (res.data.status === "safe") {
      navigate("/safe");
    } else {
      navigate("/nosafe");
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Error checking interactions");
  }
}


  return (
    <div className="cart-page">
      <SideBar />

      <h1 className="title">Shopping Cart</h1>

      <div className="cart-box">
        {cart.length === 0 ? (
          <p className="empty">Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div className="item" key={item.id}>
              <div className="item-info">
                <div className="img">
                  <img
                    src={findImage(item.medicine_id)}
                    alt={item.name}
                  />
                </div>

                <div>
                  <h3>{item.name}</h3>
                  <p>Medicine</p>
                </div>
              </div>

              <div className="price">{item.price} S.P</div>

              <div className="qty">
                <button onClick={() => decrease(item.id)}>
                    <img src={minus} alt="" />
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => increase(item.medicine_id)}>
                   <img src={plus} alt="" />
                </button>
              </div>

              <button
                className="remove"
                onClick={() => removeItem(item.id)}
              >
                <img src={remove} alt="" />
              </button>
            </div>
          ))
        )}
      </div>

      <h2>Total: {total}</h2>
              <button className="checkk" onClick={checkInteractions}>
                 {loading ? "Checking..." : "Check Interactions"}
               </button>
      <Footer />
    </div>
  );
}
