import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Alert from "../../../components/shared/alert"; // 👈 ruta relativa al componente

const PublishCar = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [location, setLocation] = useState("");
  const [available, setAvailable] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);

  const handlePublish = () => {
    // Aquí podrías agregar validaciones más adelante
    setAlertVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Publish a car</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Brand"
          value={brand}
          onChangeText={setBrand}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Model"
          value={model}
          onChangeText={setModel}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 10 }]}
          placeholder="Year"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price per day"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <View style={styles.checkboxContainer}>
        <Switch
          value={available}
          onValueChange={setAvailable}
          thumbColor={available ? "#ff6700" : "#ccc"}
          trackColor={{ false: "#dcdcdc", true: "#ffd5b3" }}
        />
        <Text style={styles.checkboxLabel}>Availability</Text>
      </View>

      <Text style={styles.sectionTitle}>Add real images</Text>
      <View style={styles.imageRow}>
        {[1, 2, 3, 4].map((i) => (
          <TouchableOpacity key={i} style={styles.imageButton}>
            <Text style={{ color: "#aaa", fontSize: 26 }}>+</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price per day"
        keyboardType="numeric"
        value={priceDay}
        onChangeText={setPriceDay}
      />

      <TouchableOpacity style={styles.button} onPress={handlePublish}>
        <Text style={styles.buttonText}>Publish now</Text>
      </TouchableOpacity>

      <Alert
        visible={alertVisible}
        message="Your vehicle has been published successfully."
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

// Reutilizamos tus estilos anteriores
const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: { marginLeft: 8, fontSize: 16, color: "#333" },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  imageButton: {
    width: 65,
    height: 65,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#ff6700",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default PublishCar;
