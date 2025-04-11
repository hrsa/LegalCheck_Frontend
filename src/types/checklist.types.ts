import { Rule } from './policy.types';

export const checklistTypes = ['user', 'company'] as const;
export type ChecklistType = typeof checklistTypes[number];

export interface Checklist {
    id: number;
    name: string;
    user_id: number | null;
    company_id: number | null;
    ruleset: number[];
    created_at: string;
    updated_at: string;
    rules: Rule[];
    type: ChecklistType;
}

export interface ChecklistState {
    checklists: Checklist[];
    loading: boolean;
    error: string | null;
    currentChecklist: Checklist | null;
    editModalVisible: boolean;
    updating: boolean;

    fetchChecklists: () => Promise<void>;
    createChecklist: (data: Partial<Checklist>) => Promise<void>;
    updateChecklist: (id: number, data: Partial<Checklist>) => Promise<void>;
    deleteChecklist: (id: number) => Promise<void>;
    setCurrentChecklist: (checklist: Checklist | null) => void;
    setEditModalVisible: (visible: boolean) => void;
}
