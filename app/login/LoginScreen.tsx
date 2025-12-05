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
  
  // Estado para saber si mostramos el botón biométrico y qué tipo es
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType | null>(null);
  
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
      
      // Si todo está bien, habilitamos el botón y detectamos el tipo
      if (compatible && enrolled) {
        setIsBiometricSupported(true);
        
        // Priorizar Reconocimiento Facial (Tipo 2) sobre Huella (Tipo 1)
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType(LocalAuthentication.AuthenticationType.FINGERPRINT);
        }
      }

      // Revisar si hay credenciales guardadas
      const savedEmail = await SecureStore.getItemAsync('secure_email');
      const savedPassword = await SecureStore.getItemAsync('secure_password');
      // No seteamos el estado visual aquí para no auto-loguear sin acción, 
      // pero podríamos usarlo para mostrar un indicador visual si quisiéramos.
    })();
  }, []);

  // --- Función para Login Biométrico ---
  const handleBiometricLogin = async () => {
    try {
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert("Atención", "No tienes biometría configurada en este dispositivo.");
            return;
        }

        // Determinar el mensaje según el tipo detectado
        const authMessage = biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION 
            ? "Escanea tu rostro para ingresar" 
            : t('biometricPrompt');

        // Intentar autenticación
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: authMessage,
            cancelLabel: t('cancel'),
            disableDeviceFallback: true, // Evita pedir PIN si falla la biometría
            fallbackLabel: "", 
        });

        if (result.success) {
            setLoading(true);
            // Recuperar credenciales
            const savedEmail = await SecureStore.getItemAsync('secure_email');
            const savedPassword = await SecureStore.getItemAsync('secure_password');

            if (savedEmail && savedPassword) {
                // Login en Firebase
                await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
                
                // Refrescar credenciales (buena práctica)
                await SecureStore.setItemAsync('secure_email', savedEmail);
                await SecureStore.setItemAsync('secure_password', savedPassword);
                
                router.replace("/drawer/home");
            } else {
                Alert.alert(t('error'), t('biometricNotFound'));
                setLoading(false);
            }
        } else {
            // Si el usuario cancela o falla
            if (result.error !== 'user_cancel') {
                console.log("Fallo Biometría:", result);
            }
            setLoading(false);
        }
    } catch (error: any) {
        console.log("Error Técnico Biometría:", error);
        Alert.alert("Error", error.message || "Ocurrió un error inesperado");
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
        
        // --- Preguntar si quiere guardar biometría al loguearse con éxito ---
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
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          Alert.alert(t('error'), t('invalidCredentials'));
        } else {
          Alert.alert(t('error'), t('unexpectedError'));
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

        {/* BOTÓN BIOMÉTRICO (Dinámico: Rostro o Huella) */}
        {isBiometricSupported && (
          <TouchableOpacity
            className="flex-row items-center justify-center py-3 w-[85%] rounded-full border border-gray-300 mb-6"
            onPress={handleBiometricLogin}
            disabled={loading}
          >
             {/* Icono cambia según el tipo de biometría detectada */}
             <Ionicons 
                name={biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION ? "scan-outline" : "finger-print"} 
                size={24} 
                color={textColor} 
                style={{ marginRight: 10 }} 
             />
             <Text className="text-base font-semibold" style={{ color: textColor }}>
               {/* Texto dinámico opcional, o el genérico 'Ingresar con Biometría' */}
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