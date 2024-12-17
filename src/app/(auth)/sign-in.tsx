import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { signInService } from '~/services/authServices';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await signInService({ email, password });
            if (response.success) {
                router.replace("/(protected)");
            } else {
                console.error('Login failed: ', response.errorMessage);
                // You can add a toast or alert for failure here
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-10">
                    <Text className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome Back!</Text>
                    <Text className="text-base text-gray-500 text-center mb-8">Sign in to your account</Text>

                    <View className="mb-6">
                        <Text className="text-sm text-gray-800 mb-2">Email</Text>
                        <TextInput
                            className="h-12 border border-gray-300 rounded-lg px-4 text-base bg-white"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm text-gray-800 mb-2">Password</Text>
                        <TextInput
                            className="h-12 border border-gray-300 rounded-lg px-4 text-base bg-white"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 h-12 rounded-lg justify-center items-center mt-4"
                        onPress={handleLogin}
                    >
                        <Text className="text-white text-base font-semibold">SIGN IN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/sign-up')}
                        className="mt-4 items-center"
                    >
                        <Text className="text-indigo-600 text-sm">Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}