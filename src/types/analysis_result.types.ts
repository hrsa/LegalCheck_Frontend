import {Document} from "./document.types";

interface Conflict {
    policy_name: string;
    conflict_detail: string;
}

interface Risk {
    risk_type: string;
    detail: string;
}

interface MissingClause {
    clause_name: string;
    suggestion: string;
}

interface Suggestion {
    title: string;
    details: string;
}

interface PaymentTerm {
    title: string | null;
    due_date: string | null;
    payment_method: string | null;
    amount_due: number | null;
    currency: string | null;
    penalties: string | null;
    discount: string | null;
    notes: string | null;
}

export interface AnalysisResult {
    id: number;
    document_id: number;
    checklist_id: number | null;
    checklist_name: string | null;
    title: string | null;
    company_name: string | null;
    conflicts: Conflict[];
    risks: Risk[];
    missing_clauses: MissingClause[];
    suggestions: Suggestion[];
    payment_terms: PaymentTerm[];
    created_at: string;
    updated_at: string | null;
}

export interface AnalysisResultState {
    analysisResults: AnalysisResult[] | null;
    loading: boolean;
    error: string | null;
    currentDocument: Document | null;

    fetchAnalysisResults: (documentId: number) => Promise<void>;
    analyzeDocument: (documentId: number, checklistId: number | null) => Promise<void>;
    setCurrentDocument: (document: Document | null) => void;
}
