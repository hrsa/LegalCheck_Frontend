import React from 'react';
import {View, Text} from 'react-native';
import Button from './Button'

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorMessage({
                                         message,
                                         onRetry,
                                         className = ''
                                     }: ErrorMessageProps) {
    return (
        <View className={`flex-1 justify-center items-center ${className}`}>
            <Text className="text-red-500 text-center mb-4">{message}</Text>
            {onRetry && (
                <Button
                    title="Retry"
                    onPress={onRetry}
                    className="mt-2"
                />
            )}
        </View>
    );
}