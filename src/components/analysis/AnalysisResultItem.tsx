import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnalysisResult } from '../../types/analysis_result.types';
import { Ionicons } from '@expo/vector-icons';

interface AnalysisResultItemProps {
    item: AnalysisResult;
}

interface CollapsibleSectionProps {
    title: string;
    count: number;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, count, children }) => {
    const [expanded, setExpanded] = useState(false);

    if (count === 0) return null;

    return (
        <View className="mb-4">
            <TouchableOpacity 
                className="flex-row justify-between items-center bg-gray-100 p-3 rounded-lg"
                onPress={() => setExpanded(!expanded)}
            >
                <Text className="font-bold text-lg">{title} ({count})</Text>
                <Ionicons 
                    name={expanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="black" 
                />
            </TouchableOpacity>
            
            {expanded && (
                <View className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                    {children}
                </View>
            )}
        </View>
    );
};

export default function AnalysisResultItem({ item }: AnalysisResultItemProps) {
    return (
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <View className="mb-4">
                <Text className="text-xl font-bold">{item.title || 'Untitled Analysis'}</Text>
                {item.company_name && (
                    <Text className="text-gray-600 mt-1">Company: {item.company_name}</Text>
                )}
                <Text className="text-gray-500 text-sm mt-1">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>

            <CollapsibleSection title="Risks" count={item.risks.length}>
                {item.risks.map((risk, index) => (
                    <View key={index} className="mb-3 pb-3 border-gray-100 last:border-0">
                        <Text className="font-bold">{risk.risk_type}</Text>
                        <Text className="mt-1">{risk.detail}</Text>
                    </View>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Conflicts" count={item.conflicts.length}>
                {item.conflicts.map((conflict, index) => (
                    <View key={index} className="mb-3 pb-3 border-gray-100 last:border-0">
                        <Text className="font-bold">{conflict.policy_name}</Text>
                        <Text className="mt-1">{conflict.conflict_detail}</Text>
                    </View>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Missing Clauses" count={item.missing_clauses.length}>
                {item.missing_clauses.map((clause, index) => (
                    <View key={index} className="mb-3 pb-3 border-gray-100 last:border-0">
                        <Text className="font-bold">{clause.clause_name}</Text>
                        <Text className="mt-1">{clause.suggestion}</Text>
                    </View>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Suggestions" count={item.suggestions.length}>
                {item.suggestions.map((suggestion, index) => (
                    <View key={index} className="mb-3 pb-3 border-gray-100 last:border-0">
                        <Text className="font-bold">{suggestion.title}</Text>
                        <Text className="mt-1">{suggestion.details}</Text>
                    </View>
                ))}
            </CollapsibleSection>

            <CollapsibleSection title="Payment Terms" count={item.payment_terms.length}>
                {item.payment_terms.map((term, index) => (
                    <View key={index} className="mb-3 pb-3 border-gray-100 last:border-0">
                        {term.title && <Text className="font-bold">{term.title}</Text>}
                        
                        <View className="mt-2">
                            {term.due_date && (
                                <Text className="mb-1">Due Date: {term.due_date}</Text>
                            )}
                            {term.payment_method && (
                                <Text className="mb-1">Method: {term.payment_method}</Text>
                            )}
                            {term.amount_due !== null && (
                                <Text className="mb-1">
                                    Amount: {term.amount_due} {term.currency || ''}
                                </Text>
                            )}
                            {term.penalties && (
                                <Text className="mb-1">Penalties: {term.penalties}</Text>
                            )}
                            {term.discount && (
                                <Text className="mb-1">Discount: {term.discount}</Text>
                            )}
                            {term.notes && (
                                <Text className="mb-1">Notes: {term.notes}</Text>
                            )}
                        </View>
                    </View>
                ))}
            </CollapsibleSection>
        </View>
    );
}