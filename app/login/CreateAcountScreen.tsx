import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccountScreen: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleCreateAccount = () => {
    // Aquí ira la lógica de registro con Firebase
    // Por ahora, solo validamos que no estén vacíos.
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    console.log("Creating account with:", { fullName, email, password });

    router.replace("/drawer/home"); // 'replace' para que no pueda volver a "Sign up"
  };

  const handleSignIn = () => {
    // Navega a la pantalla de Login
    router.push("/login/LoginScreen");
  };

  const handleShowTerms = () => {
    //TODO: Aqui se debera abrir una pantalla de terminos y condiciones
    Alert.alert(
      "Terms & Conditions",
      "Here are the terms and conditions of using Car BNB..."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ---- SECCIÓN LOGO ---- */}
      <View className="mt-[15%] mb-8">
        <Image
          source={require("../../assets/images/Logo-blanco.jpg")}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      {/* ---- TÍTULO "Sign up" ---- */}
      <Text className="text-3xl font-bold text-gray-800 mb-8">Create acount</Text>

      {/* ---- SECCIÓN INPUTS ---- */}
      <View className="w-[85%] space-y-4 mb-8">
        {/* Input Full Name */}
        <View className="flex-row items-center bg-gray-100 p-3 rounded-3xl mb-2">
          <Ionicons name="person-outline" size={20} color="#888" />
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#888"
            onChangeText={setFullName}
            value={fullName}
            className="flex-1 ml-3 text-base text-black"
          />
        </View>

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

      {/* ---- BOTÓN CREATE ACCOUNT ---- */}
      <TouchableOpacity
        // Usamos el mismo color naranja y estilo
        className="bg-[#F97A4B] py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center"
        onPress={handleCreateAccount}
      >
        <Text className="text-white text-lg font-bold">
          Create your account
        </Text>
      </TouchableOpacity>

      {/* ---- TEXTO DE TÉRMINOS ---- */}
      {/* Usamos flex-row y flex-wrap para que el texto se ajuste */}
      <View className="w-[85%] flex-row flex-wrap justify-center items-center mb-4">
        <Text className="text-xs text-gray-400">
          By creating an account, you agree to our{" "}
        </Text>
        <TouchableOpacity onPress={handleShowTerms}>
          <Text className="text-xs text-gray-600 font-semibold underline">
            Terms
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO SIGN IN ---- */}
      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">Already have an account? </Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text className="text-sm text-[#F97A4B] font-bold">Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
