import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import NavigationMenu from '../../src/components/NavigationMenu';

export default function ProtectedLayout() {
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <NavigationMenu />
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{
                    headerShown: false,
                }} />
            </View>
        </View>
    );
}
