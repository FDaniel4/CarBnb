import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap; // 👈 Permite íconos personalizados
  color?: string; // 👈 Color de fondo del recuadro
}

const Alert: React.FC<AlertProps> = ({
  visible,
  message,
  onClose,
  icon = "check-circle", // valor por defecto
  color = "#FFA559", // fondo anaranjado por defecto
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: color }]}>
          <MaterialIcons name={icon} size={50} color="#fff" style={styles.icon} />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: 270,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
