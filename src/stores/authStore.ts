import {create} from "zustand";
import {settings} from "../services/api/config";
import * as AuthAPI from "../services/api/auth";
import {AuthState, ProfileUpdateData, UserRegister} from "../types/auth.types";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({loading: true, error: null});

        try {
            await AuthAPI.login(email, password);
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
        await AuthAPI.logout();
        set({user: null, loading: false});
    },
    fetchUser: async () => {
        set({loading: true});
        try {
            console.log("Fetching user");
            const user = await AuthAPI.fetchUser();
            set({user});
            if (settings.DEBUG_REQUESTS) console.log("Fetched user:", user);
        } catch (err: any) {
            console.error("Error fetching user:", err);
            if (settings.MOBILE_PLATFORM) {
                await AuthAPI.deleteToken();
            }
            set({user: null});
        } finally {
            set({loading: false});
        }
    },
    updateProfile: async (userData: ProfileUpdateData) => {
        set({loading: true, error: null});
        if (!userData.password || !userData.password.trim()) {
            delete userData.password;
        }
        try {
            const updatedUser = await AuthAPI.updateUser(userData);
            set({user: updatedUser});
            if (settings.DEBUG_REQUESTS) console.log("Updated user:", updatedUser);
        } catch (err: any) {
            console.error("Error updating user profile:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to update profile";
            set({error: errorMessage});
        } finally {
            set({loading: false});
        }
    },
    register: async (registerData: UserRegister) => {
        set({loading: true, error: null});
        try {
            await AuthAPI.register(registerData);
            return true;
        } catch (err: any) {
            console.error("Error registering user:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to register";
            set({error: errorMessage});
            return false;
        } finally {
            set({loading: false});
        }
    }
}))
