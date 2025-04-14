import * as SecureStore from 'expo-secure-store'
import apiClient from "./apiClient";
import {settings} from "./config";
import {ProfileUpdateData, User, UserRegister} from "../../types/auth.types";

export const storeToken = async (token: string) => {
    await SecureStore.setItemAsync("accessToken", token);
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync("accessToken");
}

export const deleteToken = async () => {
    await SecureStore.deleteItemAsync("accessToken");
}

export const login = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
    });

    if (settings.MOBILE_PLATFORM) {
        const cookie = response.headers['set-cookie']?.[0];
        if (cookie) {
            const match = cookie.match(/legalcheck_access_token=([^;]+)/);
            const token = match && match[1];
            if (token) {
                await storeToken(token);
            }
        }
    }

    return response;
};

export const logout = async () => {
    const response = await apiClient.post("/auth/logout");

    if (settings.MOBILE_PLATFORM) {
        await deleteToken();
    } else {
        document.cookie = "legalcheck_access_token=; path=/; max-age=0;";
    }

    return response;
};

export const fetchUser = async () => {
    const response = await apiClient.get("/users/me");
    return response.data as User;
};

export const updateUser = async (userData: ProfileUpdateData) => {
    const response = await apiClient.patch("/users/me", userData);
    return response.data as User;
};

export const register = async (registerData: UserRegister) => {
    const response = await apiClient.post("/register", registerData);
    return response.data as User;
};
