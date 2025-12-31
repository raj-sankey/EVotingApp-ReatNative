import apiClient from "./apiClient";

export const studentLogin = (data: {
  username: string;
  password: string;
}) => {
  return apiClient.post("api/auth/login", data);
};

export const adminLogin = (data: {
  username: string;
  password: string;
}) => {
  return apiClient.post("api/admin/admin-login", data);
};
