import '../src/styles/globals.css'
import {Stack, useRouter, useSegments} from "expo-router";
import {useAuthStore} from "../src/stores/authStore";
import {useEffect} from "react";
import {ActivityIndicator, View} from "react-native";

function InitialLayout() {
    const { user, loading, fetchUser } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if(loading) return;
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/home');
        }
    }, [user, loading]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return <Stack />
}

export default function RootLayout() {
    return <InitialLayout />;
}
