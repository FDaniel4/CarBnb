import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
// Interfaz TypeScript para definir la estructura de cada ítem de los términos
interface TCAItem {
    titulo: string;
    contenido: string;
}

// Componente principal
const TermsAndConditionsScreen = () => {
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const datosTCA: TCAItem[] = [
        {
            titulo: "1. Aceptación de los Términos",
            contenido:
                "Al acceder o utilizar el servicio, usted acepta estar sujeto a estos Términos y Condiciones...",
        },
        {
            titulo: "2. Descripción del Servicio",
            contenido:
                "Nuestra plataforma conecta a propietarios de vehículos ('Anfitriones') con personas que buscan alquilarlos...",
        },
        {
            titulo: "3. Registro y Cuentas",
            contenido:
                "El uso de ciertas funciones requiere que se registre para obtener una cuenta...",
        },
        {
            titulo: "4. Obligaciones del Anfitrión (Propietario)",
            contenido:
                "El Anfitrión garantiza que su vehículo está legalmente apto para circular...",
        },
        {
            titulo: "5. Pagos, Tarifas y Comisiones",
            contenido:
                "Las tarifas de alquiler son fijadas por el Anfitrión...",
        },
        {
            titulo: "6. Cancelaciones y Penalizaciones",
            contenido:
                "Las políticas de cancelación varían según la opción seleccionada por el Anfitrión...",
        },
        {
            titulo: "7. Limitación de Responsabilidad",
            contenido:
                "La plataforma no se hace responsable de daños, pérdidas o lesiones derivadas del uso de los vehículos alquilados...",
        },
    ];

    const toggleExpand = (index: number) => {
        setExpandedSection(index === expandedSection ? null : index);
    };

    return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Términos y Condiciones del Servicio</Text>
      <Text style={styles.intro}>
        Por favor, revise detenidamente los siguientes términos y condiciones.
      </Text>

      {datosTCA.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleExpand(index)}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Svg
              width={24}
              height={24}
              style={{
                transform: [{ rotate: expandedSection === index ? '180deg' : '0deg' }],
              }}
              stroke="#ee8f13ff"
              strokeWidth={2}
              fill="none"
              viewBox="0 0 24 24"
            >
              <Path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          {expandedSection === index && (
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{item.contenido}</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al continuar utilizando la aplicación, usted reconoce que ha leído, entendido y aceptado los Términos y Condiciones arriba mencionados.
        </Text>
        <TouchableOpacity
          onPress={() => console.log('Aceptado')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Entendido y Acepto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fffdecff' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#050505ff' },
  intro: { fontSize: 16, textAlign: 'center', marginBottom: 16, color: '#161717ff' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1 },
  cardContent: { marginTop: 8 },
  cardText: { fontSize: 14, color: '#4b5563' },
  footer: { marginTop: 24, padding: 16, backgroundColor: '#e0f2fe', borderRadius: 12 },
  footerText: { fontSize: 14, textAlign: 'center', marginBottom: 12, color: '#424448ff' },
  button: { backgroundColor: '#ee8f13ff', paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default TermsAndConditionsScreen;
