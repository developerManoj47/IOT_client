import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const initialUser = {
  isUser: false,
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to sync state and storage
  const updateUserState = (user) => {
    const updatedUser = { ...user, isUser: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(initialUser);
    console.log("User logged out!");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(initialUser);
    }
    setIsLoading(false); // Data loaded
  }, []);

  return (
    <UserContext.Provider
      value={{ user, logout, setUserToLocalStorage: updateUserState }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
