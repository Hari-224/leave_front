// utils/helpers.js

/**
 * Format a date string into locale date
 * @param {string|Date} dateStr
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date) ? "-" : date.toLocaleDateString();
};

/**
 * Check if a given date is in the past
 * @param {string|Date} dateStr
 * @returns {boolean}
 */
export const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  const targetDate = new Date(dateStr);
  return !isNaN(targetDate) && targetDate < today;
};

/**
 * Calculate the difference in days between two dates (inclusive)
 * @param {string|Date} start
 * @param {string|Date} end
 * @returns {number} Number of days
 */
export const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate) || isNaN(endDate)) return 0;
  const diffTime = endDate - startDate;
  return diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
};
