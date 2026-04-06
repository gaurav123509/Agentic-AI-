import apiClient from "./apiClient";

export const analyzeEmail = async (payload) => {
  const response = await apiClient.post("/api/emails/analyze", payload);
  return response.data;
};

export const getEmailHistory = async (params = {}) => {
  const response = await apiClient.get("/api/emails/history", { params });
  return response.data;
};

export const executeAction = async (payload) => {
  const response = await apiClient.post("/api/emails/execute-action", payload);
  return response.data;
};
