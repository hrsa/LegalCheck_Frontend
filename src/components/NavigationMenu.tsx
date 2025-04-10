import React, { useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

export default function NavigationMenu() {
    const pathname = usePathname();
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const menuWidth = new Animated.Value(isMenuVisible ? 200 : 50);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
        Animated.timing(menuWidth, {
            toValue: !isMenuVisible ? 200 : 50,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navItems = [
        { title: 'Home', path: '/home' },
        { title: 'My Policies', path: '/policies' },
    ];

    return (
        <Animated.View 
            style={{ width: menuWidth }}
            className="flex-col bg-gray-100 p-4 border-r border-gray-200 h-full"
        >
            <TouchableOpacity 
                onPress={toggleMenu} 
                className="self-end mb-4"
            >
                <Ionicons 
                    name={isMenuVisible ? "menu-outline" : "menu"} 
                    size={36}
                    color="black"
                />
            </TouchableOpacity>

            {navItems.map((item) => (
                <Link href={item.path} key={item.path} asChild>
                    <Button 
                        title={isMenuVisible ? item.title : ""}
                        variant={isActive(item.path) ? 'primary' : 'transparent'}
                        className={`my-2 mx-auto ${!isMenuVisible ? 'w-8 h-8 p-0 justify-center' : ''}`}
                        {...(!isMenuVisible && {
                            icon: item.title === 'Home' ? 'home-outline' : 'document-text-outline',
                            iconSize: 20
                        })}
                    />
                </Link>
            ))}
        </Animated.View>
    );
}
