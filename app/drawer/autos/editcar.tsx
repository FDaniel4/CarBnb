import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Alert from "../../../components/shared/alert"; // ✅ Alerta compartida

const EditCarScreen = () => {
  const router = useRouter();

  const [description, setDescription] = useState(
    "El Tesla Cybertruck es una camioneta eléctrica que destaca por su diseño futurista y su estructura de acero inoxidable. Con tres motores que ofrecen hasta 1,020 hp y una carga útil de 1,500 kg. Cuenta con capacidad para remolcar hasta 6,350 kg. Además, incluye tracción total, suspensión adaptativa y una autonomía de hasta 800 km."
  );

  const [alertVisible, setAlertVisible] = useState(false);

  const handleSave = () => {
    // Aquí podrías agregar la lógica real de guardado más adelante
    setAlertVisible(true);
  };

  return (
    <LinearGradient colors={["#FFD6A5", "#FF9F1C"]} style={styles.gradientBackground}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔙 Botón para volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Editar mi auto</Text>

        {/* Tarjeta de edición */}
        <View style={styles.card}>
          {/* Encabezado */}
          <View style={styles.headerRow}>
            <Text style={styles.carName}>Tesla Cybertruck</Text>
            <MaterialIcons name="edit" size={20} color="#333" />
          </View>

          {/* Galería de imágenes */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={require("../../../assets/images/Autos/kicks_lrg.jpg")}
              style={styles.carImage}
            />
            <Image
              source={require("../../../assets/images/Autos/trax_lrg.jpg")}
              style={styles.carImage}
            />
            <Image
              source={require("../../../assets/images/Autos/x_trail_lrg.jpg")}
              style={styles.carImage}
            />
            <Image
              source={require("../../../assets/images/Autos/vento_lrg.jpg")}
              style={styles.carImage}
            />
          </ScrollView>

          {/* Descripción editable */}
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Botón de guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        {/* ✅ Alerta informativa */}
        <Alert
          visible={alertVisible}
          message="Los cambios se han guardado correctamente."
          icon="info-outline"
          color="#FF9B42"
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default EditCarScreen;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  carName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  carImage: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textArea: {
    backgroundColor: "#FFF7EE",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    color: "#333",
    fontSize: 14,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#FF7A00",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 25,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
