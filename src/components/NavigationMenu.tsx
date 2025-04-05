import React from 'react';
import { View } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Button from './Button';

export default function NavigationMenu() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navItems = [
        { title: 'Home', path: '/home' },
        { title: 'My Policies', path: '/policies' },
    ];

    return (
        <View className="flex-row bg-gray-100 p-4 border-b border-gray-200">
            {navItems.map((item) => (
                <Link href={item.path} key={item.path} asChild>
                    <Button 
                        title={item.title}
                        variant={isActive(item.path) ? 'primary' : 'transparent'}
                        className={`mx-2`}
                    />
                </Link>
            ))}
        </View>
    );
}
