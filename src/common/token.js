export const getAuthHeaders = () => {
  const token = localStorage.getItem("praya_token");
  return { Authorization: `Bearer ${token}` };
};
