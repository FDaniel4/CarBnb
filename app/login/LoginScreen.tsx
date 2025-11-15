import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image, // <-- 1. IMPORTAMOS StyleSheet (faltaba)
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // ... (lógica de login sin cambios)
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    console.log('Logging in with:', { email, password });
    router.replace('/drawer/home');
  };

  const handleForgotPassword = () => {
    router.push('/login/ForgotPasswordScreen');
  };

  const handleSignUp = () => {
    router.push('/login/CreateAcountScreen');
  };

  // --- 2. AÑADIMOS LA FUNCIÓN DE IR ATRÁS ---
  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* --- 3. AÑADIMOS EL BOTÓN DE ATRÁS AQUÍ --- */}
      <TouchableOpacity
        onPress={handleGoBack}
        className="absolute top-16 left-5 z-10" // Posicionamiento absoluto
      >
        <Ionicons name="arrow-back-outline" size={30} color="#333" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Contenedor principal para centrar el formulario */}
          <View className="w-full items-center">
            {/* ---- SECCIÓN LOGO ---- */}
            <View className="mt-[10%] mb-8">
              <Image
                source={require('../../assets/images/Logo-blanco.jpg')}
                className="w-36 h-36" // Un poco más pequeño
                resizeMode="contain"
              />
            </View>

            {/* ---- TÍTULO "Sign in" ---- */}
            <Text className="text-3xl font-bold text-gray-800 mb-8">
              Sign in
            </Text>

            {/* ---- SECCIÓN INPUTS ---- */}
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

              {/* Input Password */}
              <View className="flex-row items-center bg-gray-100 p-3 rounded-3xl mb-2">
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry // Oculta el password
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* ---- BOTÓN SIGN IN ---- */}
            <TouchableOpacity
              className="bg-[#F97A4B] py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center"
              onPress={handleLogin}
            >
              <Text className="text-white text-lg font-bold">Sign in</Text>
            </TouchableOpacity>

            {/* ---- TEXTO FORGOT PASSWORD ---- */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-sm text-gray-400">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* ---- TEXTO SIGN UP (ENLACE A CREAR CUENTA) ---- */}
          {/* Lo dejamos al final del scroll */}
          <View className="flex-row justify-center items-center mt-12">
            <Text className="text-sm text-gray-400">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-sm text-[#F97A4B] font-bold">
                Create acount
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 4. (Corregido) El estilo 'styles' que faltaba
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // <--- Permite que el contenido crezca
    justifyContent: 'space-around', // Centra y distribuye
    alignItems: 'center',
    paddingVertical: 20, // Añade padding vertical
  },
});

export default LoginScreen;