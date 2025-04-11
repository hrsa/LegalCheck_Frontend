export interface Document {
    id: number;
    filename: string;
    company_id: number | null;
    is_processed: boolean;
    created_at: string;
}

export interface DocumentState {
    documents: Document[];
    loading: boolean;
    error: string | null;
    currentDocument: Document | null;
    editModalVisible: boolean;
    updating: boolean;

    fetchDocuments: () => Promise<void>;
    createDocument: (data: Partial<Document>) => Promise<void>;
    analyzeDocument: (documentId: number, checklistId: number | null) => Promise<void>;
    uploadDocument: (file: any) => Promise<void>;
    setCurrentDocument: (document: Document | null) => void;
    setEditModalVisible: (visible: boolean) => void;
}
