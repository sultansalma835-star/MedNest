import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { User } from "./context/UserContext";
import "./pharmacistPrescription.css";
import SideBar from "./components/SideBar";

export default function PharmacistPrescriptions() {
  const { auth } = useContext(User);
  const token = auth?.token;

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/pharmacist/prescriptions",
        config
      );

      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPrescriptions();
    }
  }, [token]);

  const verifySignature = async (id) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/pharmacist/prescriptions/${id}/verify-signature`,
        config
      );

      alert(res.data.message);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Verification failed");
    }
  };

  const reviewPrescription = async (id, status) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/pharmacist/prescriptions/${id}/review`,
        {
          status,
          notes: "",
        },
        config
      );

      alert(res.data.message);

      fetchPrescriptions();
    } catch (err) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Failed to review prescription"
      );
    }
  };

  const dispensePrescription = async (id) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/pharmacist/prescriptions/${id}/dispense`,
        {},
        config
      );

      alert(res.data.message);

      fetchPrescriptions();
    } catch (err) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Failed to dispense prescription"
      );
    }
  };

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <>
    <SideBar/>
    <div className="container">
      <h1>Pharmacist Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <p className="empty">
          No prescriptions found
        </p>
      ) : (
        prescriptions.map((p) => (
          <div
            key={p.id}
            className="prescription-card"
          >
            <div className="header">
              <h3>Prescription #{p.id}</h3>

              <span
                className={`status ${p.status}`}
              >
                {p.status}
              </span>
            </div>

            <p>
              <strong>Doctor:</strong>{" "}
              {p.doctor?.name}
            </p>

            <p>
              <strong>Patient:</strong>{" "}
              {p.patient?.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                p.created_at
              ).toLocaleString()}
            </p>

            <div className="medicines">
              <h4>Medicines</h4>

              <ul>
                {p.medicines?.map((m) => (
                  <li key={m.id}>
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="buttons">
              <button
                className="verify-signature-btn"
                onClick={() =>
                  verifySignature(p.id)
                }
              >
                Verify Signature
              </button>

              {p.status === "pending" && (
                <>
                  <button
                    className="verify-btn"
                    onClick={() =>
                      reviewPrescription(
                        p.id,
                        "verified"
                      )
                    }
                  >
                    Verify
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      reviewPrescription(
                        p.id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </>
              )}

              {p.status === "verified" && (
                <button
                  className="dispense-btn"
                  onClick={() =>
                    dispensePrescription(
                      p.id
                    )
                  }
                >
                  Dispense
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}