import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importaciones de lógica interna
import { signInWithEmailAndPassword } from "firebase/auth";
import { useThemeColor } from "../../hooks/use-theme-color";
import { auth } from "../../utils/firebaseConfig";

// --- Importar Librerías de Expo ---
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../context/LanguageContext';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  
  // 2. USAR HOOK DE TRADUCCIÓN
  const { t } = useLanguage();

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

  // --- Verificar soporte y credenciales al iniciar ---
  useEffect(() => {
    (async () => {
      // DIAGNÓSTICO AL INICIAR
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      console.log("--- DIAGNÓSTICO BIOMETRÍA ---");
      console.log("Hardware compatible:", compatible);
      console.log("Huella/Cara configurada:", enrolled);
      console.log("Tipos soportados (1=Huella, 2=Cara):", types);

      // Si todo está bien, habilitamos el botón
      if (compatible && enrolled) {
        setIsBiometricSupported(true);
      }

      // Revisar si hay credenciales
      const savedEmail = await SecureStore.getItemAsync('secure_email');
      const savedPassword = await SecureStore.getItemAsync('secure_password');
      if (savedEmail && savedPassword) {
        setHasSavedCredentials(true);
      }
    })();
  }, []);

  // --- Función para Login Biométrico (MODIFICADA PARA PRUEBAS) ---
  const handleBiometricLogin = async () => {
    try {
        // 1. Verificación manual antes de llamar a authenticate
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert("Error de Configuración", "No tienes FaceID/TouchID configurado en los ajustes de tu iPhone.");
            return;
        }

        // 2. Intentar autenticación FORZANDO BIOMETRÍA (sin PIN)
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: t('biometricPrompt'),
            cancelLabel: t('cancel'), // Obligatorio en Android, buena práctica en iOS
            disableDeviceFallback: true, // <--- ESTO EVITA QUE PIDA EL CÓDIGO
            fallbackLabel: "", // Ocultar botón de contraseña
        });

        // 3. Manejar el resultado
        if (result.success) {
            setLoading(true);
            // Recuperar credenciales del baúl seguro
            const savedEmail = await SecureStore.getItemAsync('secure_email');
            const savedPassword = await SecureStore.getItemAsync('secure_password');

            if (savedEmail && savedPassword) {
                // Intentar login en Firebase
                await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
                console.log("Biometric login success");
                
                // Refrescar credenciales
                await SecureStore.setItemAsync('secure_email', savedEmail);
                await SecureStore.setItemAsync('secure_password', savedPassword);
                
                router.replace("/drawer/home");
            } else {
                Alert.alert(t('error'), t('biometricNotFound'));
                setLoading(false);
            }
        } else {
            // SI FALLA, MOSTRAMOS POR QUÉ
            console.log("Fallo Biometría:", result);
            Alert.alert("Autenticación Fallida", `Razón: ${result.error}`);
            setLoading(false);
        }
    } catch (error: any) {
        console.log("Error Técnico Biometría:", error);
        Alert.alert("Error Técnico", error.message || "Ocurrió un error desconocido");
        setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('enterEmailPassword'));
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Logged in user:", userCredential.user.email);
        
        // --- Preguntar si quiere guardar biometría ---
        if (isBiometricSupported) {
            Alert.alert(
                t('enableBiometricsTitle'),
                t('enableBiometricsMsg'),
                [
                    { text: t('no'), style: "cancel", onPress: () => router.replace("/drawer/home") },
                    { 
                        text: t('yes'), 
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
          Alert.alert(t('error'), t('invalidCredentials'));
        } else {
          Alert.alert(
            t('error'),
            t('unexpectedError')
          );
        }
      });
  };

  const handleForgotPassword = () => {
    router.push("/login/ForgotPasswordScreen");
  };

  const handleSignUp = () => {
    router.push("/login/CreateAcountScreen");
  };

  return (
    <SafeAreaView
      className="flex-1 items-center justify-between pb-4"
      style={{ backgroundColor: background }}
    >
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={background}
      />

      <View className="w-full items-center">
        {/* LOGO */}
        <View className="mt-[15%] mb-8">
          <Image
            source={require("../../assets/images/Logo-trans.png")} 
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold mb-8" style={{ color: textColor }}>
          {t('signIn')}
        </Text>

        {/* FORMULARIO */}
        <View className="w-[85%] space-y-4 mb-8">
          {/* Email */}
          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: inputBackground }}
          >
            <Ionicons name="mail-outline" size={20} color={textColor} />
            <TextInput
              placeholder={t('email')}
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

          {/* Password */}
          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: inputBackground }}
          >
            <Ionicons name="lock-closed-outline" size={20} color={textColor} />
            <TextInput
              placeholder={t('password')}
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

        {/* BOTÓN SIGN IN */}
        <TouchableOpacity
          className={`py-4 w-[85%] rounded-full mb-4 shadow-md shadow-black/20 items-center ${
            loading ? "bg-gray-400" : "bg-[#F97A4B]"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? t('signingIn') : t('signIn')}
          </Text>
        </TouchableOpacity>

        {/* BOTÓN BIOMÉTRICO (Solo si está disponible y configurado) */}
        {/* Nota: Para pruebas, quitamos la condición && hasSavedCredentials si quieres probar el botón aunque no haya login previo */}
        {isBiometricSupported && (
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 w-[85%] rounded-full border border-gray-300 mb-6"
            onPress={handleBiometricLogin}
            disabled={loading}
          >
             <Ionicons name="finger-print" size={24} color={textColor} style={{ marginRight: 10 }} />
             <Text className="text-base font-semibold" style={{ color: textColor }}>
               {t('biometricLogin')}
             </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-sm text-gray-400">{t('forgotPassword')}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">{t('dontHaveAccount')} </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text className="text-sm text-[#F97A4B] font-bold">
            {t('createAccount')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;