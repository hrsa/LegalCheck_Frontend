import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Notification } from './Notification';
import { useNotificationStore } from '../stores/notificationStore';

export const GlobalNotification = () => {
  const { type, message, visible, hideNotification } = useNotificationStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible, hideNotification]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.notificationContainer}>
        <Notification
          type={type || undefined}
          message={message}
          visible={visible}
          onDismiss={hideNotification}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  notificationContainer: {
    width: '80%',
    maxWidth: 400,
  }
});
