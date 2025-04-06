import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import TextInput from '../TextInput';
import Badge from '../Badge';
import Button from '../Button'
import {Policy, PolicyType, policyTypes, severities} from '../../types/policy.types';

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
    const [isActive, setIsActive] = useState(true);
    const [policyType, setPolicyType] = useState<PolicyType>('company');

    useEffect(() => {
        if (policy) {
            setName(policy.name);
            setDescription(policy.description);
            setIsActive(policy.is_active);
            setPolicyType(policy.policy_type);
        }
    }, [policy]);

    const handleSave = async () => {
        if (!policy) return;

        try {
            await onSave(policy.id, {
                id: policy.id,
                name,
                policy_type: policyType,
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
                    <Text
                        className="text-xl font-bold mb-4">{policy && policy.id === 0 ? 'Add Policy' : 'Edit Policy'}</Text>

                    <Text className="font-semibold mb-1 mt-2">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="h-auto p-2 mx-1 my-2"
                    />

                    <Text className="font-semibold mb-1 mt-2">Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="h-auto p-2 mx-1 my-2"
                        textAlignVertical="top"
                    />

                    {policy && policy.id !== 0 && (
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
                    )}

                    {policy && policy.id === 0 && (
                        <View className="flex-row flex-wrap mb-3 mx-1">
                            {policyTypes.map((pt) => (
                                <TouchableOpacity
                                    key={pt}
                                    onPress={() => setPolicyType(pt)}
                                    className="mr-2 mb-2"
                                >
                                    <Badge
                                        text={pt}
                                        variant={
                                            policyType === pt
                                            ? pt === "standard"
                                                    ? "amber"
                                                    : pt === "industry"
                                                        ? "blue"
                                                        : "green"
                                            : "gray"
                                        }
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

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
