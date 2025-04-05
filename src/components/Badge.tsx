import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 
  | 'green' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'blue' 
  | 'purple' 
  | 'pink' 
  | 'indigo' 
  | 'teal' 
  | 'cyan' 
  | 'lime' 
  | 'amber' 
  | 'gray' 
  | 'slate';

interface BadgeProps {
  text: string;
  variant: BadgeVariant;
  className?: string;
}

export default function Badge({ text, variant, className = '' }: BadgeProps) {
  const getStyles = (variant: BadgeVariant) => {
    const styles = {
      bg: '',
      text: ''
    };

    switch (variant) {
      case 'green':
        styles.bg = 'bg-green-100';
        styles.text = 'text-green-800';
        break;
      case 'red':
        styles.bg = 'bg-red-100';
        styles.text = 'text-red-800';
        break;
      case 'orange':
        styles.bg = 'bg-orange-100';
        styles.text = 'text-orange-800';
        break;
      case 'yellow':
        styles.bg = 'bg-yellow-100';
        styles.text = 'text-yellow-800';
        break;
      case 'blue':
        styles.bg = 'bg-blue-100';
        styles.text = 'text-blue-800';
        break;
      case 'purple':
        styles.bg = 'bg-purple-100';
        styles.text = 'text-purple-800';
        break;
      case 'pink':
        styles.bg = 'bg-pink-100';
        styles.text = 'text-pink-800';
        break;
      case 'indigo':
        styles.bg = 'bg-indigo-100';
        styles.text = 'text-indigo-800';
        break;
      case 'teal':
        styles.bg = 'bg-teal-100';
        styles.text = 'text-teal-800';
        break;
      case 'cyan':
        styles.bg = 'bg-cyan-100';
        styles.text = 'text-cyan-800';
        break;
      case 'lime':
        styles.bg = 'bg-lime-100';
        styles.text = 'text-lime-800';
        break;
      case 'amber':
        styles.bg = 'bg-amber-100';
        styles.text = 'text-amber-800';
        break;
      case 'gray':
        styles.bg = 'bg-gray-100';
        styles.text = 'text-gray-800';
        break;
      case 'slate':
        styles.bg = 'bg-slate-100';
        styles.text = 'text-slate-800';
        break;
      default:
        styles.bg = 'bg-gray-100';
        styles.text = 'text-gray-800';
    }

    return styles;
  };

  const styles = getStyles(variant);

  return (
    <View className={`px-2 py-1 rounded ${styles.bg} ${className}`}>
      <Text className={`text-xs ${styles.text}`}>
        {text}
      </Text>
    </View>
  );
}