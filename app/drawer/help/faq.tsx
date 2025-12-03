import { Ionicons } from '@expo/vector-icons';
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

// --- Hooks de Tema ---
import { useThemeColor } from '../../../hooks/use-theme-color';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

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

  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  // Colores específicos para las tarjetas
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const answerBg = scheme === 'dark' ? '#2C2C2E' : '#FFF8F0'; 
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E5E5';

  // 3. CONSTRUIR EL ARRAY USANDO t()
  const datosFAQ: FAQItem[] = [
    {
      pregunta: t('faq_q1'),
      respuesta: t('faq_a1'),
    },
    {
      pregunta: t('faq_q2'),
      respuesta: t('faq_a2'),
    },
    {
      pregunta: t('faq_q3'),
      respuesta: t('faq_a3'),
    },
    {
      pregunta: t('faq_q4'),
      respuesta: t('faq_a4'),
    },
    {
      pregunta: t('faq_q5'),
      respuesta: t('faq_a5'),
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(index === expandido ? null : index);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5">
        
        {/* Título Traducido */}
        <Text className="text-3xl font-bold mb-6 text-center" style={{ color: textColor }}>
          {t('faq')}
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