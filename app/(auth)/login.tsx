import {useAuthStore} from "../../src/stores/authStore";
import {useState} from "react";
import {View, Text, Platform} from "react-native";
import Button from "../../src/components/Button";
import TextInput from "../../src/components/TextInput";
import {router} from "expo-router";


export default function LoginScreen() {
    const {login, loading, error} = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View className="flex-1 justify-center px-6 max-w-md self-center gap-1">
            <Text>Email:</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                className="mb-2 px-2 py-1"
            />


            <Text>Password:</Text>
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="mb-4 px-2 py-1"
                onKeyPress={(e) => {
                    if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter') {
                        const webEvent = e.nativeEvent as any;
                        if (!webEvent.shiftKey) {
                            e.preventDefault();
                            login(email, password);
                        }
                    }
                }}
                onSubmitEditing={() => {
                    login(email, password);
                }}
            />

            {error && <Text style={{color: "red", marginBottom: 10}}>{error}</Text>}

            <Button title={loading ? "Logging in..." : "Log In"} onPress={() => login(email, password)}/>

            <View className="flex-row justify-center mt-4">
                <Text>Don't have an account? </Text>
                <Text 
                    className="text-blue-500"
                    onPress={() => router.replace("/register")}
                >
                    Register
                </Text>
            </View>
        </View>
    );
}
