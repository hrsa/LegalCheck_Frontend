export const ruleTypes = ['conflict', 'risk', 'requirement'] as const;
export const severities = ['low', 'medium', 'high'] as const;
export const policyTypes = ['company', 'industry', 'standard'] as const;

export type RuleType = typeof ruleTypes[number];
export type Severity = typeof severities[number];
export type PolicyType = typeof policyTypes[number];

export interface Rule {
    id: number;
    policy_id: number;
    rule_type: RuleType;
    description: string;
    severity: Severity;
    keywords: string[] | [];
    created_at: string;
    updated_at: string | null;
}

export interface Policy {
    id: number;
    name: string;
    description: string;
    policy_type: PolicyType;
    source_url: string | null;
    company_id: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    rules: Rule[] | [];
}

export interface PolicyState {
    policies: Policy[];
    loading: boolean;
    error: string | null;
    currentPolicy: Policy | null;
    editModalVisible: boolean;
    updating: boolean;
    currentRule: Rule | null;
    ruleEditModalVisible: boolean;
    updatingRule: boolean;

    fetchPolicies: () => Promise<void>;
    updatePolicy: (id: number, data: Partial<Policy>) => Promise<void>;
    createPolicy: (data: Partial<Policy>) => Promise<void>;
    setCurrentPolicy: (policy: Policy | null) => void;
    setEditModalVisible: (visible: boolean) => void;
    updateRule: (policyId: number, ruleId: number, data: Partial<Rule>) => Promise<void>;
    createRule: (policyId: number, data: Partial<Rule>) => Promise<void>;
    setCurrentRule: (rule: Rule | null) => void;
    setRuleEditModalVisible: (visible: boolean) => void;
}
