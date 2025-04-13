import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatStore } from '../../src/stores/chatStore';
import { useDocumentStore } from '../../src/stores/documentStore';
import { ChatMessage } from '../../src/types/chat.types';
import Button from '../../src/components/Button';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import ErrorMessage from '../../src/components/ErrorMessage';

export default function ChatScreen() {
    const { document_id } = useLocalSearchParams<{ document_id: string }>();
    const documentId = parseInt(document_id || '0', 10);

    const { conversation, loading, error, sending, fetchMessages, sendMessage } = useChatStore();
    const { currentDocument, fetchDocument } = useDocumentStore();

    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Fetch documents if not already loaded
    useEffect(() => {
        if (!currentDocument) {
            fetchDocument(documentId);
        }
    }, [currentDocument, fetchDocument]);

    // Fetch messages and connect to WebSocket when component mounts
    useEffect(() => {
        if (documentId) {
            fetchMessages(documentId);
            // connectWebSocket(documentId);
        }

        // Disconnect from WebSocket when component unmounts
        // return () => {
        //     disconnectWebSocket();
        // };
    }, [documentId, fetchMessages,
        // connectWebSocket, disconnectWebSocket
    ]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (conversation && conversation?.messages?.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [conversation?.messages?.length]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !documentId) return;

        try {
            await sendMessage(documentId, messageText);
            setMessageText('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.author === 'User';

        return (
            <View 
                className={`p-3 rounded-lg mb-2 max-w-3/4 ${isUser ? 'bg-blue-500 self-end' : 'bg-gray-200 self-start'}`}
            >
                <Text className={isUser ? 'text-white' : 'text-gray-800'}>
                    {item.content}
                </Text>
                <Text className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(item.created_at).toLocaleTimeString()}
                </Text>
            </View>
        );
    };

    if (!documentId) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 text-center">Invalid document ID</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={100}
        >
            <View className="flex-1 p-4">
                {currentDocument && (
                    <View className="mb-4">
                        <Text className="text-xl font-bold">Chat about: {currentDocument.filename}</Text>
                    </View>
                )}

                {loading ? (
                    <LoadingIndicator />
                ) : error ? (
                    <ErrorMessage 
                        message={error}
                        onRetry={() => fetchMessages(documentId)}
                    />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={conversation?.messages || []}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        className="flex-1"
                        ListEmptyComponent={
                            <Text className="text-center text-gray-500 mt-4">
                                No messages yet. Start the conversation!
                            </Text>
                        }
                    />
                )}

                <View className="flex-row items-center mt-2 border border-gray-300 rounded-lg overflow-hidden">
                    <TextInput
                        className="flex-1 p-3 bg-white"
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder="Type a message..."
                        multiline
                    />
                    <Button
                        title="Send"
                        onPress={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        loading={sending}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
