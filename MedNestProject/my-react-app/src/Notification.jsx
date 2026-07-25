import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User } from "./context/UserContext";
import "./notification.css";
import SideBar from "./Components/SideBar";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { auth } = useContext(User);
  const token = auth?.token;


  const getNotifications = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = res.data.data || [];

    
      const seenMap = JSON.parse(localStorage.getItem("seen_notifications") || "{}");

      const enriched = data.map((n) => ({
        ...n,
        seen: seenMap[n.id] || false,
      }));

      setNotifications(enriched);

      const unread = enriched.filter((n) => !n.read_at).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const markOneAsRead = async (id) => {
    if (!token) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.log(err);
    }
  };


const markAllAsRead = async () => {
  if (!token) return;

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/notifications/read-all",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

   
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read_at: new Date().toISOString(),
      }))
    );

    setUnreadCount(0);

  
    setTimeout(() => {
      getNotifications();
    }, 300);

  } catch (err) {
    console.log(err);
  }
};


  useEffect(() => {
    getNotifications();
  }, [token]);

 
  return (
    <div className="notifications-app">
      <SideBar />

      <div className="notifications-main">
        <div className="notifications-header-row">
          <div className="header-left">
            <h1>
              Notifications{" "}
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </h1>
            <h4>Stay updated with your medical alerts</h4>
          </div>

          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>

        <div className="notifications-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="empty">No notifications</div>
          ) : (
            notifications.map((n) => {
              const isUnread = !n.read_at;

             
              const isNew = !n.seen;

              return (
                <div
                  key={n.id}
                  className={`notification-item ${
                    isUnread ? "unread" : ""
                  } ${isNew ? "new-notification" : ""}`}
                  onClick={() => {
                    markOneAsRead(n.id);

                  
                    const seenMap = JSON.parse(
                      localStorage.getItem("seen_notifications") || "{}"
                    );

                    seenMap[n.id] = true;

                    localStorage.setItem(
                      "seen_notifications",
                      JSON.stringify(seenMap)
                    );

                    setNotifications((prev) =>
                      prev.map((x) =>
                        x.id === n.id ? { ...x, seen: true } : x
                      )
                    );
                  }}
                >
                  <h2>
                    {n.data.title}
                    {isNew && <span className="new-badge">NEW</span>}
                  </h2>

                  <p>{n.data.message}</p>

                  <div className="date">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}