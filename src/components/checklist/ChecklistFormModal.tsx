import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Modal, TouchableOpacity, ScrollView} from 'react-native';
import Button from '../Button';
import Badge from '../Badge';
import {Checklist, ChecklistType, checklistTypes} from '../../types/checklist.types';
import {usePolicyStore} from '../../stores/policyStore';
import {Rule} from '../../types/policy.types';
import RuleItem from '../policy/RuleItem';
import { useNotificationStore } from '../../stores/notificationStore';

interface ChecklistFormModalProps {
    visible: boolean;
    checklist: Partial<Checklist> | null;
    onClose: () => void;
    onDelete: (id: number) => Promise<void>;
    onSave: (data: Partial<Checklist>) => Promise<void>;
    updating: boolean;
}

export default function ChecklistFormModal({
                                               visible,
                                               checklist,
                                               onClose,
                                               onDelete,
                                               onSave,
                                               updating
                                           }: ChecklistFormModalProps) {
    const {policies} = usePolicyStore();

    const { showAlert } = useNotificationStore();

    const [name, setName] = useState('');
    const [type, setType] = useState<ChecklistType>('user');
    const [ruleset, setRuleset] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; type?: string; ruleset?: string }>({});

    // Get all rules from all policies
    const allRules = policies.flatMap(policy => policy.rules);

    // Filter rules based on search query and selected only toggle
    const filteredRules = allRules
        .filter(rule => {
            // Filter by search query
            const matchesSearch = !searchQuery ||
                rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rule.keywords.some(keyword =>
                    keyword.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Filter by selected only if enabled
            const matchesSelected = !showSelectedOnly || ruleset.includes(rule.id);

            return matchesSearch && matchesSelected;
        });

    useEffect(() => {
        if (checklist) {
            setName(checklist.name || '');
            setType(checklist.type || 'user');
            setRuleset(checklist.ruleset || []);
        } else {
            resetForm();
        }
    }, [checklist, visible]);

    const resetForm = () => {
        setName('');
        setType('user');
        setRuleset([]);
        setSearchQuery('');
        setShowSelectedOnly(false);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: { name?: string; type?: string; ruleset?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Checklist name is required';
        }

        if (!type) {
            newErrors.type = 'Checklist type is required';
        }

        if (ruleset.length === 0) {
            newErrors.ruleset = 'At least one rule must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await onSave({
                name,
                type,
                ruleset
            });

            onClose();
            resetForm();
        } catch (error) {
            showAlert('Error', 'Failed to save checklist. Please try again.', 'error');
        }
    };

    const handleDelete = async () => {
        if (!checklist || !checklist.id) {
            return;
        }
        try {
            await onDelete(checklist.id);
            onClose();
            resetForm();
        } catch (error) {
            showAlert('Error', 'Failed to delete checklist. Please try again.', 'error');
        }
    }

    const toggleRule = (rule: Rule) => {
        if (ruleset.includes(rule.id)) {
            setRuleset(ruleset.filter(id => id !== rule.id));
        } else {
            setRuleset([...ruleset, rule.id]);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                activeOpacity={1}
                onPress={onClose}
                className="flex-1 justify-center items-center bg-black bg-opacity-50"
            >
                <TouchableOpacity 
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    className="bg-white rounded-lg p-6 w-11/12 max-h-4/5"
                    style={{padding: 24, width: '70%', cursor: 'auto'}}
                >
                    <Text className="text-xl font-bold mb-4">
                        {checklist && checklist.id ? 'Edit Checklist' : 'Create Checklist'}
                    </Text>

                    <View className="mb-4">
                        <Text className="text-gray-700 mb-1">Name</Text>
                        <TextInput
                            className={`border rounded-md p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter checklist name"
                        />
                        {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-700 mb-1">Type</Text>
                        <View className="flex-row">
                            {checklistTypes.map((checklistType) => (
                                <TouchableOpacity
                                    key={checklistType}
                                    onPress={() => setType(checklistType)}
                                    className="mr-2"
                                >
                                    <Badge
                                        text={checklistType}
                                        variant={type === checklistType ? 'blue' : 'gray'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.type && <Text className="text-red-500 text-xs mt-1">{errors.type}</Text>}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2">Rules</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2 mb-2 placeholder:text-gray-400"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search rules..."
                        />

                        {errors.ruleset && <Text className="text-red-500 text-xs mb-2">{errors.ruleset}</Text>}

                        <Text className="text-gray-700 mb-1">Selected Rules: {ruleset.length}</Text>
                        <TouchableOpacity
                            onPress={() => setShowSelectedOnly(!showSelectedOnly)}
                            className="flex-row items-center"
                        >
                            <Badge text="Show selected rules only" variant={showSelectedOnly ? 'green' : 'gray'}/>
                        </TouchableOpacity>

                        <View style={{flex: 1, minHeight: 450, maxHeight: 450, padding: 16}}>
                            <ScrollView className="border border-gray-200 rounded-md p-2"
                            >
                                {filteredRules.map((rule) => (
                                    <TouchableOpacity
                                        key={rule.id}
                                        onPress={() => toggleRule(rule)}
                                        className="mb-2"
                                    >
                                        <RuleItem
                                            rule={rule}
                                            onEdit={() => {
                                            }}
                                            editable={false}
                                            colorType={`${ruleset.includes(rule.id) ? 'green' : ''}`}
                                        />
                                    </TouchableOpacity>
                                ))}

                                {filteredRules.length === 0 && (
                                    <Text className="text-gray-500 text-center py-4">No rules found</Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="flex-row justify-center mt-4">
                        {checklist && checklist.id && (<Button
                            title="Delete Checklist"
                            variant="danger"
                            onPress={handleDelete}
                            className="mr-2"
                        />)}
                        <Button
                            title="Cancel"
                            variant="transparent"
                            onPress={onClose}
                            className="mr-2"
                        />
                        <Button
                            title={updating ? 'Saving...' : 'Save'}
                            onPress={handleSave}
                            loading={updating}
                            disabled={updating}
                        />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
