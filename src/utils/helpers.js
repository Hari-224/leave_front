export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

export const isPastDate = (dateStr) => {
  const today = new Date();
  return new Date(dateStr) < today;
};
