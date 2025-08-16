// utils/storage.js

const TOKEN_KEY = "jwt_token";

/**
 * Get JWT token from localStorage
 * @returns {object|null}
 */
export const getToken = () => {
  try {
    const data = localStorage.getItem(TOKEN_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error reading token from storage:", err);
    return null;
  }
};

/**
 * Save JWT token to localStorage
 * @param {object} data
 */
export const setToken = (data) => {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving token to storage:", err);
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Error removing token from storage:", err);
  }
};
