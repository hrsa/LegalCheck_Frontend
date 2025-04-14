import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import TextInput from '../../src/components/TextInput';
import Button from '../../src/components/Button';
import { User } from '../../src/types/auth.types';
import { Notification, useNotification } from '../../src/components/Notification';

export default function ProfileScreen() {
    const { user, loading, error, updateProfile } = useAuthStore();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyId, setCompanyId] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Use the notification hook
    const { notification, showNotification, hideNotification, showAlert } = useNotification();

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setCompanyId(user.company_id);
            setEmail(user.email);
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
        }
        setIsEditing(false);
    };


    const handleSave = async () => {
        if (!user) return;

        if (!firstName.trim() || !lastName.trim()) {
            showAlert('Validation Error', 'First and last names are required', 'warning');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Validation Error', 'Please enter a valid email address', 'warning');
            return;
        }

        setIsSaving(true);

        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName,
                company_id: companyId,
                email: email ?? undefined,
                password: password ?? undefined,
            });

            setIsEditing(false);
            showAlert('Success', 'Profile updated successfully', 'success');
        } catch (err) {
            showAlert('Error', 'Failed to update profile. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-lg">Loading profile information...</Text>
            </View>
        );
    }


    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6 self-center" style={{maxWidth: 1250, width: '100%'}}>
                <Text className="text-2xl font-bold mb-6">My Profile</Text>

                <Notification 
                    type={notification.type || undefined}
                    message={notification.message}
                    visible={notification.visible}
                    onDismiss={hideNotification}
                />

                <View className="bg-gray-50 rounded-lg p-6 mb-6">
                    <View className="mb-4">
                        <Text className="text-gray-600 mb-1">Email</Text>
                        {isEditing ? (
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                className="p-2"
                                editable={isEditing}
                            />
                        ) : (
                            <Text className="text-lg">{user.email}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 mb-1">Password</Text>
                        {isEditing ? (
                            <TextInput
                                value={password ?? ''}
                                secureTextEntry
                                onChangeText={setPassword}
                                className="p-2"
                                editable={isEditing}
                            />
                        ) : (
                            <Text className="text-lg">*******</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 mb-1">First Name</Text>
                        {isEditing ? (
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                className="p-2"
                                editable={isEditing}
                            />
                        ) : (
                            <Text className="text-lg">{user.first_name}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 mb-1">Last Name</Text>
                        {isEditing ? (
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                className="p-2"
                                editable={isEditing}
                            />
                        ) : (
                            <Text className="text-lg">{user.last_name}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 mb-1">Account Status</Text>
                        <Text className="text-lg">{user.is_active ? 'Active' : 'Inactive'}</Text>
                    </View>

                    {user.is_superuser && (
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Admin Status</Text>
                            <Text className="text-lg">Administrator</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row justify-center">
                    {isEditing ? (
                        <>
                            <Button
                                title="Cancel"
                                onPress={handleCancel}
                                className="bg-gray-400 mr-2"
                            />
                            <Button
                                title="Save"
                                onPress={handleSave}
                                disabled={isSaving}
                                className={`${isSaving ? 'bg-blue-300' : 'bg-blue-500'}`}
                                loading={isSaving}
                            />
                        </>
                    ) : (
                        <Button
                            title="Edit Profile"
                            onPress={handleEdit}
                            className="bg-blue-500"
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
