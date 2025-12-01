import React, { useState } from 'react';
import {
    Alert,
    Image,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

import { useThemeColor } from '@/hooks/use-theme-color';

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scheme = useColorScheme();
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
setLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        Alert.alert(
          'Check your email',
          'If an account with that email exists, we have sent a link to reset your password.',
          [
            {
              text: 'OK',
              onPress: () => router.back(), // Regresa al login
            },
          ]
        );
      })
      .catch((error) => {
        setLoading(false);
        console.log('Password Reset Error:', error.code);

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Please enter a valid email address.');
        } else {
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
        }
      });
  };

  const handleGoBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-between pb-4"
    style={{backgroundColor: background}}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} // <-- Aplicar
        backgroundColor={background} />

      {/* Contenedor principal para centrar el formulario */}
      <View className="w-full items-center">
        {/* ---- SECCIÓN LOGO ---- */}
        <View className="mt-[15%] mb-8">
          <Image
            source={require('../../assets/images/Logo-trans.png')} 
            className="w-40 h-40" 
            resizeMode="contain"
          />
        </View>

        {/* ---- TÍTULO "Forgot Password" ---- */}
        <Text className="text-3xl font-bold text-gray-800 mb-4"
          style={{ color: textColor }}>
          Forgot Password
        </Text>

        {/* ---- TEXTO DESCRIPTIVO ---- */}
        <Text className="text-sm w-[85%] text-center mb-8"
        style={{ color: textColor }}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        {/* ---- SECCIÓN INPUT ---- */}
        <View className="w-[85%] space-y-4 mb-8">
          {/* Input Email */}
          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: inputBackground }} 
          >
            <Ionicons name="mail-outline" size={20} color={textColor} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-3 text-base"
              style={{ color: textColor }}
              editable={!loading}
            />
          </View>
        </View>

        {/* ---- BOTÓN "Send Reset Link" ---- */}
        <TouchableOpacity
          className={`bg-[#F97A4B] py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center ${
            loading ? 'bg-gray-400' : 'bg-[#F97A4B]'
          }`}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </Text>
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