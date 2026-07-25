import "./AddMedicine.css";
import SideBar from "./components/SideBar";
import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import {User} from "./Context/UserContext";

export default function AddMedicine() {
const {auth}=useContext(User)
  const token = auth?.token;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    active_ingredient: "",
    requires_prescription: false,
    batch_number: "",
    expiration_date: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/medicines",
        {
          ...form,
          price: Number(form.price), // مهم للباك
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("RESPONSE:", res.data);

      alert("Medicine added successfully ");

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        manufacturer: "",
        active_ingredient: "",
        requires_prescription: false,
        batch_number: "",
        expiration_date: "",
      });

    } catch (err) {
      console.log(err.response?.data || err);
      alert("Error adding medicine");
    }
  };

  return (
    <div className="layout">
      <SideBar />

      <div className="add-medicine-container">
        <div className="add-header">
          <h1>Add Medicine</h1>
          <h4>Create new medicine for inventory system</h4>
        </div>

        <div className="form-card">
          <div className="form-grid">

            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                name="price"
                value={form.price || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                value={form.category || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Manufacturer</label>
              <input
                name="manufacturer"
                value={form.manufacturer || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Active Ingredient</label>
              <input
                name="active_ingredient"
                value={form.active_ingredient || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Batch Number</label>
              <input
                name="batch_number"
                value={form.batch_number || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Expiration Date</label>
              <input
                type="date"
                name="expiration_date"
                value={form.expiration_date || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
  <label>Requires Prescription</label>

  <div className="prescription-toggle-inline">
    <input
      type="checkbox"
      name="requires_prescription"
      checked={form.requires_prescription}
      onChange={handleChange}
    />
  </div>
</div>
<div className="form-group full">
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                value={form.description || ""}
                onChange={handleChange}
              />
            </div>

           

          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Add Medicine
          </button>
        </div>
      </div>
    </div>
  );
}