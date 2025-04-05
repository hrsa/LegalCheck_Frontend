import {create} from "zustand";
import apiClient from "../services/api/apiClient";

export interface Policy {
    id: number;
    name: string;
    description: string;
    policy_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PolicyState {
    policies: Policy[];
    loading: boolean;
    error: string | null;
    currentPolicy: Policy | null;
    editModalVisible: boolean;
    updating: boolean;

    fetchPolicies: () => Promise<void>;
    updatePolicy: (id: number, data: Partial<Policy>) => Promise<void>;
    setCurrentPolicy: (policy: Policy | null) => void;
    setEditModalVisible: (visible: boolean) => void;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
    policies: [],
    loading: false,
    error: null,
    currentPolicy: null,
    editModalVisible: false,
    updating: false,

    fetchPolicies: async () => {
        set({loading: true, error: null});
        try {
            const response = await apiClient.get('/policies/');
            set({policies: response.data});
        } catch (err: any) {
            console.error('Error fetching policies:', err);
            set({error: 'Failed to load policies. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },

    updatePolicy: async (id: number, data: Partial<Policy>) => {
        set({updating: true});
        try {
            console.log(data);
            await apiClient.patch(`/policies/${id}`, data);

            const { policies } = get();
            set({
                policies: policies.map(policy => 
                    policy.id === id ? { ...policy, ...data } : policy
                )
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error updating policy:', err);
            return Promise.reject('Failed to update policy. Please try again.');
        } finally {
            set({updating: false});
        }
    },

    setCurrentPolicy: (policy: Policy | null) => {
        set({currentPolicy: policy});
    },

    setEditModalVisible: (visible: boolean) => {
        set({editModalVisible: visible});
    }
}));
