import React, { useState } from 'react';
import {
    Alert,
    Image,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');


  const handleResetPassword = () => {
    // TODO Aquí ira la lógica para ENVIAR EL EMAIL de reseteo
    // con Firebase sendPasswordResetEmail
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    console.log('Sending password reset link to:', email);

    Alert.alert(
      'Check your email',
      'If an account with that email exists, we have sent a link to reset your password.',
      [
        {
          text: 'OK',
          onPress: () => router.back(), 
        },
      ]
    );
  };

  const handleGoBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between pb-4">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Contenedor principal para centrar el formulario */}
      <View className="w-full items-center">
        {/* ---- SECCIÓN LOGO ---- */}
        <View className="mt-[15%] mb-8">
          <Image
            source={require('../../assets/images/Logo-blanco.jpg')} 
            className="w-40 h-40" 
            resizeMode="contain"
          />
        </View>

        {/* ---- TÍTULO "Forgot Password" ---- */}
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Forgot Password
        </Text>

        {/* ---- TEXTO DESCRIPTIVO ---- */}
        <Text className="text-sm text-gray-500 w-[85%] text-center mb-8">
          Enter your email and we'll send you a link to reset your password.
        </Text>

        {/* ---- SECCIÓN INPUT ---- */}
        <View className="w-[85%] space-y-4 mb-8">
          {/* Input Email */}
          <View className="flex-row items-center bg-gray-100 p-3 rounded-3xl mb-2">
            <Ionicons name="mail-outline" size={20} color="#888" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-base text-black"
            />
          </View>
        </View>

        {/* ---- BOTÓN "Send Reset Link" ---- */}
        <TouchableOpacity
          className="bg-[#F97A4B] py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center"
          onPress={handleResetPassword}
        >
          <Text className="text-white text-lg font-bold">Send Reset Link</Text>
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO "Back to Sign In" ---- */}
      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">
          Remembered your password?{' '}
        </Text>
        <TouchableOpacity onPress={handleGoBackToLogin}>
          <Text className="text-sm text-[#F97A4B] font-bold">Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;