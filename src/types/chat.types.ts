export type MessageAuthor = "User" | "LegalCheck"

export interface ChatMessage {
    id: number;
    content: string;
    conversation_id: number;
    author: MessageAuthor;
    created_at: string;
}

export interface Conversation {
    document_id: number;
    user_id: number;
    title: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    messages: ChatMessage[];
}

export interface ChatState {
    conversation: Conversation | null;
    loading: boolean;
    error: string | null;
    sending: boolean;

    wsConnected: boolean;
    wsConnecting: boolean;
    currentConversationId: number | null;

    fetchMessages: (documentId: number) => Promise<void>;
    addMessage: (chatMessage: ChatMessage) => void;
    sendMessage: (documentId: number, content: string) => Promise<void>;
    connectWebSocket: (conversationId: number) => Promise<boolean>;
    pingWebSocket: () => void;
    disconnectWebSocket: () => Promise<void>;

    initializeChat: (documentId: number) => Promise<void>;
}


