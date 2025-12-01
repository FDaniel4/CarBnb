import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/use-theme-color";
import { auth } from "@/utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

// --- 1. Importar Librerías de Expo ---
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para saber si mostramos el botón biométrico
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const scheme = useColorScheme();
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';

  // --- 2. Verificar soporte y credenciales al iniciar ---
  useEffect(() => {
    (async () => {
      // A) Revisar si el hardware soporta biometría
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);

      // B) Revisar si ya guardamos credenciales antes
      const savedEmail = await SecureStore.getItemAsync('secure_email');
      const savedPassword = await SecureStore.getItemAsync('secure_password');
      if (savedEmail && savedPassword) {
        setHasSavedCredentials(true);
      }
    })();
  }, []);

  // --- 3. Función para Login Biométrico ---
  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Inicia sesión con FaceID o Huella',
      fallbackLabel: 'Usar contraseña',
    });

    if (result.success) {
      setLoading(true);
      try {
        // Recuperar credenciales del baúl seguro
        const savedEmail = await SecureStore.getItemAsync('secure_email');
        const savedPassword = await SecureStore.getItemAsync('secure_password');

        if (savedEmail && savedPassword) {

          await SecureStore.setItemAsync('secure_email', savedEmail);
          await SecureStore.setItemAsync('secure_password', savedPassword);
          // Intentar login en Firebase
          await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
          console.log("Biometric login success");
          router.replace("/drawer/home");
        } else {
          Alert.alert("Error", "No se encontraron credenciales guardadas.");
        }
      } catch (error: any) {
        console.log("Biometric Login Error:", error);
        Alert.alert("Error", "Falló el inicio de sesión biométrico.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogin = () => {
<<<<<<< HEAD
    // ... (lógica de login sin cambios)
=======
>>>>>>> desarrollo
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Logged in user:", userCredential.user.email);
        
        // --- 4. Preguntar si quiere guardar biometría ---
        if (isBiometricSupported) {
            Alert.alert(
                "Habilitar Biometría",
                "¿Quieres usar tu cara o huella para entrar la próxima vez?",
                [
                    { text: "No", style: "cancel", onPress: () => router.replace("/drawer/home") },
                    { 
                        text: "Sí", 
                        onPress: async () => {
                            await SecureStore.setItemAsync('secure_email', email);
                            await SecureStore.setItemAsync('secure_password', password);
                            router.replace("/drawer/home");
                        } 
                    }
                ]
            );
        } else {
            router.replace("/drawer/home");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Login Error:", error.code);

        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          Alert.alert("Error", "Invalid email or password. Please try again.");
        } else {
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again."
          );
        }
      });
  };

  const handleForgotPassword = () => {
<<<<<<< HEAD
    router.push('/login/ForgotPasswordScreen');
=======
    router.push("/login/ForgotPasswordScreen");
>>>>>>> desarrollo
  };

  const handleSignUp = () => {
    router.push("/login/CreateAcountScreen");
  };

  // --- 2. AÑADIMOS LA FUNCIÓN DE IR ATRÁS ---
  const handleGoBack = () => {
    router.back();
  };

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView
      className="flex-1 items-center justify-between pb-4"
      style={{ backgroundColor: background }}
    >
      <StatusBar
        barStyle={
          useColorScheme() === "dark" ? "light-content" : "dark-content"
        }
        backgroundColor={background}
      />

      <View className="w-full items-center">
        <View className="mt-[15%] mb-8">
          <Image
            source={require("@/assets/images/Logo-trans.png")}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold mb-8" style={{ color: textColor }}>
          Sign in
        </Text>

        <View className="w-[85%] space-y-4 mb-8">
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

          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: inputBackground }}
          >
            <Ionicons name="lock-closed-outline" size={20} color={textColor} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              className="flex-1 ml-3 text-base"
              style={{ color: textColor }}
              editable={!loading}
            />
          </View>
        </View>

        {/* ---- BOTÓN SIGN IN ---- */}
        <TouchableOpacity
          className={`py-4 w-[85%] rounded-full mb-4 shadow-md shadow-black/20 items-center ${
            loading ? "bg-gray-400" : "bg-[#F97A4B]"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>

        {/* ---- BOTÓN BIOMÉTRICO (Solo si está disponible y configurado) ---- */}
        {isBiometricSupported && hasSavedCredentials && (
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 w-[85%] rounded-full border border-gray-300 mb-6"
            onPress={handleBiometricLogin}
            disabled={loading}
          >
             <Ionicons name="finger-print" size={24} color={textColor} style={{ marginRight: 10 }} />
             <Text className="text-base font-semibold" style={{ color: textColor }}>
               Ingresar con Biometría
             </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-sm text-gray-400">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text className="text-sm text-[#F97A4B] font-bold">
            Create acount
          </Text>
        </TouchableOpacity>
      </View>
>>>>>>> desarrollo
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