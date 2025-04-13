import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
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

    const { 
        conversation, 
        loading, 
        error, 
        sending, 
        wsConnected,
        wsConnecting,
        currentConversationId,
        initializeChat, 
        sendMessage, 
        disconnectWebSocket,
        updateConversation
    } = useChatStore();
    const { currentDocument, fetchDocument } = useDocumentStore();

    const [messageText, setMessageText] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Single useEffect for initialization and cleanup
    useEffect(() => {
        if (!documentId) return;

        // Initialize chat and document
        const initialize = async () => {
            try {
                // Fetch document and messages in sequence to ensure we have the document first
                await fetchDocument(documentId);
                await initializeChat(documentId);
            } catch (error) {
                console.error('Failed to initialize chat:', error);
            }
        };

        initialize();

        // Cleanup on unmount
        return () => {
            console.log('Disconnecting WebSocket from cleanup function');
            // We need to use a separate function because cleanup functions can't be async
            const disconnect = async () => {
                try {
                    await disconnectWebSocket();
                    console.log('WebSocket disconnected successfully from cleanup');
                } catch (error) {
                    console.error('Error disconnecting WebSocket from cleanup:', error);
                }
            };

            // Execute the disconnect function
            disconnect();
        };
    }, [documentId, fetchDocument, initializeChat, disconnectWebSocket]);

    // Update titleText when conversation changes
    useEffect(() => {
        if (conversation?.title) {
            setTitleText(conversation.title);
        } else if (currentDocument) {
            setTitleText(`Chat about: ${currentDocument.filename}`);
        }
    }, [conversation, currentDocument]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !documentId || !wsConnected) return;

        try {
            await sendMessage(documentId, messageText);
            setMessageText('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleUpdateTitle = async () => {
        if (!titleText.trim() || !conversation) return;

        try {
            await updateConversation(titleText);
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Failed to update title:', error);
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
                        {isEditingTitle ? (
                            <View className="flex-row items-center">
                                <TextInput
                                    className="flex-1 p-2 bg-white border border-gray-300 rounded-lg mr-2"
                                    value={titleText}
                                    onChangeText={setTitleText}
                                    autoFocus
                                />
                                <Button
                                    title="Update"
                                    onPress={handleUpdateTitle}
                                    disabled={!titleText.trim()}
                                />
                                <TouchableOpacity 
                                    className="ml-2 p-2" 
                                    onPress={() => {
                                        setIsEditingTitle(false);
                                        // Reset to original title if canceled
                                        if (conversation?.title) {
                                            setTitleText(conversation.title);
                                        } else if (currentDocument) {
                                            setTitleText(`Chat about: ${currentDocument.filename}`);
                                        }
                                    }}
                                >
                                    <Text className="text-red-500">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                                <Text className="text-xl font-bold">
                                    {conversation?.title || `Chat about: ${currentDocument.filename}`}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                    (Click to edit title)
                                </Text>
                            </TouchableOpacity>
                        )}

                        {wsConnected && currentConversationId && (
                            <Text className="text-xs text-green-500 mt-1">Connected to chat (ID: {currentConversationId})</Text>
                        )}
                        {wsConnecting && (
                            <View className="flex-row items-center mt-1">
                                <ActivityIndicator size="small" color="#F59E0B" />
                                <Text className="text-xs text-yellow-500 ml-1">
                                    Connecting to chat...
                                </Text>
                            </View>
                        )}
                        {!wsConnected && !wsConnecting && (
                            <Text className="text-xs text-red-500 mt-1">
                                Not connected to chat. 
                                <Text 
                                    className="text-blue-500 underline ml-1"
                                    onPress={() => initializeChat(documentId, currentDocument.filename)}
                                >
                                    Reconnect
                                </Text>
                            </Text>
                        )}
                    </View>
                )}

                {loading ? (
                    <LoadingIndicator />
                ) : error ? (
                    <ErrorMessage 
                        message={error}
                        onRetry={() => initializeChat(documentId)}
                    />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={conversation?.messages || []}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        className="flex-1"
                        onContentSizeChange={() => {
                            if (conversation && conversation?.messages?.length > 0) {
                                setTimeout(() => {
                                    flatListRef.current?.scrollToEnd({ animated: true });
                                }, 100);
                            }
                        }}

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
                        disabled={sending || !messageText.trim() || !wsConnected}
                        loading={sending}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
