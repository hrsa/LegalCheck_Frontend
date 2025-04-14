import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useChecklistStore } from '../../src/stores/checklistStore';
import { usePolicyStore } from '../../src/stores/policyStore';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import ChecklistItem from '../../src/components/checklist/ChecklistItem';
import Button from '../../src/components/Button';
import ChecklistFormModal from '../../src/components/checklist/ChecklistFormModal';
import { Checklist } from '../../src/types/checklist.types';
import { Notification, useNotification } from '../../src/components/Notification';

export default function ChecklistsScreen() {
    const {
        checklists,
        error,
        loading,
        updating,
        currentChecklist,
        editModalVisible,
        fetchChecklists,
        createChecklist,
        updateChecklist,
        deleteChecklist,
        setCurrentChecklist,
        setEditModalVisible
    } = useChecklistStore();

    const { fetchPolicies } = usePolicyStore();

    const { notification, showNotification, hideNotification, showAlert } = useNotification();

    useEffect(() => {
        fetchChecklists();
        fetchPolicies(); // Fetch policies to get rules for the form
    }, [fetchChecklists, fetchPolicies]);

    const handleCreateChecklist = () => {
        setCurrentChecklist(null);
        setEditModalVisible(true);
    };

    const handleEditChecklist = (checklist: Checklist) => {
        setCurrentChecklist(checklist);
        setEditModalVisible(true);
    };

    const handleSaveChecklist = async (data: Partial<Checklist>) => {
        try {
            if (currentChecklist && currentChecklist.id) {
                await updateChecklist(currentChecklist.id, data);
                showAlert('Success', 'Checklist updated successfully', 'success');
            } else {
                await createChecklist(data);
                showAlert('Success', 'Checklist created successfully', 'success');
            }
        } catch (error) {
            showAlert('Error', 'Failed to save checklist. Please try again.', 'error');
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Notification 
                type={notification.type || undefined}
                message={notification.message}
                visible={notification.visible}
                onDismiss={hideNotification}
            />

            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    My Checklists
                </Text>
                <Button
                    title="Create Checklist"
                    onPress={handleCreateChecklist}
                />
            </View>

            {loading ? (
                <LoadingIndicator />
            ) : error ? (
                <ErrorMessage
                    message={error}
                    onRetry={fetchChecklists}
                />
            ) : (
                <FlatList
                    data={checklists}
                    renderItem={({ item }) => (
                        <ChecklistItem 
                            item={item} 
                            onEdit={handleEditChecklist}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-4">No checklists found.</Text>
                    }
                />
            )}

            <ChecklistFormModal
                visible={editModalVisible}
                checklist={currentChecklist}
                onClose={() => setEditModalVisible(false)}
                onDelete={deleteChecklist}
                onSave={handleSaveChecklist}
                updating={updating}
            />
        </View>
    );
}
