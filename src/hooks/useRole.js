import { useAuth } from "./useAuth";

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";
  const isEmployee = role === "EMPLOYEE";

  return { role, isAdmin, isManager, isEmployee };
};
