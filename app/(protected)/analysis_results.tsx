import React, {useEffect, useState} from 'react';
import Button from '../../src/components/Button';
import {View, Text, FlatList, Alert, TouchableOpacity, Modal} from 'react-native';
import {useAuthStore} from '../../src/stores/authStore';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import {useAnalysisResultStore} from "../../src/stores/analysisResultStore";
import AnalysisResultItem from "../../src/components/analysis/AnalysisResultItem";
import {useChecklistStore} from "../../src/stores/checklistStore";
import {Checklist} from "../../src/types/checklist.types";
import { Ionicons } from '@expo/vector-icons';

export default function AnalysisResultsScreen() {
    const {user} = useAuthStore();
    const {
        analysisResults,
        loading,
        error,
        currentDocument,
        fetchAnalysisResults,
        analyzeDocument,
        setCurrentDocument
    } = useAnalysisResultStore();
    const {checklists, loading: checklistsLoading, error: checklistsError, fetchChecklists} = useChecklistStore();

    const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        fetchChecklists();
    }, []);

    useEffect(() => {
        if (currentDocument) {
            fetchAnalysisResults(currentDocument.id);
        }
    }, [fetchAnalysisResults, currentDocument]);

    const handleAnalyze = () => {
        if (currentDocument && selectedChecklist) {
            analyzeDocument(currentDocument.id, selectedChecklist.id);
        } else if (currentDocument) {
            analyzeDocument(currentDocument.id, null);
        } else {
            Alert.alert("Error", "No document selected for analysis");
        }
    };


    return (
        <View style={{flex: 1, padding: 16}}>
            {currentDocument && (
                <View className="mb-4">
                    <Text className="text-2xl font-bold">Analysis Results</Text>
                    <Text className="text-gray-600">
                        Document: {currentDocument.filename}
                    </Text>

                    {/* Dropdown and Analyze Button */}
                    <View className="flex-row items-center mt-4">
                        <View className="w-fit mr-2 ml-auto">
                            <TouchableOpacity 
                                className="border border-gray-300 rounded-md py-2 flex flex-row items-center bg-white"
                                onPress={() => setDropdownVisible(true)}
                            >
                                <Text className="text-gray-700 self-start mx-2">
                                    {selectedChecklist ? selectedChecklist.name : "Select a checklist"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="gray" className="mr-2" />
                            </TouchableOpacity>

                            {/* Dropdown Modal */}
                            <Modal
                                visible={dropdownVisible}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setDropdownVisible(false)}
                            >
                                <TouchableOpacity 
                                    style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
                                    activeOpacity={1}
                                    onPress={() => setDropdownVisible(false)}
                                >
                                    <View className="bg-white rounded-md m-4 p-2 max-h-80" style={{margin: 'auto', width: 'auto', padding: 4, maxWidth: 800}}>
                                        <FlatList
                                            data={checklists}
                                            keyExtractor={(item) => item.id.toString()}
                                            ListHeaderComponent={
                                                <TouchableOpacity 
                                                    className="p-3 border-b border-gray-200"
                                                    onPress={() => {
                                                        setSelectedChecklist(null);
                                                        setDropdownVisible(false);
                                                    }}
                                                >
                                                    <Text className="text-gray-700">No checklist (default)</Text>
                                                </TouchableOpacity>
                                            }
                                            renderItem={({item}) => (
                                                <TouchableOpacity 
                                                    className="p-3 border-b border-gray-200"
                                                    onPress={() => {
                                                        setSelectedChecklist(item);
                                                        setDropdownVisible(false);
                                                    }}
                                                >
                                                    <Text className="text-gray-700">{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </View>

                        <Button
                            title="Analyze"
                            onPress={handleAnalyze}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>
                </View>
            )}

            {loading ? (
                <LoadingIndicator/>
            ) : error ? (
                <ErrorMessage
                    message={error}
                    onRetry={() => currentDocument && fetchAnalysisResults(currentDocument.id)}
                />
            ) : (
                <FlatList
                    data={analysisResults}
                    renderItem={({item}) => (
                        <AnalysisResultItem item={item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{paddingBottom: 20}}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-4">No analysis results found.</Text>
                    }
                />
            )}
        </View>
    );
}
