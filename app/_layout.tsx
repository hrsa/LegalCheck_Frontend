import '../src/styles/globals.css'
import {Stack, useRouter, useSegments} from "expo-router";
import {useAuthStore} from "../src/stores/authStore";
import {useEffect} from "react";
import {ActivityIndicator, View} from "react-native";
import { GlobalNotification } from "../src/components/GlobalNotification";
import Head from "expo-router/head";

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
        const inProtectedGroup = segments[0] === '(protected)';

        if (!user && inProtectedGroup) {
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

    return (
        <View style={{ flex: 1 }}>
            <Head>
                <title>Femida - Legal Document Analysis</title>
                <meta name="description" content="Femida helps you analyze legal documents and contracts with AI-powered tools." />
                <meta name="keywords" content="legal, document analysis, contracts, AI, legal tech" />
                <meta property="og:title" content="Femida - Legal Document Analysis" />
                <meta property="og:description" content="Femida helps you analyze legal documents and contracts with AI-powered tools." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://femida.app" />
            </Head>
            <Stack screenOptions={{
                headerShown: false
            }} />
            <GlobalNotification />
        </View>
    )
}

export default function RootLayout() {
    return <InitialLayout />;
}
