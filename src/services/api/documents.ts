import apiClient from "./apiClient";
import {Document} from "../../types/document.types";
import {AnalysisResult} from "../../types/analysis_result.types";

export const fetchDocuments = async () => {
    const response = await apiClient.get('/documents/');
    return response.data as Document[];
};

export const fetchDocument = async (documentId: number) => {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data as Document;
};

export const uploadDocument = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/documents/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data as Document;
};