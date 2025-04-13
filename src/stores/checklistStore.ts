import { create } from "zustand";
import { Checklist, ChecklistState } from "../types/checklist.types";
import * as ChecklistsAPI from "../services/api/checklists";

export const useChecklistStore = create<ChecklistState>((set, get) => ({
    checklists: [],
    loading: false,
    error: null,
    currentChecklist: null,
    editModalVisible: false,
    updating: false,

    fetchChecklists: async () => {
        set({ loading: true, error: null });
        try {
            const checklists = await ChecklistsAPI.fetchChecklists();
            set({ checklists });
        } catch (err: any) {
            console.error('Error fetching checklists:', err);
            set({ error: 'Failed to load checklists. Please try again later.' });
        } finally {
            set({ loading: false });
        }
    },

    createChecklist: async (data: Partial<Checklist>) => {
        set({ updating: true });
        try {
            const newChecklist = await ChecklistsAPI.createChecklist(data);

            const { checklists } = get();
            set({
                checklists: [...checklists, newChecklist]
            });

            await get().fetchChecklists();
            return Promise.resolve();
        } catch (err: any) {
            console.error('Error creating checklist:', err);
            return Promise.reject('Failed to create checklist. Please try again.');
        } finally {
            set({ updating: false });
        }
    },

    updateChecklist: async (id: number, data: Partial<Checklist>) => {
        set({ updating: true });
        try {
            await ChecklistsAPI.updateChecklist(id, data);

            const { checklists } = get();
            set({
                checklists: checklists.map(checklist => 
                    checklist.id === id ? { ...checklist, ...data } : checklist
                )
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error updating checklist:', err);
            return Promise.reject('Failed to update checklist. Please try again.');
        } finally {
            set({ updating: false });
        }
    },

    deleteChecklist: async (id: number) => {
        set({ updating: true });
        try {
            await ChecklistsAPI.deleteChecklist(id);
            await get().fetchChecklists();
            return Promise.resolve();
        } catch (err: any) {
            console.error('Error deleting checklist:', err);
            return Promise.reject('Failed to delete checklist. Please try again.');
        } finally {
            set({ updating: false });
        }
    },

    setCurrentChecklist: (checklist: Checklist | null) => {
        set({ currentChecklist: checklist });
    },

    setEditModalVisible: (visible: boolean) => {
        set({ editModalVisible: visible });
    }
}));
