import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme as useRNScheme,
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- 1. IMPORTAR EL CONTEXTO DE IDIOMA ---
// Ajusta la ruta "../../.." si tu carpeta está en otro nivel
import { useLanguage } from '../../context/LanguageContext';

// --- Componente para Interruptores (Switch) ---
const SettingToggle = ({
  iconName,
  label,
  value,
  onValueChange,
  disabled = false,
  textColor,
  borderColor,
}: {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  textColor: string;
  borderColor: string;
}) => (
  <View
    className="flex-row justify-between items-center py-4"
    style={{ borderBottomWidth: 1, borderColor }}
  >
    <View className="flex-row items-center space-x-4">
      <Ionicons
        name={iconName}
        size={22}
        color={disabled ? '#9ca3af' : textColor}
      />
      <Text
        className={`text-base ${disabled ? 'text-gray-400' : ''}`}
        style={{ color: disabled ? '#9ca3af' : textColor }}
      >
        {label}
      </Text>
    </View>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: '#F97A4B' }}
      ios_backgroundColor="#E5E7EB"
      thumbColor={value ? '#ffffff' : '#f4f3f4'}
      disabled={disabled}
    />
  </View>
);

// --- Componente para Botones de Navegación (Flecha >) ---
const SettingAction = ({
  iconName,
  label,
  onPress,
  textColor,
  borderColor,
  isLast = false,
}: {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  textColor: string;
  borderColor: string;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row justify-between items-center py-4"
    style={{ borderBottomWidth: isLast ? 0 : 1, borderColor }}
  >
    <View className="flex-row items-center space-x-4">
      <Ionicons name={iconName} size={22} color={textColor} />
      <Text className="text-base" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  
  // --- 2. ACTIVAR EL HOOK DE IDIOMA ---
  const { language, setLanguage, t } = useLanguage();

  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const scheme = useRNScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E7EB';

  const isDarkMode = colorScheme === 'dark';

  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleDarkMode = (isOn: boolean) => {
    setIsTransitioning(true);
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setColorScheme(isOn ? 'dark' : 'light');

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0, 
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsTransitioning(false);
        });
      }, 50); 
    });
  };

  // --- 3. LÓGICA PARA EL SWITCH DE IDIOMA ---
  const toggleLanguage = (value: boolean) => {
    // value = true significa que el usuario movió el switch a la derecha -> Inglés
    setLanguage(value ? 'en' : 'es');
  };

  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <View className="px-5 pt-5">
        {/* TÍTULO PRINCIPAL TRADUCIDO */}
        <Text
          className="text-3xl font-bold mb-6"
          style={{ color: textColor }}
        >
          {t('settings')}
        </Text>

        {/* --- SECCIÓN GENERAL --- */}
        <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">
          {t('generalSection')}
        </Text>
        <View
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: cardBackground }}
        >
          <SettingToggle
            iconName={isDarkMode ? 'moon-outline' : 'sunny-outline'}
            label={t('darkMode')}
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            textColor={textColor}
            borderColor={borderColor}
          />
          <SettingToggle
            iconName="notifications-outline"
            label={t('notifications')}
            value={notifications}
            onValueChange={setNotifications}
            textColor={textColor}
            borderColor={borderColor}
          />
          
          {/* --- SWITCH DE IDIOMA AHORA ACTIVO --- */}
          <SettingToggle
            iconName="language-outline"
            // Muestra "Idioma (Español)" o "Idioma (English)"
            label={`${t('language')} (${language === 'es' ? 'Español' : 'English'})`}
            // Si es 'en', el switch está activado (derecha)
            value={language === 'en'}
            onValueChange={toggleLanguage}
            disabled={false} // ¡Ya no está deshabilitado!
            textColor={textColor}
            borderColor="transparent"
          />
        </View>

        {/* --- SECCIÓN AYUDA Y LEGAL --- */}
        <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">
          {t('helpSection')}
        </Text>
        <View
          className="rounded-lg p-4"
          style={{ backgroundColor: cardBackground }}
        >
          <SettingAction
            iconName="help-circle-outline"
            label={t('faq')}
            onPress={() => router.push('/drawer/help/faq')}
            textColor={textColor}
            borderColor={borderColor}
          />
          <SettingAction
            iconName="document-text-outline"
            label={t('terms')}
            onPress={() => router.push('/drawer/help/support')}
            textColor={textColor}
            borderColor={borderColor}
          />
          <SettingAction
            iconName="call-outline"
            label={t('support')}
            onPress={() => router.push('/drawer/help/soporteReal')}
            textColor={textColor}
            borderColor="transparent"
            isLast={true}
          />
        </View>

      </View>

      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim }, 
        ]}
        pointerEvents={isTransitioning ? 'auto' : 'none'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'black', 
    zIndex: 9999, 
  },
});