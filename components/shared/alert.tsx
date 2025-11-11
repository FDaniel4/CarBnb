import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ visible, onClose, message }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Ionicons name="checkmark-circle-outline" size={70} color="#1a1a1a" />
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    backgroundColor: "#fcae7e",
    width: "80%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "#cc6b33",
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginVertical: 15,
  },
  closeText: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});

export default Alert;
