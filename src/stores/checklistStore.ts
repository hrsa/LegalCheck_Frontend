import { create } from "zustand";
import apiClient from "../services/api/apiClient";
import { Checklist, ChecklistState } from "../types/checklist.types";

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
            const response = await apiClient.get('/checklists/');
            set({ checklists: response.data });
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
            const response = await apiClient.post('/checklists/', data);
            const newChecklist = response.data;

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
            await apiClient.patch(`/checklists/${id}`, data);

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
            await apiClient.delete(`/checklists/${id}`);
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
