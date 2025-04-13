import {create} from "zustand";
import {ChatMessage, ChatState, Conversation} from "../types/chat.types";
import * as ChatAPI from "../services/api/chat";
import websocketService from "../services/api/websocket";
import {WebSocketEventType} from "../types/websocket.types";

export const useChatStore = create<ChatState>((set, get) => ({
    conversation: null,
    loading: false,
    error: null,
    sending: false,

    wsConnected: false,
    wsConnecting: false,
    currentConversationId: null,

    fetchMessages: async (documentId: number) => {
        set({loading: true, error: null});
        try {
            const conversation = await ChatAPI.fetchMessages(documentId);
            set({conversation: conversation});
        } catch (err: any) {
            console.error('Error fetching chat messages:', err);
            set({error: 'Failed to load chat messages. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },

    updateConversation: async (title: string) => {
        set({loading: true, error: null});
        try {
            const {conversation} = get();
            if (conversation) {
                const updatedConversation = {
                    ...conversation,
                    title: title
                };

                set({
                    conversation: updatedConversation
                });
                console.log('Updated conversation:', updatedConversation);

                await ChatAPI.updateConversation(updatedConversation);
            }
        } catch (err: any) {
            console.error('Error updating conversation:', err);
            set({error: 'Failed to update conversation. Please try again later.'});
        } finally {
            set({loading: false});
        }
    },

    addMessage: (chatMessage: ChatMessage) => {
        const {conversation} = get();
        if (conversation) {
            set({
                conversation: {
                    ...conversation,
                    messages: [...conversation.messages, chatMessage]
                }
            });
        }
    },

    sendMessage: async (documentId: number, content: string) => {
        set({sending: true});
        try {
            const {conversation, wsConnected, currentConversationId} = get();

            if (!conversation) {
                console.error('No active conversation');
                set({error: 'No active conversation. Please refresh the page.'});
                return Promise.reject('No active conversation');
            }

            const tempUserMessage: ChatMessage = {
                conversation_id: conversation.id,
                content: content,
                author: "User",
                created_at: new Date().toISOString(),
                id: Math.floor(Math.random() * 1000) + 1,
            };

            if (wsConnected && currentConversationId === conversation.id) {
                console.log('Sending message via WebSocket');

                const wsMessage = {
                    type: WebSocketEventType.NEW_MESSAGE,
                    conversation_id: conversation.id,
                    content: content,
                    timestamp: new Date().toISOString()
                };

                websocketService.send(wsMessage);

                return Promise.resolve();
            } else {
                console.log('WebSocket not connected, falling back to REST API');

                get().addMessage(tempUserMessage);

                // Fall back to REST API
                const newMessage = await ChatAPI.sendMessage(documentId, content);

                if (conversation) {
                    get().addMessage(newMessage);
                }

                return Promise.resolve();
            }
        } catch (err: any) {
            console.error('Error sending chat message:', err);
            set({error: 'Failed to send message. Please try again.'});
            return Promise.reject('Failed to send message. Please try again.');
        } finally {
            set({sending: false});
        }
    },

    pingWebSocket: () => {
        const {wsConnected, currentConversationId} = get();

        if (wsConnected && currentConversationId) {
            websocketService.send({
                type: WebSocketEventType.PING,
                conversation_id: currentConversationId,
                timestamp: new Date().toISOString()
            });
        }
    },


    connectWebSocket: async (conversationId: number) => {
        // If already connected to this conversation, do nothing
        if (get().wsConnected && get().currentConversationId === conversationId) {
            console.log('WebSocket already connected to this conversation');
            return true;
        }

        // If connecting, wait
        if (get().wsConnecting) {
            console.log('WebSocket connection in progress');
            return false;
        }

        set({wsConnecting: true});

        try {
            // Register message handlers before connecting
            websocketService.on(WebSocketEventType.HISTORY, (payload: Conversation) => {
                set({conversation: payload});
            });

            websocketService.on(WebSocketEventType.NEW_MESSAGE, (payload: ChatMessage) => {
                console.log('WebSocket new message processing here:', payload);
                const {conversation} = get();
                if (conversation) {
                    set({
                        conversation: {
                            ...conversation,
                            messages: [...conversation.messages, payload]
                        }
                    });
                }
            });

            websocketService.on(WebSocketEventType.PONG, (payload: any) => {
                console.log('WebSocket pong message:', payload);
            })

            websocketService.on(WebSocketEventType.ERROR, (payload: any) => {
                console.error('WebSocket error message:', payload);
                set({error: payload.message || 'WebSocket error occurred'});
            });

            // Connect to WebSocket
            const connected = await websocketService.connect(conversationId);

            if (!connected) {
                set({
                    error: 'Failed to connect to WebSocket. Please try again later.',
                    wsConnecting: false
                });
                return false;
            }

            set({
                wsConnected: true,
                wsConnecting: false,
                currentConversationId: conversationId
            });

            return true;
        } catch (error) {
            console.error('Error in connectWebSocket:', error);
            set({
                error: 'Failed to connect to WebSocket. Please try again later.',
                wsConnecting: false,
                wsConnected: false,
                currentConversationId: null
            });
            return false;
        }
    },

    disconnectWebSocket: async () => {
        // Only disconnect if connected
        if (!get().wsConnected) {
            return;
        }

        try {
            await websocketService.disconnect();
            set({
                wsConnected: false,
                wsConnecting: false,
                currentConversationId: null
            });
        } catch (error) {
            console.error('Error disconnecting WebSocket:', error);
        }
    },

    initializeChat: async (documentId: number) => {
        set({loading: true, error: null});

        try {
            const conversation = await ChatAPI.fetchMessages(documentId);
            set({conversation});

            if (conversation?.id) {
                await get().connectWebSocket(conversation.id);
            }
        } catch (err: any) {
            console.error('Error initializing chat:', err);
            set({error: 'Failed to initialize chat. Please try again later.'});
        } finally {
            set({loading: false});
        }
    }
}));
