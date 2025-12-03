import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, UIManager, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Hooks de Tema ---
import { useThemeColor } from '../../../hooks/use-theme-color';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

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

  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E5E5';
  const footerBackground = scheme === 'dark' ? '#111827' : '#e0f2fe'; 
  const footerTextColor = scheme === 'dark' ? '#9CA3AF' : '#424448';

  // 3. CONSTRUIR ARRAY CON TRADUCCIONES
  const datosTCA: TCAItem[] = [
    {
      titulo: t('term_1_title'),
      contenido: t('term_1_content'),
    },
    {
      titulo: t('term_2_title'),
      contenido: t('term_2_content'),
    },
    {
      titulo: t('term_3_title'),
      contenido: t('term_3_content'),
    },
    {
      titulo: t('term_4_title'),
      contenido: t('term_4_content'),
    },
    {
      titulo: t('term_5_title'),
      contenido: t('term_5_content'),
    },
    {
      titulo: t('term_6_title'),
      contenido: t('term_6_content'),
    },
    {
      titulo: t('term_7_title'),
      contenido: t('term_7_content'),
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
          {t('termsTitle')} {/* <-- Traducido */}
        </Text>
        <Text className="text-base text-center mb-6 text-gray-500">
          {t('termsSubtitle')} {/* <-- Traducido */}
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
            {t('termsFooter')} {/* <-- Traducido */}
          </Text>
          <TouchableOpacity
            onPress={() => console.log('Aceptado')}
            className="bg-orange-500 py-3 rounded-lg"
          >
            <Text className="text-white text-base font-bold text-center">
              {t('termsAccept')} {/* <-- Traducido */}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}