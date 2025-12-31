import apiClient from "./apiClient";

export const getAllElections = () => {
  return apiClient.get("api/elections");
};

export const createElection = (payload: any) => {
  return apiClient.post("api/elections/create", payload);
};

export const updateElection = (id: string, payload: any) => {
  return apiClient.put(`api/elections/update/${id}`, payload);
};