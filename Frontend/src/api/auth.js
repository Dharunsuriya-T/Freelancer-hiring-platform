import apiClient from "./apiClient";

export const signupUser = (payload) => apiClient.post("/auth/signup", payload);
export const loginUser = (payload) => apiClient.post("/auth/login", payload);
export const logoutUser = () => apiClient.post("/auth/logout");
export const fetchMe = () => apiClient.get("/auth/me");
export const updateProfile = (payload) => apiClient.put("/auth/profile", payload);

