import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Check when the user is not authenticated
    if (!user?.isUser) {
      // console.log("User not authenticated, redirecting...");
      navigate("/sign-in");
    }
  }, [user, navigate]); // Dependency array with user and navigate

  return user?.isUser ? children : null; // Prevent accidental rendering
};

export default AuthGuard;
