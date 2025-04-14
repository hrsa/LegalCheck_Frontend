import { router } from "expo-router";
import { useNotificationStore } from "../stores/notificationStore";
import { NotificationType } from "../components/Notification";

/**
 * Navigate to a path and show a notification on the destination page
 * @param path The path to navigate to
 * @param notificationType The type of notification to show
 * @param message The message to display in the notification
 */
export const navigateWithNotification = (
  path: string, 
  notificationType: NotificationType, 
  message: string
) => {
  // Access the store directly instead of using the hook
  useNotificationStore.getState().showNotification(notificationType, message);
  router.replace(path);
};
