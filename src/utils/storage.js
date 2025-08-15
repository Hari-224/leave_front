const TOKEN_KEY = "jwt_token";

export const getToken = () => {
  const data = localStorage.getItem(TOKEN_KEY);
  return data ? JSON.parse(data) : null;
};

export const setToken = (data) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
