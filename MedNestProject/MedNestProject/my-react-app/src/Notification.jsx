
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User } from "./context/UserContext";
import "./notification.css";
import SideBar from "./Components/SideBar";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);


  const [readMap, setReadMap] = useState({});

  const { auth } = useContext(User);
  const token = auth.token;

  
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

      setNotifications(res.data.data || []);

      // حساب unread من readMap
      const unread = (res.data.data || []).filter(
        (n) => !readMap[n.id]
      ).length;

      setUnreadCount(unread);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= GET UNREAD =================
  const getUnread = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/notifications/unread",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setUnreadCount(res.data.data?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= MARK ALL AS READ =================
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

      // 🔥 فقط نعلم كل الجديد كمقروء
      const newMap = { ...readMap };

      notifications.forEach((n) => {
        newMap[n.id] = true;
      });

      setReadMap(newMap);
      setUnreadCount(0);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    const run = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      await getNotifications();
      await getUnread();
      setLoading(false);
    };

    run();
  }, [token]);

  // ================= UI =================
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
              const isUnread = !readMap[n.id];

              return (
                <div
                  key={n.id}
                  className={`notification-item ${
                    isUnread ? "unread" : ""
                  }`}
                  onClick={() =>
                    setReadMap((prev) => {
                      // 🔥 ما نغير المقروء أصلاً
                      if (prev[n.id]) return prev;
                      return {
                        ...prev,
                        [n.id]: true,
                      };
                    })
                  }
                >
                  <h2>{n.data.title}</h2>
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
