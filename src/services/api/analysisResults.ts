import apiClient from "./apiClient";
import {AnalysisResult} from "../../types/analysis_result.types";

export const fetchAnalysisResults = async (documentId: number) => {
  const response = await apiClient.get(`/documents/${documentId}/analysis_results`);
  return response.data as AnalysisResult[];
};

export const analyzeDocument = async (documentId: number, checklistId: number | null = null) => {
  const data = checklistId ? { checklist_id: checklistId } : {};
  const response = await apiClient.post(`/documents/${documentId}/analyze`, data);
  return response.data as AnalysisResult;
};