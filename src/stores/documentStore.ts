import {create} from "zustand";
import apiClient from "../services/api/apiClient";
import {Document, DocumentState} from "../types/document.types";

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
            const response = await apiClient.get('/documents/');
            set({documents: response.data});
        } catch (err: any) {
            console.error('Error fetching documents:', err);
            set({error: 'Failed to load documents. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },


    createDocument: async (data: Partial<Document>) => {
        set({updating: true});
        try {
            const response = await apiClient.post('/documents/', data);
            const newDocument = response.data;

            const {documents} = get();
            set({
                documents: [...documents, newDocument]
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error creating document:', err);
            return Promise.reject('Failed to create document. Please try again.');
        } finally {
            set({updating: false});
        }
    },

    uploadDocument: async (file: any) => {
        set({updating: true});
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/documents/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newDocument = response.data;

            const {documents} = get();
            set({
                documents: [...documents, newDocument]
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error uploading document:', err);
            return Promise.reject('Failed to upload document. Please try again.');
        } finally {
            set({updating: false});
        }
    },

    analyzeDocument: async (documentId: number) => {
      set({updating: true});
      try {
        const response = await apiClient.post(`/documents/${documentId}/analyze`);
        if (response.status === 200) {
        //     update the document from documents is_processed property
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
        set({updating: false});
      }
    },

    setCurrentDocument: (document: Document | null) => {
        set({currentDocument: document});
    },

    setEditModalVisible: (visible: boolean) => {
        set({editModalVisible: visible});
    }
}));
