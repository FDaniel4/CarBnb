import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  // Navega a la pantalla de Login
  const handleSignIn = () => {
    router.push('/login/LoginScreen');
  };

  // Navega a la pantalla de Crear Cuenta
  const handleSignUp = () => {
    router.push("/login/CreateAcountScreen");
  };
  const handleSkip = () => {
    //Replace para que no pueda volver atras
    router.replace("/drawer/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center">
      {/* La barra de estado con texto oscuro */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ---- SECCIÓN SKIP ---- */}
      <View className="w-full items-end px-7 pt-2.5">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-base text-gray-400">SKIP</Text>
        </TouchableOpacity>
      </View>

      {/* ---- SECCIÓN LOGO ---- */}
      <View className="mt-[20%] mb-10">
        <Image
          source={require("../../assets/images/Logo-blanco.jpg")}
          className="w-56 h-56"
          resizeMode="contain"
        />
      </View>

      {/* ---- SECCIÓN BIENVENIDA ---- */}
      <Text className="text-3xl font-light text-gray-800 mb-16">Welcome</Text>

      {/* ---- BOTÓN SIGN IN ---- */}
      <TouchableOpacity
        className="bg-[#F97A4B] py-4 px-24 rounded-full mb-10 shadow-md shadow-black/20"
        onPress={handleSignIn}
      >
        <Text className="text-white text-lg font-bold">Sign in</Text>
      </TouchableOpacity>

      {/* ---- SECCIÓN ÍCONOS SOCIALES ---- */}
      <View className="flex-row justify-evenly w-[70%] mb-10">
        {/* Ícono de Facebook */}
        <TouchableOpacity className="w-12 h-12 rounded-full bg-black justify-center items-center">
          <Ionicons name="logo-facebook" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Ícono de Chrome/Google */}
        <TouchableOpacity className="w-12 h-12 rounded-full bg-black justify-center items-center">
          <Ionicons name="logo-google" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Ícono de Apple */}
        <TouchableOpacity className="w-12 h-12 rounded-full bg-black justify-center items-center">
          <Ionicons name="logo-apple" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO DE ABAJO ---- */}
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

export default WelcomeScreen;