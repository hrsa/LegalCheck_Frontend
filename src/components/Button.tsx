import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | "success" | "transparent";
    className?: string;
    textClassName?: string;
}

export default function Button({
                                   title,
                                   loading = false,
                                   variant = 'primary',
                                   className = '',
                                   textClassName = '',
                                   disabled,
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
                <Text className={`${baseTextStyles} ${textClassName}`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}