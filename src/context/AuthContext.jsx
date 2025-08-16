import React, { createContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "../utils/storage";
import { login as loginApi } from "../api/authApi"; // use named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tokenData = getToken();
    if (tokenData) setUser(tokenData);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password); // call the named import
    setToken(response.data);
    setUser(response.data);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
