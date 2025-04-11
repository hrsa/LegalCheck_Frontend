import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Badge from '../Badge';
import Button from '../Button';
import {Document} from '../../types/document.types';
import {useAnalysisResultStore} from '../../stores/analysisResultStore';
import {router} from 'expo-router';

interface DocumentItemProps {
    item: Document;
    analyze: (documentId: number) => void;
}

export default function DocumentItem({item, analyze}: DocumentItemProps) {
    const [expanded, setExpanded] = useState(false);
    const { setCurrentDocument } = useAnalysisResultStore();

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm mb-4"
        onPress={() => {
            if (item.is_processed) {
                setCurrentDocument(item);
                router.push('/analysis_results');
            }
        }}>
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-bold">{item.filename}</Text>
                    <Text className="text-gray-600 mt-1">{item.filename}</Text>
                </View>
                {!item.is_processed && (
                    <Button
                        title="Analyze"
                        onPress={() => analyze(item.id)}
                    />
                )}
            </View>
            <View className="flex-row mt-3">
                <Badge
                    text={item.is_processed ? 'Processed' : 'Not Processed'}
                    className="h-6"
                    variant={item.is_processed ? 'green' : 'red'}
                />
            </View>
        </TouchableOpacity>
    );
}
