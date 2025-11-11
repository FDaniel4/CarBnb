import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PublishCar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publica tu automóvil</Text>
      <Text style={styles.subtitle}>
        Comparte tu vehículo con miles de usuarios y genera ingresos extra.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Comenzar publicación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#ff6700",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PublishCar;
