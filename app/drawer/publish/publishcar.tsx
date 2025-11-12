import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MyCarsScreen = () => {
  const navigation = useNavigation();

  // 🔹 Datos de ejemplo (puedes reemplazar por datos reales)
  const cars = [
    {
      id: 1,
      name: "Tesla Cybertruck",
      description:
        "Camioneta eléctrica futurista con un diseño de acero inoxidable y gran autonomía. Capacidad de remolque de hasta 6,350 kg.",
      image: require("../../../assets/images/Autos/trax_lrg.jpg"),
      rating: 5,
    },
    {
      id: 2,
      name: "Volkswagen Jetta 2025",
      description:
        "Motor 1.4L Turbo TSI de 150 hp y 250 Nm. Excelente desempeño en ciudad y carretera. Ideal para familias modernas.",
      image: require("../../../assets/images/Autos/vento_lrg.jpg"),
      rating: 3,
    },
  ];

  // 🔹 Generar estrellas según calificación
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <MaterialIcons
            key={i}
            name={i <= rating ? "star" : "star-border"}
            size={22}
            color="#ffa500"
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Autos</Text>

      {cars.map((car) => (
        <View key={car.id} style={styles.card}>
          {/* Imagen */}
          <Image source={car.image} style={styles.image} />

          {/* Info */}
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.carName}>{car.name}</Text>

              {/* Iconos Editar / Eliminar */}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() =>
                    (navigation as any).navigate("autos/editcar")
                  }
                >
                  <MaterialIcons
                    name="edit"
                    size={18}
                    color="#333"
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                  <MaterialIcons
                    name="delete"
                    size={18}
                    color="#333"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text numberOfLines={3} style={styles.description}>
              {car.description}
            </Text>

            {/* Calificación */}
            {renderStars(car.rating)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default MyCarsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff7f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 110,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginVertical: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
});
