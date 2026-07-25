import { useEffect, useState } from "react";
import axios from "axios";
import "./Recommendations.css";
import SideBar from "./components/SideBar";
import Cookies from "universal-cookie";

export default function Recommendations() {

  const [recommendations, setRecommendations] = useState([]);
  const [usage, setUsage] = useState([]);
  const [dosage, setDosage] = useState([]);

  const cookie = new Cookies();
const token = cookie.get("token");

  useEffect(() => {
    fetchAll();
  }, []);

  

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const fetchAll = async () => {
    try {

      const res1 = await axios.get(
        "http://127.0.0.1:8000/api/recommendations",
        config
      );

      const res2 = await axios.get(
        "http://127.0.0.1:8000/api/recommendations/usage",
        config
      );

      const res3 = await axios.get(
        "http://127.0.0.1:8000/api/recommendations/dosage",
        config
      );

      setRecommendations(res1.data);
      setUsage(res2.data);
      setDosage(res3.data);

    } catch (error) {
      console.log("Error loading recommendations:", error);

      if (error.response?.status === 401) {
        console.log("Unauthenticated");
      }
    }
  };

  const markAsRead = async (id) => {
    try {

      await axios.post(
        `http://127.0.0.1:8000/api/recommendations/${id}/read`,
        {},
        config
      );

    } catch (error) {
        console.log(res1.data);
    }
  };

  return (
    <div className="recommendations-page">

      <SideBar />

      <div className="recommendations-header">
        <h1>Medication Recommendations</h1>
        <p>Personalized medical guidance for patients</p>
      </div>

      <div className="recommendations-container">

        {/* General */}
        <div className="recommendation-section">
          <h2>General Recommendations</h2>

          {recommendations.length > 0 ? (
            recommendations.map((item) => (
              <div
                key={item.id}
                className="recommendation-card"
                onClick={() => markAsRead(item.id)}
              >
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <p className="empty">No recommendations</p>
          )}
        </div>

        {/* Usage */}
        <div className="recommendation-section">
          <h2>Usage Instructions</h2>

          {usage.length > 0 ? (
            usage.map((item) => (
              <div key={item.id} className="recommendation-card usage-card">
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <p className="empty">No usage instructions</p>
          )}
        </div>

        {/* Dosage */}
        <div className="recommendation-section">
          <h2>Dosage Reminders</h2>

          {dosage.length > 0 ? (
            dosage.map((item) => (
              <div key={item.id} className="recommendation-card dosage-card">
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <p className="empty">No dosage reminders</p>
          )}
        </div>

      </div>
    </div>
  );
}