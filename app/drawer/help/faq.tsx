import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- Hooks de Tema ---
import { useThemeColor } from '@/hooks/use-theme-color';

// Habilitar animaciones en Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export default function FAQScreen() {
  const [expandido, setExpandido] = useState<number | null>(null);

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  // Colores específicos para las tarjetas
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const answerBg = scheme === 'dark' ? '#2C2C2E' : '#FFF8F0'; // Mantenemos el toque crema suave en light
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E5E5';

  const datosFAQ: FAQItem[] = [
    {
      pregunta: '¿Cómo puedo publicar mi auto?',
      respuesta:
        "Dirígete a la sección 'Publicar Auto' en el menú, llena los datos de tu vehículo, sube una foto y presiona el botón 'Publicar ahora'.",
    },
    {
      pregunta: '¿Tiene algún costo publicar un auto?',
      respuesta:
        'No, publicar tu vehículo es totalmente gratuito. Solo se cobra una pequeña comisión cuando tu auto es rentado exitosamente.',
    },
    {
      pregunta: '¿Cómo recibo mis pagos?',
      respuesta:
        'Los pagos se transfieren automáticamente a tu cuenta bancaria registrada o vía PayPal después de cada renta completada y verificada.',
    },
    {
      pregunta: '¿Puedo desactivar mi publicación?',
      respuesta:
        'Sí, puedes ir a la sección "Mis Autos" y eliminar tu publicación en cualquier momento si ya no deseas rentar tu vehículo.',
    },
    {
      pregunta: '¿Qué pasa si dañan mi auto?',
      respuesta:
        'Todos los viajes incluyen un seguro de cobertura amplia. En caso de siniestro, nuestro equipo de soporte te guiará durante todo el proceso.',
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(index === expandido ? null : index);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5">
        
        {/* Título */}
        <Text className="text-3xl font-bold mb-6 text-center" style={{ color: textColor }}>
          Preguntas Frecuentes
        </Text>

        {/* Lista de Preguntas */}
        {datosFAQ.map((item, index) => {
          const isOpen = expandido === index;
          return (
            <View
              key={index}
              className="mb-4 rounded-xl overflow-hidden border shadow-sm"
              style={{ backgroundColor: cardBg, borderColor }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleExpand(index)}
                className="flex-row justify-between items-center p-4"
              >
                <Text
                  className="text-base font-bold flex-1 mr-2"
                  style={{ color: textColor }}
                >
                  {item.pregunta}
                </Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>

              {/* Respuesta (Visible solo si está expandido) */}
              {isOpen && (
                <View
                  className="p-4 pt-0 border-t"
                  style={{ backgroundColor: answerBg, borderColor }}
                >
                  <View className="h-px w-full bg-gray-200 dark:bg-gray-700 mb-3" />
                  <Text
                    className="text-sm leading-6"
                    style={{ color: scheme === 'dark' ? '#D1D5DB' : '#555' }}
                  >
                    {item.respuesta}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}