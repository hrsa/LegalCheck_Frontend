import React, {useEffect} from 'react';
import Button from '../../src/components/Button';
import {View, Text, FlatList, Alert} from 'react-native';
import {useAuthStore} from '../../src/stores/authStore';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import {Document} from '../../src/types/document.types';
import {useDocumentStore} from "../../src/stores/documentStore";
import * as DocumentPicker from 'expo-document-picker';
import {useAnalysisResultStore} from "../../src/stores/analysisResultStore";
import {AnalysisResult} from "../../src/types/analysis_result.types";
import AnalysisResultItem from "../../src/components/analysis/AnalysisResultItem";

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

    useEffect(() => {
        if (currentDocument) {
            fetchAnalysisResults(currentDocument.id);
        }
    }, [fetchAnalysisResults, currentDocument]);

    return (
        <View style={{flex: 1, padding: 16}}>
            {currentDocument && (
                <View className="mb-4">
                    <Text className="text-2xl font-bold">Analysis Results</Text>
                    <Text className="text-gray-600">
                        Document: {currentDocument.filename}
                    </Text>
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

            {/*<EditPolicyModal*/}
            {/*    visible={editModalVisible}*/}
            {/*    policy={currentDocument}*/}
            {/*    onClose={() => setEditModalVisible(false)}*/}
            {/*    onSave={handleSaveDocument}*/}
            {/*    updating={updating}*/}
            {/*/>*/}
        </View>
    );
}
