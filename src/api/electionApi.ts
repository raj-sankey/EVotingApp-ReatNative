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

export const getElectionDetail = (id: string) =>
  apiClient.get(`api/elections/${id}`);

export const voteForCandidate = (
  electionId: string,
  candidateId: string
) =>
  apiClient.post(`api/vote/${electionId}/vote`, {
    candidateId,
  });

export const getLiveResults = (electionId: string) =>
  apiClient.get(`api/results/${electionId}/live-results`);

export const deleteElection = (id: string) => {
  return apiClient.delete(`api/elections/delete/${id}`);
};