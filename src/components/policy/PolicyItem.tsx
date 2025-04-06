import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import {Policy, Rule} from '../../types/policy.types';
import RuleItem from './RuleItem';
import {usePolicyStore} from '../../stores/policyStore';

interface PolicyItemProps {
    item: Policy;
    onEdit: (policy: Policy) => void;
}

export default function PolicyItem({item, onEdit}: PolicyItemProps) {
    const [expanded, setExpanded] = useState(false);
    const {setCurrentRule, setRuleEditModalVisible} = usePolicyStore();

    const handleRuleEdit = (rule: Rule) => {
        setCurrentRule(rule);
        setRuleEditModalVisible(true);
    };

    const handleRuleCreate = () => {
        setCurrentRule({
            id: 0, // This will be replaced by the server
            policy_id: item.id,
            rule_type: 'requirement',
            description: '',
            severity: 'medium',
            keywords: [],
            created_at: new Date().toISOString(),
            updated_at: null
        });
        setRuleEditModalVisible(true);
    }

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const hasRules = item.rules && item.rules.length > 0;

    return (
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-bold">{item.name}</Text>
                    <Text className="text-gray-600 mt-1">{item.description}</Text>
                </View>
                <Button
                    title="Edit"
                    onPress={() => onEdit(item)}
                />
            </View>
            <View className="flex-row mt-3">
                <Badge
                    text={item.policy_type}
                    className="h-6"
                    variant={item.policy_type === 'standard'
                                ? 'amber'
                                : item.policy_type === "industry"
                                    ? 'blue'
                                    : 'green'
                    }
                />
                <Badge
                    text={item.is_active ? 'Active' : 'Inactive'}
                    variant={item.is_active ? 'green' : 'red'}
                    className="ml-2 h-6"
                />
                {hasRules ? (
                    <Button
                        title={`${expanded ? 'Hide Rules' : 'Show Rules'} (${item.rules.length})`}
                        onPress={toggleExpanded}
                        className="ml-auto"
                        variant="secondary"
                        textClassName="text-xs"
                    />
                ) : (
                    <Button
                        title="Add Rule"
                        onPress={handleRuleCreate}
                        className="ml-auto"
                        variant="success"
                        textClassName="text-xs"
                    />
                )}
            </View>

            {expanded && (
                <View className="mt-3 pt-3 border-t border-gray-200">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-medium">Rules:</Text>
                        <Button
                            title="Add Rule"
                            onPress={handleRuleCreate}
                        />
                    </View>
                    {hasRules ? (
                        item.rules.map((rule) => (
                            <RuleItem
                                key={rule.id}
                                rule={rule}
                                onEdit={handleRuleEdit}
                            />
                        ))
                    ) : (
                        <Text className="text-gray-500 text-center py-2">No rules found. Add a rule to get
                            started.</Text>
                    )}
                </View>
            )}
        </View>
    );
}
