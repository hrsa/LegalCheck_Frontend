import apiClient from "./apiClient";
import { Checklist } from "../../types/checklist.types";

export const fetchChecklists = async () => {
  const response = await apiClient.get('/checklists/');
  return response.data as Checklist[];
};

export const createChecklist = async (data: Partial<Checklist>) => {
  const response = await apiClient.post('/checklists/', data);
  return response.data as Checklist;
};

export const updateChecklist = async (id: number, data: Partial<Checklist>) => {
  const response = await apiClient.patch(`/checklists/${id}`, data);
  return response.data as Checklist;
};

export const deleteChecklist = async (id: number) => {
  const response = await apiClient.delete(`/checklists/${id}`);
  return response.data;
};