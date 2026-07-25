
import { useContext, useEffect, useState } from "react";
import { User } from "./Context/UserContext";
import "./categoris.css";
import SideBar from "./Components/SideBar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Categories() {

  const { setCart, auth } = useContext(User);

  const [addedItem, setAddedItem] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const token = auth.token;
  const navigate = useNavigate();

 
  useEffect(() => {

    const fetchMedicines = async () => {

      if (!token) return;

      try {

        const url = search
          ? `http://127.0.0.1:8000/api/v1/medicines/search?query=${search}`
          : "http://127.0.0.1:8000/api/medicines";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setMedicines(res.data.data || []);

      } catch (err) {
        console.log(err);
        setMedicines([]);
      }
    };

    fetchMedicines();

  }, [search, token]);

  
  async function handleAddToCart(item) {

    setCart((prev) => {

      const exists = prev.find(
        (p) => p.medicine_id === item.id
      );

      if (exists) {
        return prev.map((p) =>
          p.medicine_id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          medicine_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image_url: item.image_url,
        },
      ];
    });

    setAddedItem((prev) => [...prev, item.id]);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/items",
        {
          medicine_id: item.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
     
    <Header
  setMedicines={setMedicines}
  token={token}
  search={search}
  setSearch={setSearch}
/>

      <SideBar />

      <div className="Contener">

        {medicines.length === 0 ? (
          <p>Loading medicines...</p>
        ) : (
          medicines.map((item) => (
            <div className="product" key={item.id}>
              <div className="info">

                <h2>{item.name}</h2>

                <img
                  src={item.image_url}
                  alt={item.name}
                  width="150"
                  height="150"
                />

                <p>
                  <strong>Uses:</strong> <br />
                  {item.description.split(",").map((use, i) => (
                    <span key={i}>
                      {use} <br />
                    </span>
                  ))}
                </p>

                <p>
                  <strong>Price:</strong> {item.price} S.P
                </p>

                {item.requires_prescription ? (
                  <button
                    onClick={() => navigate("/upload")}
                    style={{
                      backgroundColor: "#5271ee",
                      color: "white",
                    }}
                  >
                    Upload Prescription
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      backgroundColor: addedItem.includes(item.id)
                        ? "green"
                        : "",
                      color: "white",
                    }}
                  >
                    {addedItem.includes(item.id)
                      ? "Added"
                      : "Add to cart"}
                  </button>
                )}

              </div>
            </div>
          ))
        )}

      </div>

      <Footer />
    </>
  );
}