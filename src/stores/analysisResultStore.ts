import {create} from "zustand";
import apiClient from "../services/api/apiClient";
import {Document, DocumentState} from "../types/document.types";
import {AnalysisResult, AnalysisResultState} from "../types/analysis_result.types";

export const useAnalysisResultStore = create<AnalysisResultState>((set, get) => ({
    analysisResults: null,
    currentDocument: null,
    error: null,
    loading: false,

    fetchAnalysisResults: async (documentId: number) => {
        set({loading: true, error: null});
        try {
            const response = await apiClient.get('/documents/' + documentId + '/analysis_results');
            set({analysisResults: response.data});
        } catch (err: any) {
            console.error('Error fetching analysis result:', err);
            set({error: 'Failed to load analysis result. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },

    setCurrentDocument: (document: Document | null) => {
        set({currentDocument: document});
    },

    analyzeDocument: async (id: number) => {
    }
}));
