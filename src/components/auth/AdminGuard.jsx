import React, { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";

const AdminGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const decoded = jwtDecode(user.token);
  // console.log("decode user in admin auth : ", decoded);
  if (decoded.role === "VISITOR") {
    window.history.back();
    window.alert("Access Denied: You are not authorized to visit this page.");
  }
  return decoded.role !== "VISITOR" ? children : null;
};

export default AdminGuard;
