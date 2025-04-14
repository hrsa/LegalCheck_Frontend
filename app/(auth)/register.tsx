import { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import Button from "../../src/components/Button";
import TextInput from "../../src/components/TextInput";
import { useAuthStore } from "../../src/stores/authStore";
import { UserRegister } from "../../src/types/auth.types";
import { useNotificationStore } from "../../src/stores/notificationStore";
import { navigateWithNotification } from "../../src/utils/navigation";

export default function RegisterScreen() {
    const { register, loading, error } = useAuthStore();
    const { showNotification } = useNotificationStore();

    const [formData, setFormData] = useState<UserRegister>({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        invite_code: ""
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof UserRegister, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        let isValid = true;

        Object.entries(formData).forEach(([key, value]) => {
            if (!value.trim()) {
                errors[key] = "This field is required";
                isValid = false;
            }
        });

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const success = await register(formData);
        if (success) {
            navigateWithNotification("/login", "success", "Registration successful! You can login now.");
        } else {
            let currentError = useAuthStore.getState().error;
            navigateWithNotification("/register", "error", currentError || "Failed to register.");
        }
    };

    return (
        <View className="flex-1 justify-center px-6 max-w-md self-center gap-1">
            <Text className="text-2xl font-bold mb-6 text-center">Create an Account</Text>

            <Text>Email:</Text>
            <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                autoCapitalize="none"
                keyboardType="email-address"
                className="mb-2 px-2 py-1"
            />
            {formErrors.email && <Text className="text-red-500 mb-2">{formErrors.email}</Text>}

            <Text>Password:</Text>
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                className="mb-2 px-2 py-1"
            />
            {formErrors.password && <Text className="text-red-500 mb-2">{formErrors.password}</Text>}

            <Text>First Name:</Text>
            <TextInput
                placeholder="First Name"
                value={formData.first_name}
                onChangeText={(value) => handleChange("first_name", value)}
                className="mb-2 px-2 py-1"
            />
            {formErrors.first_name && <Text className="text-red-500 mb-2">{formErrors.first_name}</Text>}

            <Text>Last Name:</Text>
            <TextInput
                placeholder="Last Name"
                value={formData.last_name}
                onChangeText={(value) => handleChange("last_name", value)}
                className="mb-2 px-2 py-1"
            />
            {formErrors.last_name && <Text className="text-red-500 mb-2">{formErrors.last_name}</Text>}

            <Text>Invite Code:</Text>
            <TextInput
                placeholder="Invite Code"
                value={formData.invite_code}
                onChangeText={(value) => handleChange("invite_code", value)}
                className="mb-4 px-2 py-1"
            />
            {formErrors.invite_code && <Text className="text-red-500 mb-2">{formErrors.invite_code}</Text>}

            {error && <Text className="text-red-500 mb-4">{error}</Text>}

            <Button 
                title={loading ? "Registering..." : "Register"} 
                onPress={handleSubmit}
                loading={loading}
            />

            <View className="flex-row justify-center mt-4">
                <Text>Already have an account? </Text>
                <Text 
                    className="text-blue-500"
                    onPress={() => router.replace("/login")}
                >
                    Login
                </Text>
            </View>
        </View>
    );
}
