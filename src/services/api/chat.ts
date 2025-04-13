import apiClient from "./apiClient";
import {ChatMessage, Conversation} from "../../types/chat.types";

export const fetchMessages = async (documentId: number) => {
  const response = await apiClient.get(`/documents/${documentId}/chat`, {
    withCredentials: true,
  });
  return response.data as Conversation;
};

export const updateConversation = async (conversation: Conversation) => {
  const response = await apiClient.patch(`/conversations/${conversation.id}`, conversation);
  return response.data as Conversation;
}

export const sendMessage = async (documentId: number, content: string) => {
  const formData = new FormData();
  formData.append('message', content);
  
  const response = await apiClient.post(`/documents/${documentId}/chat`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data as ChatMessage;
};