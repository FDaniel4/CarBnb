import React from "react";
import { Image } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function SplashScreen() {
  
  return (
    <GradientBackground>
      <Image
        source={require("../assets/images/Logonegro.jpg")} 
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
