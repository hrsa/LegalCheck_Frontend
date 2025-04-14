import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { Alert } from 'react-native';

export type NotificationType = 'success' | 'error' | 'warning';

interface NotificationProps {
    type?: NotificationType;
    message: string;
    visible: boolean;
    onDismiss?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
    type = 'success', 
    message, 
    visible, 
    onDismiss 
}) => {
    useEffect(() => {
        if (visible && onDismiss) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [visible, onDismiss]);

    if (!visible) return null;

    return (
        <View 
            className={`p-4 mb-4 rounded-lg ${
                type === 'success' ? 'bg-green-100 border-green-500' : 
                type === 'error' ? 'bg-red-100 border-red-500' : 
                'bg-yellow-100 border-yellow-500'
            } border`}
        >
            <Text 
                className={`${
                    type === 'success' ? 'text-green-700' : 
                    type === 'error' ? 'text-red-700' : 
                    'text-yellow-700'
                } font-medium`}
            >
                {type === 'success' ? 'Success: ' : 
                 type === 'error' ? 'Error: ' : 
                 'Warning: '}{message}
            </Text>
        </View>
    );
};

export const useNotification = () => {
    const [notification, setNotification] = useState<{
        type: NotificationType | null;
        message: string;
        visible: boolean;
    }>({
        type: null,
        message: '',
        visible: false
    });

    const showNotification = (type: NotificationType, message: string) => {
        setNotification({
            type,
            message,
            visible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, visible: false }));
    };

    const showAlert = (title: string, message: string, type: NotificationType = 'error') => {
        if (Platform.OS === 'web') {
            showNotification(type, message);
        } else {
            Alert.alert(title, message);
        }
    };

    return {
        notification,
        showNotification,
        hideNotification,
        showAlert
    };
};