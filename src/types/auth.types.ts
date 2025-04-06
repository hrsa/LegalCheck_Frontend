export interface User {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    first_name: string;
    last_name: string;
    company_id: number;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}