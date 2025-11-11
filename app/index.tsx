import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      //TODO Aqui ira la logica para verificar si el usuario esta logueado
      const isLoggedIn = true; //simular que no esta logueado

      if (isLoggedIn) {
        router.replace("/login/WelcomeScreen"); // ruta hacia Welcome
      } else {
        router.replace("/drawer/home"); // por ahora redirige igual al Home
      }
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <GradientBackground>
      <Image
        source={require("../assets/images/Logo-negro.jpg")}
        style={{
          width: 280,
          height: 280,
          resizeMode: "contain",
          borderRadius: 100,
        }}
      />
    </GradientBackground>
  );
}
