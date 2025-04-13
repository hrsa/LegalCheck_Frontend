import apiClient from "./apiClient";
import { Policy } from "../../types/policy.types";

export const fetchPolicies = async () => {
  const response = await apiClient.get('/policies/');
  return response.data as Policy[];
};

export const updatePolicy = async (id: number, data: Partial<Policy>) => {
  const response = await apiClient.patch(`/policies/${id}`, data);
  return response.data as Policy;
};

export const createPolicy = async (data: Partial<Policy>) => {
  const response = await apiClient.post('/policies/', data);
  return response.data as Policy;
};