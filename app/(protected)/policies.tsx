import React, { useEffect } from 'react';
import Button from '../../src/components/Button';
import { View, Text, FlatList } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { usePolicyStore } from '../../src/stores/policyStore';
import { Policy, Rule } from '../../src/types/policy.types';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import PolicyItem from '../../src/components/policy/PolicyItem';
import EditPolicyModal from '../../src/components/policy/EditPolicyModal';
import EditRuleModal from '../../src/components/policy/EditRuleModal';

export default function PoliciesScreen() {
    const { user } = useAuthStore();
    const { 
        policies, 
        loading, 
        error, 
        fetchPolicies, 
        updatePolicy, 
        currentPolicy, 
        setCurrentPolicy, 
        editModalVisible, 
        setEditModalVisible, 
        updating,
        currentRule,
        ruleEditModalVisible,
        setRuleEditModalVisible,
        updatingRule,
        updateRule,
        setCurrentRule
    } = usePolicyStore();

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    const openEditModal = (policy: Policy) => {
        setCurrentPolicy(policy);
        setEditModalVisible(true);
    };

    const handleUpdatePolicy = async (id: number, data: Partial<Policy>) => {
        try {
            await updatePolicy(id, data);
            setEditModalVisible(false);
        } catch (err) {
            alert('Failed to update policy. Please try again.');
        }
    };

    const handleSaveRule = async (policyId: number, ruleId: number, data: Partial<Rule>) => {
        try {
            if (ruleId === 0) {
                await usePolicyStore.getState().createRule(policyId, data);
            } else {
                await updateRule(policyId, ruleId, data);
            }
            setRuleEditModalVisible(false);
        } catch (err) {
            alert('Failed to save rule. Please try again.');
        }
    };


    const handleCreatePolicy = () => {
        setCurrentPolicy({
            id: 0, // This will be replaced by the server
            name: '',
            description: '',
            policy_type: 'company',
            source_url: null,
            company_id: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: null,
            rules: []
        });
        setEditModalVisible(true);
    };

    const handleSavePolicy = async (id: number, data: Partial<Policy>) => {
        try {
            if (id === 0) {
                // Creating a new policy
                await usePolicyStore.getState().createPolicy(data);
            } else {
                // Updating an existing policy
                await updatePolicy(id, data);
            }
            setEditModalVisible(false);
        } catch (err) {
            alert('Failed to save policy. Please try again.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    My Policies
                </Text>
                <Button
                    title="Add Policy"
                    onPress={handleCreatePolicy}
                />
            </View>

            {loading ? (
                <LoadingIndicator />
            ) : error ? (
                <ErrorMessage 
                    message={error} 
                    onRetry={fetchPolicies} 
                />
            ) : (
                <FlatList
                    data={policies}
                    renderItem={({ item }) => (
                        <PolicyItem 
                            item={item} 
                            onEdit={openEditModal} 
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-4">No policies found.</Text>
                    }
                />
            )}

            <EditPolicyModal
                visible={editModalVisible}
                policy={currentPolicy}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSavePolicy}
                updating={updating}
            />

            <EditRuleModal
                visible={ruleEditModalVisible}
                rule={currentRule}
                onClose={() => setRuleEditModalVisible(false)}
                onSave={handleSaveRule}
                updating={updatingRule}
            />
        </View>
    );
}
