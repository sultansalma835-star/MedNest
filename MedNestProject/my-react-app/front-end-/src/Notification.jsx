import { useState, useEffect, useContext } from "react";
import Sidebar from "./Components/SideBar";
import { User } from "./context/UserContext";
import Cookies from "universal-cookie";
import "./notification.css";

const cookie = new Cookies();

export default function NotificationsPage() {
  // =====================
  // STATES (مهم جداً)
  // =====================
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { token: contextToken } = useContext(User);
  const token = contextToken || cookie.get("token");

  // =====================
  // GET ALL NOTIFICATIONS
  // =====================
  const fetchNotifications = async () => {
    try {
      if (!token) return;

      const res = await fetch("http://127.0.0.1:8000/api/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();

      const list =
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

      setNotifications(list);
    } catch (error) {
      console.error("fetchNotifications error:", error);
      setNotifications([]);
    }
  };

  // =====================
  // GET UNREAD COUNT
  // =====================
  const fetchUnread = async () => {
    try {
      if (!token) return;

      const res = await fetch(
        "http://127.0.0.1:8000/api/notifications/unread",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      const unread =
        Array.isArray(data?.data)
          ? data.data.length
          : data?.data ?? 0;

      setUnreadCount(unread);
    } catch (error) {
      console.error("fetchUnread error:", error);
    }
  };

 
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchNotifications(), fetchUnread()]);
    setLoading(false);
  };

 
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    loadData();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnread();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  // =====================
  // MARK ONE AS READ
  // =====================
  const markAsRead = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date() } : n
        )
      );

      fetchUnread();
    } catch (error) {
      console.error("markAsRead error:", error);
    }
  };

  // =====================
  // MARK ALL AS READ
  // =====================
  const markAllAsRead = async () => {
    try {
      await fetch(
        "http://127.0.0.1:8000/api/notifications/read-all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date() }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("markAllAsRead error:", error);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="notifications-app">
      <Sidebar />

      <div className="notifications-main">
        {/* HEADER */}
        <div className="notifications-header-row">
          <div className="header-left">
            <h1>
              Notifications{" "}
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </h1>
            <h4>Stay updated with system alerts.</h4>
          </div>

          <button
            onClick={markAllAsRead}
            className="mark-all-btn"
          >
            Mark all as read
          </button>
        </div>

        {/* LIST */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="empty">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${
                  !n.read_at ? "unread" : ""
                }`}
                onClick={() => markAsRead(n.id)}
              >
                <h2>
                  {n.data?.title || n.title || "Notification"}
                </h2>

                <p>
                  {n.data?.message || n.message || ""}
                </p>

                <div className="date">
                  {n.created_at}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}