import {create} from "zustand";
import {Document} from "../types/document.types";
import {AnalysisResult, AnalysisResultState} from "../types/analysis_result.types";
import * as AnalysisResultsAPI from "../services/api/analysisResults";

export const useAnalysisResultStore = create<AnalysisResultState>((set, get) => ({
    analysisResults: null,
    currentDocument: null,
    error: null,
    loading: false,

    fetchAnalysisResults: async (documentId: number) => {
        set({loading: true, error: null});
        try {
            const analysisResults = await AnalysisResultsAPI.fetchAnalysisResults(documentId);
            set({analysisResults});
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

    analyzeDocument: async (documentId: number, checklistId: number | null) => {
        set({loading: true, error: null});
        try {
            const newAnalysisResult = await AnalysisResultsAPI.analyzeDocument(documentId, checklistId);
            console.log(newAnalysisResult);
            const {analysisResults} = get();
            if (analysisResults === null) {
                set({ analysisResults: [newAnalysisResult] });
            } else {
                set({ analysisResults: [...analysisResults, newAnalysisResult] });
            }
        } catch (err: any) {
            console.error('Error fetching analysis result:', err);
            set({error: 'Failed to load analysis result. Please try again later.'});
        } finally {
            set({loading: false});
        }
    }
}));
