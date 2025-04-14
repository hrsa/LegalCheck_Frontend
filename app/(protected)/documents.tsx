import React, {useEffect} from 'react';
import Button from '../../src/components/Button';
import {View, Text, FlatList} from 'react-native';
import {useAuthStore} from '../../src/stores/authStore';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';
import {Document} from '../../src/types/document.types';
import {useDocumentStore} from "../../src/stores/documentStore";
import DocumentItem from "../../src/components/document/DocumentItem";
import * as DocumentPicker from 'expo-document-picker';
import { Notification, useNotification } from '../../src/components/Notification';

export default function DocumentsScreen() {
    const {user} = useAuthStore();
    const {
        documents,
        error,
        loading,
        updating,
        editModalVisible,
        setEditModalVisible,
        currentDocument,
        analyzeDocument,
        fetchDocuments,
        setCurrentDocument,
        uploadDocument
    } = useDocumentStore();

    const { notification, showNotification, hideNotification, showAlert } = useNotification();

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const openEditModal = (document: Document) => {
        setCurrentDocument(document);
        setEditModalVisible(true);
    };

    const handleCreateDocument = () => {
        setCurrentDocument({
            id: 0, // This will be replaced by the server
            filename: '',
            company_id: user!.company_id,
            is_processed: false,
            created_at: new Date().toISOString()
        });
        setEditModalVisible(true);
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'text/plain',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.oasis.opendocument.text',
                    'image/jpeg',
                    'image/png'
                ]
                ,
                copyToCacheDirectory: true
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];

            try {
                const fileToUpload = file.file
                    ? file.file 
                    : {
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType
                      };

                await uploadDocument(fileToUpload);
                showAlert('Success', 'Document uploaded successfully', 'success');
            } catch (error) {
                showAlert('Error', 'Failed to upload document. Please try again.', 'error');
                console.error('Upload error:', error);
            }
        } catch (err) {
            showAlert('Error', 'Failed to pick document. Please try again.', 'error');
            console.error('Document picker error:', err);
        }
    };

    return (
        <View style={{flex: 1, padding: 16}}>
            <Notification 
                type={notification.type || undefined}
                message={notification.message}
                visible={notification.visible}
                onDismiss={hideNotification}
            />

            <View
                style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    My Documents
                </Text>
                <Button
                    title="Add Document"
                    onPress={handlePickDocument}
                />
            </View>

            {loading ? (
                <LoadingIndicator/>
            ) : error ? (
                <ErrorMessage
                    message={error}
                    onRetry={fetchDocuments}
                />
            ) : (
                <FlatList
                    data={documents}
                    renderItem={({item}) => (
                        <DocumentItem
                            item={item}
                            analyze={() => analyzeDocument(item.id, null)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{paddingBottom: 20}}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-4">No documents found.</Text>
                    }
                />
            )}
        </View>
    );
}
