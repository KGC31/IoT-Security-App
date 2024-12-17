import React, { useState } from 'react';
import { TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { signUpService } from '~/services/authServices';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setErrorMessage('');

        // Validate inputs
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await signUpService({ email, password });

            if (response.success) {
                console.log(response);
                // Navigate to the sign-in screen on successful signup
                router.replace('/sign-in');
            } else {
                setErrorMessage(response.errorMessage || 'Sign up failed.');
            }
        } catch (error) {
            setErrorMessage('Unexpected error occurred. Please try again later.');
            console.error('Error during sign up:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-10">
                    <Text className="text-3xl font-bold text-gray-800 text-center mb-2">Hey New User!</Text>
                    <Text className="text-lg text-gray-500 text-center mb-8">Create an account</Text>

                    <View className="mb-6">
                        <Text className="text-sm mb-2 text-gray-800">Email</Text>
                        <TextInput
                            className="h-12 border border-gray-300 rounded-lg px-4 text-lg bg-white"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm mb-2 text-gray-800">Password</Text>
                        <TextInput
                            className="h-12 border border-gray-300 rounded-lg px-4 text-lg bg-white"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm mb-2 text-gray-800">Confirm password</Text>
                        <TextInput
                            className="h-12 border border-gray-300 rounded-lg px-4 text-lg bg-white"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 h-12 rounded-lg justify-center items-center mt-4"
                        onPress={handleSignup}
                    >
                        <Text className="text-white text-lg font-semibold">SIGN UP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/sign-in')}
                        className="mt-4 items-center"
                    >
                        <Text className="text-indigo-600 text-sm">Already have an account? Sign in</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}