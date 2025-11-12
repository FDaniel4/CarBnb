import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native"; // <-- Importamos StyleSheet

interface GradientBackgroundProps {
  children?: ReactNode;
}

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={["#FF6D00", "#FFA040"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient} // <-- Usamos 'style' en lugar de 'className'
    >
      <View style={styles.container}>
        {children}
      </View>
    </LinearGradient>
  );
}

// Añadimos los estilos
const styles = StyleSheet.create({
  gradient: {
    flex: 1, // <-- El gradiente ahora SÍ ocupa toda la pantalla
  },
  container: {
    flex: 1, // El contenedor interno también
    justifyContent: 'center',
    alignItems: 'center',
  },
});