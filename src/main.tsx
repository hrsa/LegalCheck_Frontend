import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, Button, Text, TextInput} from "react-native";
import {useAuthStore} from "./stores/authStore";


export default function MainApp() {
    const {user, login, logout, loading, error, fetchUser} = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUser().then(() => console.log("User fetched"));
    }, []);


    if (loading) {
        return <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center'}}/>;
    }

    return (
        <View style={{padding: 40}}>
            {!user ? (
                <>
                    <Text>Email:</Text>
                    <TextInput style={{height: 40, borderWidth: 1}} autoCapitalize="none" value={email}
                               onChangeText={setEmail}/>
                    <Text>Password please:</Text>
                    <TextInput style={{height: 40, borderWidth: 1}} secureTextEntry value={password}
                               onChangeText={setPassword}/>
                    <Button title="Login" onPress={() => login(email, password)}/>
                    {error && <Text style={{color: "red"}}>{error}</Text>}
                </>
            ) : (
                <>
                    <Text>Welcome, {user.email}!</Text>
                    <Text>{user.first_name} {user.last_name}</Text>
                    {user.is_superuser && <Text>SuperUser</Text>}
                    <Button title="Logout" onPress={logout}/>
                </>
            )}
        </View>
    )
}