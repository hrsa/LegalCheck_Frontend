import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {IoniconsName} from "../types/navigation.types";



interface ButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | "success" | "transparent";
    className?: string;
    textClassName?: string;
    icon?: IoniconsName;
    iconSize?: number;
}

export default function Button({
                                   title,
                                   loading = false,
                                   variant = 'primary',
                                   className = '',
                                   textClassName = '',
                                   disabled,
                                   icon,
                                   iconSize = 24,
                                   ...props
                               }: ButtonProps) {
    const baseButtonStyles = 'rounded-md py-2 px-4 font-black flex-row justify-center items-center';

    const variantStyles = {
        primary: 'bg-blue-500',
        secondary: 'bg-violet-500',
        danger: 'bg-red-500',
        success: 'bg-green-500',
        transparent: 'bg-transparent',
    };

    const disabledStyle = (disabled || loading) ? 'opacity-50' : '';

    let baseTextStyles = 'font-medium text-center';

    if (variant === 'transparent') {
        baseTextStyles += ' text-black';
    } else baseTextStyles += ' text-white';

    return (
        <TouchableOpacity
            className={`${baseButtonStyles} ${variantStyles[variant]} ${disabledStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="white"/>
            ) : (
                <>
                    {icon && (
                        <Ionicons 
                            name={icon} 
                            size={iconSize} 
                            color={variant === 'transparent' ? 'black' : 'white'} 
                            style={{ marginRight: title ? 8 : 0 }}
                        />
                    )}
                    {title && (
                        <Text className={`${baseTextStyles} ${textClassName}`}>{title}</Text>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
}
