// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  const token = user?.token || null; // Get token from user object

  return { user, token, login, logout };
};
