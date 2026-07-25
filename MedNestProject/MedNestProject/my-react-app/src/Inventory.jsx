
import { useEffect, useState, useContext } from "react";
import "./inventory.css";
import SideBar from "./components/SideBar";
import { User } from "./Context/UserContext";

export default function Inventory() {
  const { auth } = useContext(User);

  const [total, setTotal] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [expiring, setExpiring] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");

  const token = auth?.token;

  useEffect(() => {
    if (!token) return;

    async function fetchInventory() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/pharmacist/inventory",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setError("Server Error");
          return;
        }

        const data = await res.json();

        setTotal(data.total_items || 0);
        setLowStock(data.low_stock_count || 0);
        setExpiring(data.expiring_soon_count || 0);
        setMedicines(data.data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load inventory");
      }
    }

    fetchInventory();
  }, [token]);

  return (
    <>
      <SideBar />

      <div className="inventory-container">
        <div className="header">
          <h1>Inventory Management</h1>
          <h4>Track stock levels and expiry dates</h4>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="stats">

          <div className="stat-box">
            <div className="stat-left">
              <div className="stat-icon">
                <i className="fa-solid fa-chart-column"></i>
              </div>

              <div className="stat-info">
                <div className="stat-label">Total Medicines</div>
                <div className="stat-desc">All medicines in stock</div>
              </div>
            </div>

            <div className="stat-number">
              <span className="num-badge">{total}</span>
            </div>
          </div>

          <div className="stat-box low">
            <div className="stat-left">
              <div className="stat-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>

              <div className="stat-info">
                <div className="stat-label">Low Stock</div>
                <div className="stat-desc">Below Minimum level</div>
              </div>
            </div>

            <div className="stat-number">
              <span className="num-badge">{lowStock}</span>
            </div>
          </div>

          <div className="stat-box expiring">
            <div className="stat-left">
              <div className="stat-icon">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>

              <div className="stat-info">
                <div className="stat-label">Expiring Soon</div>
                <div className="stat-desc">within 30 days</div>
              </div>
            </div>

            <div className="stat-number">
              <span className="num-badge">{expiring}</span>
            </div>
          </div>

        </div>

        <table className="med-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {medicines.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            ) : (
              medicines.map((med) => {
                let statusText = "In Stock";
                let statusClass = "ok";

                if (med.quantity === 0) {
                  statusText = "Out of Stock";
                  statusClass = "out";
                } else if (med.is_low_stock) {
                  statusText = "Low Stock";
                  statusClass = "low";
                } else if (med.is_expiring_soon) {
                  statusText = "Expiring";
                  statusClass = "exp";
                }

                return (
                  <tr key={med.id}>
                    <td>{med.medicine_name}</td>
                    <td>{med.category}</td>
                    <td>{med.quantity}</td>
                    <td>{med.expiration_date}</td>

                    <td>
                      <span className={`status ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>

                    <td className="action-button">
                      <button className="btnEdit">
                        <i className="fa-solid fa-pencil"></i>
                      </button>

                      <button className="btnDelete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}