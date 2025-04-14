import {create} from "zustand";
import {Document, DocumentState} from "../types/document.types";
import * as DocumentsAPI from "../services/api/documents";
import * as AnalysisResultsAPI from "../services/api/analysisResults";

export const useDocumentStore = create<DocumentState>((set, get) => ({
    documents: [],
    loading: false,
    error: null,
    currentDocument: null,
    updating: false,
    editModalVisible: false,

    fetchDocuments: async () => {
        set({loading: true, error: null});
        try {
            const documents = await DocumentsAPI.fetchDocuments();
            set({documents});
        } catch (err: any) {
            console.error('Error fetching documents:', err);
            set({error: 'Failed to load documents. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },


    fetchDocument: async (documentId: number) => {
        set({loading: true, error: null});
        try {
            const document = await DocumentsAPI.fetchDocument(documentId);
            set({currentDocument: document});
        } catch (err: any) {
            console.error('Error fetching document ' + documentId, err);
            set({error: 'Failed to find the document ' + documentId + '. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },


    uploadDocument: async (file: any) => {
        set({updating: true});
        try {
            const newDocument = await DocumentsAPI.uploadDocument(file);

            const {documents} = get();
            set({
                documents: [newDocument, ...documents]
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error uploading document:', err);
            return Promise.reject('Failed to upload document. Please try again.');
        } finally {
            set({updating: false});
        }
    },

    analyzeDocument: async (documentId: number, checklistId: number | null = null) => {
        set({loading: true, updating: true});

        try {
            const result = await AnalysisResultsAPI.analyzeDocument(documentId, checklistId);
            if (result) {
                const {documents} = get();
                set({
                    documents: documents.map(document => {
                        if (document.id === documentId) {
                            return {
                                ...document,
                                is_processed: true
                            }
                        }
                        return document;
                    })
                });
            }
        } catch (err: any) {
            console.error('Error analyzing document:', err);
            return Promise.reject('Failed to analyze document. Please try again.');
        } finally {
            set({loading: false, updating: false});
        }
    },

    setCurrentDocument: (document: Document | null) => {
        set({currentDocument: document});
    },

    setEditModalVisible: (visible: boolean) => {
        set({editModalVisible: visible});
    }
}));
