import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Alert from "../../../components/shared/alert"; // ✅ Alerta reutilizable

const MyCarsScreen = () => {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const cars = [
    {
      id: "1",
      name: "Tesla Cybertruck",
      image: require("../../../assets/images/Autos/kicks_lrg.jpg"),
      description:
        "Camioneta eléctrica futurista con diseño de acero inoxidable y gran autonomía.",
      rating: 5,
    },
    {
      id: "2",
      name: "Volkswagen Jetta 2025",
      image: require("../../../assets/images/Autos/vento_lrg.jpg"),
      description:
        "Motor 1.4L Turbo TSI de 150 hp. Ideal para familias modernas y viajes largos.",
      rating: 3,
    },
  ];

  // 🔸 Abrir modal de confirmación
  const handleDeletePress = (carId: string) => {
    setSelectedCar(carId);
    setConfirmVisible(true);
  };

  // 🔸 Confirmar eliminación
  const confirmDelete = () => {
    setConfirmVisible(false);
    setAlertVisible(true);
    // Aquí podrías eliminar el vehículo realmente del estado o API
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Autos</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cars.map((car) => (
          <View key={car.id} style={styles.card}>
            {/* Imagen */}
            <Image source={car.image} style={styles.carImage} />

            {/* Información */}
            <View style={styles.carInfo}>
              <View style={styles.headerRow}>
                <Text style={styles.carName}>{car.name}</Text>

                {/* Iconos de editar y eliminar */}
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    onPress={() => router.push("/drawer/autos/editcar")}
                  >
                    <MaterialIcons name="edit" size={20} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeletePress(car.id)}
                    style={{ marginLeft: 10 }}
                  >
                    <MaterialIcons name="delete" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.description}>{car.description}</Text>

              {/* Estrellas */}
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <MaterialIcons
                    key={i}
                    name={i < car.rating ? "star" : "star-border"}
                    size={18}
                    color="#FF7A00"
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ⚠️ Modal de confirmación */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>
              ¿Estás seguro de eliminar este vehículo?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: "#ccc" }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: "#FF7A00" }]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Eliminar auto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Alerta de éxito */}
      <Alert
        visible={alertVisible}
        message="Vehículo eliminado correctamente."
        icon="directions-car"
        color="#FF9B42"
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default MyCarsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginVertical: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  carImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  carInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginVertical: 6,
  },
  stars: {
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
