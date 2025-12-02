import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TCAItem {
  titulo: string;
  contenido: string;
}

export default function TermsAndConditionsScreen() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E5E5';
  const footerBackground = scheme === 'dark' ? '#111827' : '#e0f2fe'; // Azul muy oscuro o claro
  const footerTextColor = scheme === 'dark' ? '#9CA3AF' : '#424448';

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(index === expandedSection ? null : index);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-4 pb-10">
        <Text className="text-2xl font-bold text-center mb-4" style={{ color: textColor }}>
          Términos y Condiciones del Servicio
        </Text>
        <Text className="text-base text-center mb-6 text-gray-500">
          Por favor, revise detenidamente los siguientes términos y condiciones.
        </Text>

        {datosTCA.map((item, index) => (
          <View 
            key={index} 
            className="mb-3 rounded-xl overflow-hidden border shadow-sm"
            style={{ backgroundColor: cardBackground, borderColor }}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              className="flex-row justify-between items-center p-4"
            >
              <Text className="text-base font-bold flex-1 mr-2" style={{ color: textColor }}>
                {item.titulo}
              </Text>
              <Ionicons 
                name={expandedSection === index ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="orange" 
              />
            </TouchableOpacity>

            {expandedSection === index && (
              <View className="p-4 pt-0">
                <Text className="text-sm leading-5 text-gray-500 dark:text-gray-400">
                  {item.contenido}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View 
          className="mt-6 p-4 rounded-xl"
          style={{ backgroundColor: footerBackground }}
        >
          <Text className="text-sm text-center mb-4" style={{ color: footerTextColor }}>
            Al continuar utilizando la aplicación, usted reconoce que ha leído, entendido y aceptado los Términos y Condiciones arriba mencionados.
          </Text>
          <TouchableOpacity
            onPress={() => console.log('Aceptado')}
            className="bg-orange-500 py-3 rounded-lg"
          >
            <Text className="text-white text-base font-bold text-center">
              Entendido y Acepto
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}