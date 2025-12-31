import apiClient from "./apiClient";

export const getAllElections = () => {
  return apiClient.get("api/elections");
};
