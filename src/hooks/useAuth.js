// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export const useAuth = () => {
//   const { user, login, logout } = useContext(AuthContext);
//   const token = user?.token || null;

//   return { user, token, login, logout };
// };
import { getToken, removeToken } from "../utils/storage";

export const useAuth = () => {
  const userData = getToken() || {};

  const user = {
    email: userData.email || "",
    role: userData.role || "employee",
    name: userData.name || "User",
    avatar: userData.avatar || "",
    token: userData.token || null,
  };

  const logout = () => {
    removeToken();
    window.location.href = "/login";
  };

  return { user, token: user.token, logout };
};
