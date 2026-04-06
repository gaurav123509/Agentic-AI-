import apiClient from "./apiClient";

export const getData = async () => {
  const response = await apiClient.get("/api/data");
  return response.data;
};

export const submitData = async (payload) => {
  const response = await apiClient.post("/api/submit", payload);
  return response.data;
};
