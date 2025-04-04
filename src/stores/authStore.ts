import {create} from "zustand";
import apiClient from "../services/api/apiClient";
import {settings} from "../services/api/config";
import {deleteToken, storeToken} from "../services/api/auth";

interface User {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    first_name: string;
    last_name: string;
    company_id: number;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({loading: true, error: null});

        try {
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

            await get().fetchUser();
        } catch (error: any) {
            const errorDetail = error.response?.data?.detail;
            const errorMessage = error.response?.data?.message;
            let finalError = errorDetail || errorMessage || error.message || "An unknown error occurred";
            if (error.status) finalError += ` (${error.status})`;

            set({error: finalError || error.message, user: null});
        } finally {
            set({loading: false});
        }
    },
    logout: async () => {
        set({loading: true});
        await apiClient.post("/auth/logout");

        if (!settings.MOBILE_PLATFORM) {
            document.cookie = "legalcheck_access_token=; path=/; max-age=0;";
        }

        if (settings.MOBILE_PLATFORM) {
            await deleteToken();
            if (settings.DEBUG_REQUESTS) console.log("Token removed");
        }

        set({user: null, loading: false});
    },
    fetchUser: async () => {
        set({loading: true});
        try {
            console.log("Fetching user");
            const {data} = await apiClient.get("/users/me");
            set({user: data});
            if (settings.DEBUG_REQUESTS) console.log("Fetched user:", data);
        } catch (err: any) {
            console.error("Error fetching user:", err);
            if (settings.MOBILE_PLATFORM) {
                await deleteToken();
            }
            set({user: null});
        } finally {
            set({loading: false});
        }
    }
}))