import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import NavigationMenu from '../../src/components/NavigationMenu';

export default function ProtectedLayout() {
    return (
        <View style={{ flex: 1 }}>
            <NavigationMenu />
            <Stack screenOptions={{
                headerShown: false
            }} />
        </View>
    );
}