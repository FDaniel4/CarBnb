import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

import { useThemeColor } from "@/hooks/use-theme-color";
import { auth } from "@/utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const scheme = useColorScheme();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in user:", userCredential.user.email);
        router.replace("/drawer/home");
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
    // Navega a la pantalla de recuperar contraseña
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
        barStyle={
          useColorScheme() === "dark" ? "light-content" : "dark-content"
        }
        backgroundColor={background}
      />

      {/* Contenedor principal para centrar el formulario */}
      <View className="w-full items-center">
        {/* ---- SECCIÓN LOGO ---- */}
        <View className="mt-[15%] mb-8">
          <Image
            source={require("@/assets/images/Logo-trans.png")}
            style={{
              width: 160,
              height: 160,
            }}
            resizeMode="contain"
          />
        </View>

        {/* ---- TÍTULO "Sign in" ---- */}
        <Text className="text-3xl font-bold mb-8" style={{ color: textColor }}>
          Sign in
        </Text>

        {/* ---- SECCIÓN INPUTS ---- */}
        <View className="w-[85%] space-y-4 mb-8">
          {/* Input Email */}
          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: scheme === 'dark' ? '#2C2C2E' : '#F3F3F3' }}
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

          {/* Input Password */}
          <View
            className="flex-row items-center p-3 rounded-3xl mb-2"
            style={{ backgroundColor: scheme === 'dark' ? '#2C2C2E' : '#F3F3F3' }}
          >
            <Ionicons name="lock-closed-outline" size={20} color={textColor} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              onChangeText={setPassword}
              value={password}
              secureTextEntry // Oculta el password
              className="flex-1 ml-3 text-base"
              style={{ color: textColor }}
              editable={!loading}
            />
          </View>
        </View>

        {/* ---- BOTÓN SIGN IN ---- */}
        <TouchableOpacity
          className={`py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center ${
            loading ? "bg-gray-400" : "bg-[#F97A4B]"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>

        {/* ---- TEXTO FORGOT PASSWORD ---- */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-sm text-gray-400">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO SIGN UP (ENLACE A CREAR CUENTA) ---- */}
      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text className="text-sm text-[#F97A4B] font-bold">
            Create acount
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
