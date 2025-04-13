import {create} from "zustand";
import {Policy, PolicyState, Rule} from "../types/policy.types";
import * as PoliciesAPI from "../services/api/policies";
import * as RulesAPI from "../services/api/rules";

export const usePolicyStore = create<PolicyState>((set, get) => ({
    policies: [],
    loading: false,
    error: null,
    currentPolicy: null,
    editModalVisible: false,
    updating: false,
    currentRule: null,
    ruleEditModalVisible: false,
    updatingRule: false,

    fetchPolicies: async () => {
        set({loading: true, error: null});
        try {
            const policies = await PoliciesAPI.fetchPolicies();
            set({policies});
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
            await PoliciesAPI.updatePolicy(id, data);

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

    createPolicy: async (data: Partial<Policy>) => {
        set({updating: true});
        try {
            const newPolicy = await PoliciesAPI.createPolicy(data);

            const { policies } = get();
            set({
                policies: [...policies, newPolicy]
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error creating policy:', err);
            return Promise.reject('Failed to create policy. Please try again.');
        } finally {
            set({updating: false});
        }
    },

    setCurrentPolicy: (policy: Policy | null) => {
        set({currentPolicy: policy});
    },

    setEditModalVisible: (visible: boolean) => {
        set({editModalVisible: visible});
    },

    updateRule: async (policyId: number, ruleId: number, data: Partial<Rule>) => {
        set({updatingRule: true});
        try {
            if (data.keywords) {
                data.keywords = [...new Set(data.keywords)];
            }

            await RulesAPI.updateRule(ruleId, data);

            const { policies } = get();
            set({
                policies: policies.map(policy => {
                    if (policy.id === policyId) {
                        return {
                            ...policy,
                            rules: policy.rules.map(rule => 
                                rule.id === ruleId ? { ...rule, ...data } : rule
                            )
                        };
                    }
                    return policy;
                })
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error updating rule:', err);
            return Promise.reject('Failed to update rule. Please try again.');
        } finally {
            set({updatingRule: false});
        }
    },

    createRule: async (policyId: number, data: Partial<Rule>) => {
        set({updatingRule: true});
        try {
            if (data.keywords) {
                data.keywords = [...new Set(data.keywords)];
            }

            const newRule = await RulesAPI.createRule(policyId, data);

            const { policies } = get();
            set({
                policies: policies.map(policy => {
                    if (policy.id === policyId) {
                        return {
                            ...policy,
                            rules: [...policy.rules, newRule]
                        };
                    }
                    return policy;
                })
            });

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error creating rule:', err);
            return Promise.reject('Failed to create rule. Please try again.');
        } finally {
            set({updatingRule: false});
        }
    },

    setCurrentRule: (rule: Rule | null) => {
        set({currentRule: rule});
    },

    setRuleEditModalVisible: (visible: boolean) => {
        set({ruleEditModalVisible: visible});
    }
}));
