import { create } from "zustand";
import { NotificationType } from "../components/Notification";
import { Alert, Platform } from "react-native";

interface NotificationState {
  type: NotificationType | null;
  message: string;
  visible: boolean;
  showNotification: (type: NotificationType, message: string) => void;
  hideNotification: () => void;
  showAlert: (title: string, message: string, type?: NotificationType) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  type: null,
  message: "",
  visible: false,
  
  showNotification: (type, message) => {
    set({
      type,
      message,
      visible: true
    });
  },
  
  hideNotification: () => {
    set({ visible: false });
  },
  
  showAlert: (title, message, type = 'error') => {
    if (Platform.OS === 'web') {
      set({
        type,
        message,
        visible: true
      });
    } else {
      Alert.alert(title, message);
    }
  }
}));