import {create} from "zustand";
import {ChatMessage, ChatState, Conversation} from "../types/chat.types";
import * as ChatAPI from "../services/api/chat";

export const useChatStore = create<ChatState>((set, get) => ({
    conversation: null,
    loading: false,
    error: null,
    sending: false,

    fetchMessages: async (documentId: number) => {
        set({loading: true, error: null});
        try {
            const conversation = await ChatAPI.fetchMessages(documentId);
            set({conversation: conversation || null});
        } catch (err: any) {
            if (err.status === 404) {
                set({error: null});
            } else {
                console.error('Error fetching chat messages:', err);
                set({error: 'Failed to load chat messages. Please try again later.'});
            }
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
            const {conversation} = get();

            if (conversation) {
                let userMessage: ChatMessage = {
                    conversation_id: conversation.id,
                    content: content,
                    author: "User",
                    created_at: Date().toString(),
                    id: Math.floor(Math.random() * 1000) + 1,
                }
                get().addMessage(userMessage);
            }

            const newMessage = await ChatAPI.sendMessage(documentId, content);

            if (conversation) {
                get().addMessage(newMessage);
            } else {
                console.error('Received message but no conversation exists');
            }

            return Promise.resolve();
        } catch (err: any) {
            console.error('Error sending chat message:', err);
            set({error: 'Failed to send message. Please try again.'});
            return Promise.reject('Failed to send message. Please try again.');
        } finally {
            set({sending: false});
        }
    },

    // connectWebSocket: (documentId: number) => {
    //     // Create a WebSocket connection
    //     const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    //     const wsHost = window.location.host;
    //     const wsUrl = `${wsProtocol}//${wsHost}/ws/documents/${documentId}/chat`;
    //
    //     const socket = new WebSocket(wsUrl);
    //
    //     socket.onopen = () => {
    //         console.log('WebSocket connection established');
    //     };
    //
    //     socket.onmessage = (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             const {conversation} = get();
    //
    //             // Check if the data is a Conversation object or a ChatMessage
    //             if (data.messages && Array.isArray(data.messages)) {
    //                 // It's a Conversation object, update our conversation
    //                 set({conversation: data as Conversation});
    //             } else if (conversation) {
    //                 // It's a ChatMessage object, add it to our conversation
    //                 const newMessage = data as ChatMessage;
    //                 set({
    //                     conversation: {
    //                         ...conversation,
    //                         messages: [...conversation.messages, newMessage]
    //                     }
    //                 });
    //             } else {
    //                 console.error('Received message but no conversation exists');
    //             }
    //         } catch (err) {
    //             console.error('Error parsing WebSocket message:', err);
    //         }
    //     };
    //
    //     socket.onerror = (error) => {
    //         console.error('WebSocket error:', error);
    //         set({error: 'WebSocket connection error. Please try again later.'});
    //     };
    //
    //     socket.onclose = () => {
    //         console.log('WebSocket connection closed');
    //     };
    //
    //     // Store the socket in a global variable so we can close it later
    //     (window as any).chatSocket = socket;
    // },
    //
    // disconnectWebSocket: () => {
    //     // Close the WebSocket connection if it exists
    //     if ((window as any).chatSocket) {
    //         (window as any).chatSocket.close();
    //         (window as any).chatSocket = null;
    //     }
    // }
}));
