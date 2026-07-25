import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { User } from "./context/UserContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { auth } = useContext(User);

  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(auth.user.role?.toLowerCase())) {
    return <Navigate to="/not-authorized" replace />;
  }
console.log(auth.user.role);
  return children;
}