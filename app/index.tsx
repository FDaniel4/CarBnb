import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🔜 Aquí puedes poner lógica para decidir a dónde ir:
      const isLoggedIn = false; // luego reemplazarás esto con tu lógica real

      if (isLoggedIn) {
        router.replace("/drawer/home"); // ruta hacia tu pantalla Home
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
