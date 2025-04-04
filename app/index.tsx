import { Redirect } from 'expo-router';
import {useAuthStore} from "../src/stores/authStore";

export default function IndexPage() {
    const { user } = useAuthStore();

    return <Redirect href={user ? "/home" : "/login"} />;
}