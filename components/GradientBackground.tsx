import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

interface GradientBackgroundProps {
  children?: ReactNode;
}

export default function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={["#FF6D00", "#FFA040"]} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 justify-center items-center">
        {children}
      </View>
    </LinearGradient>
  );
}
