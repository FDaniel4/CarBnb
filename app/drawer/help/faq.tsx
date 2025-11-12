import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Habilitar animaciones en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  pregunta: string;
  respuesta: string;
}

const FAQScreen = () => {
  const [expandido, setExpandido] = useState<number | null>(null);

  const datosFAQ: FAQItem[] = [
    {
      pregunta: "¿Cómo puedo publicar mi auto?",
      respuesta:
        "Dirígete a la sección 'Publicar Auto', llena los datos de tu vehículo y presiona el botón 'Publicar ahora'.",
    },
    {
      pregunta: "¿Tiene algún costo publicar un auto?",
      respuesta:
        "No, publicar tu vehículo es totalmente gratuito. Solo se cobra una pequeña comisión cuando tu auto es rentado.",
    },
    {
      pregunta: "¿Cómo recibo mis pagos?",
      respuesta:
        "Los pagos se transfieren automáticamente a tu cuenta registrada después de cada renta completada.",
    },
    {
      pregunta: "¿Puedo desactivar mi publicación?",
      respuesta:
        "Sí, puedes desactivar o eliminar tu publicación en cualquier momento desde tu perfil sin penalización.",
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(index === expandido ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Preguntas Frecuentes</Text>

      {datosFAQ.map((item, index) => (
        <View key={index} style={styles.tarjeta}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleExpand(index)}
            style={styles.contenedorPregunta}
          >
            <Text style={styles.pregunta}>{item.pregunta}</Text>
          </TouchableOpacity>

          {expandido === index && (
            <View style={styles.contenedorRespuesta}>
              <Text style={styles.respuesta}>{item.respuesta}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // fondo suave tipo crema
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 25,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  contenedorPregunta: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  contenedorRespuesta: {
    backgroundColor: "#FFF4E0",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  respuesta: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
});
