import apiClient from "./apiClient";

export const fetchFreelancers = () => apiClient.get("/users/freelancers");

export const createJob = (payload) => apiClient.post("/jobs", payload);
export const getOpenJobs = () => apiClient.get("/jobs/open");
export const getClientJobs = () => apiClient.get("/jobs/client");
export const getFreelancerJobs = () => apiClient.get("/jobs/freelancer");
export const getJobById = (jobId) => apiClient.get(`/jobs/${jobId}`);

export const acceptApplicant = (jobId, data) => apiClient.patch(`/jobs/${jobId}/assign`, data);
export const markAwaiting = (jobId) => apiClient.patch(`/jobs/${jobId}/awaiting`);
export const completeJob = (jobId) => apiClient.patch(`/jobs/${jobId}/complete`);

export const applyToJob = (jobId, payload) => apiClient.post(`/applications/${jobId}`, payload);
export const getApplicants = (jobId) => apiClient.get(`/applications/${jobId}`);

export const getChats = () => apiClient.get("/chats");
export const getMessages = (jobId) => apiClient.get(`/messages/${jobId}`);
export const sendMessage = (jobId, payload) => apiClient.post(`/messages/${jobId}`, payload);

