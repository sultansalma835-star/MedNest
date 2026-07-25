
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import {User} from "./UserContext";

export default function UserProvider({ children }) {
  const cookie = new Cookies();

  const [auth, setAuth] = useState({
    token: cookie.get("token") || null,
    user: null,
  });

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth?.token) {
      cookie.set("token", auth.token, { path: "/" });
    }
  }, [auth?.token]);

  return (
    <User.Provider value={{ auth, setAuth, cart, setCart }}>
      {children}
    </User.Provider>
  );
}
