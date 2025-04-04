import { View, Text } from 'react-native';
import Button from "../../src/components/Button";
import { useAuthStore } from '../../src/stores/authStore';

export default function HomeScreen() {
    const { user, logout, loading } = useAuthStore();

    return (
        <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
            <Text style={{marginBottom:10}}>Welcome, {user?.email}!</Text>
            <Text>This is your home screen.</Text>
            <Text>Your name is: {user?.first_name}, and your surname is: {user?.last_name}</Text>
            <Button
                title={loading ? 'Logging out...' : "Log Out"}
                onPress={logout}
                loading={loading}
                variant="danger"
                className="mt-4"
            />
        </View>
    );
}