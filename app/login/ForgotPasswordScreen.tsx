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
// Usamos rutas relativas para consistencia
import { auth } from '../../utils/firebaseConfig';

import { useThemeColor } from '../../hooks/use-theme-color';

// 1. IMPORTAR CONTEXTO
import { useLanguage } from '../context/LanguageContext';

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  
  // 2. USAR HOOK
  const { t } = useLanguage();

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scheme = useColorScheme();
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert(t('error'), t('enterEmailError')); // <-- Traducido
      return;
    }
    setLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        Alert.alert(
          t('checkEmailTitle'), // <-- Traducido
          t('checkEmailMsg'),   // <-- Traducido
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
          Alert.alert(t('error'), t('enterValidEmailError')); // <-- Traducido
        } else {
          Alert.alert(
            t('checkEmailTitle'), // <-- Traducido
            t('checkEmailMsg'),   // <-- Traducido
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
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} 
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
          {t('forgotPasswordTitle')} {/* <-- Traducido */}
        </Text>

        {/* ---- TEXTO DESCRIPTIVO ---- */}
        <Text className="text-sm w-[85%] text-center mb-8"
        style={{ color: textColor }}>
          {t('forgotPasswordSubtitle')} {/* <-- Traducido */}
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
              placeholder={t('email')} // <-- Traducido
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
            {loading ? t('sendingLinkBtn') : t('sendLinkBtn')} {/* <-- Traducido */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO "Back to Sign In" ---- */}
      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">
          {t('rememberedPassword')} {/* <-- Traducido */}
        </Text>
        <TouchableOpacity onPress={handleGoBackToLogin}>
          <Text className="text-sm text-[#F97A4B] font-bold"> {t('signIn')}</Text> {/* <-- Traducido */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;