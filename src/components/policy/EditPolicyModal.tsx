import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput} from 'react-native';
import Badge from '../Badge';
import Button from '../Button'
import {Policy} from '../../stores/policyStore';

interface EditPolicyModalProps {
    visible: boolean;
    policy: Policy | null;
    onClose: () => void;
    onSave: (id: number, data: Partial<Policy>) => Promise<void>;
    updating: boolean;
}

export default function EditPolicyModal({
                                            visible,
                                            policy,
                                            onClose,
                                            onSave,
                                            updating
                                        }: EditPolicyModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (policy) {
            setName(policy.name);
            setDescription(policy.description);
            setIsActive(policy.is_active);
        }
    }, [policy]);

    const handleSave = async () => {
        if (!policy) return;

        try {
            await onSave(policy.id, {
                id: policy.id,
                name,
                policy_type: policy.policy_type,
                description,
                is_active: isActive
            });
        } catch (err) {
            // Error handling is done in the parent component
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-5 rounded-lg w-4/5">
                    <Text className="text-xl font-bold mb-4">Edit Policy</Text>

                    <Text className="font-medium mb-1">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="border border-gray-300 rounded p-2 mb-3"
                    />

                    <Text className="font-medium mb-1">Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="border border-gray-300 rounded p-2 mb-3"
                        textAlignVertical="top"
                    />

                    <View className="flex-row items-center mb-4">
                        <TouchableOpacity
                            onPress={() => setIsActive(!isActive)}
                            className="mr-2"
                        >
                            <Badge
                                text={isActive ? 'Active' : 'Inactive'}
                                variant={isActive ? 'green' : 'red'}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center">
                        <Button
                            title="Cancel"
                            onPress={onClose}
                            className="bg-gray-400 mr-2"
                        />
                        <Button
                            title="Save"
                            onPress={handleSave}
                            disabled={updating}
                            className={`${updating ? 'bg-blue-300' : 'bg-blue-500'}`}
                            loading={updating}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}