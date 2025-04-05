import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { usePolicyStore, Policy } from '../../src/stores/policyStore';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import PolicyItem from '../../src/components/policy/PolicyItem';
import EditPolicyModal from '../../src/components/policy/EditPolicyModal';

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
        updating 
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


    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                My Policies
            </Text>

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
                onSave={handleUpdatePolicy}
                updating={updating}
            />
        </View>
    );
}
