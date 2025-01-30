import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const useApiInstance = () => {
  const { user } = useContext(UserContext);
  const apiInstance = axios.create({
    baseURL:
      import.meta.env.VITE_ENVIRONMENT === "PROD"
        ? import.meta.env.VITE_API_BASE_URI
        : "http://localhost:5000/api/v1",
    headers: {
      Authorization: user?.token ? `Bearer ${user.token}` : "",
    },
  });

  return apiInstance;
};

export default useApiInstance;
