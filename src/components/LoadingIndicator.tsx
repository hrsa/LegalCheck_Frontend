import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export default function LoadingIndicator({ 
  size = 'large', 
  color = '#0000ff',
  className = ''
}: LoadingIndicatorProps) {
  return (
    <View className={`flex-1 justify-center items-center ${className}`}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}