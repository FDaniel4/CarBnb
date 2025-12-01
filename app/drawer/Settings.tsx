import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  useColorScheme as useRNScheme,
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';


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
    />
  </View>
);

export default function SettingsScreen() {
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

  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <View className="px-5 pt-5">
        <Text
          className="text-3xl font-bold mb-6"
          style={{ color: textColor }}
        >
          Configuración
        </Text>

        <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">
          General
        </Text>
        <View
          className="rounded-lg p-4"
          style={{ backgroundColor: cardBackground }}
        >
          <SettingToggle
            iconName={isDarkMode ? 'moon-outline' : 'sunny-outline'}
            label="Modo Oscuro"
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            textColor={textColor}
            borderColor={borderColor}
          />
          <SettingToggle
            iconName="notifications-outline"
            label="Notificaciones"
            value={notifications}
            onValueChange={setNotifications}
            textColor={textColor}
            borderColor={borderColor}
          />
          <SettingToggle
            iconName="language-outline"
            label="Idioma (Próximamente)"
            value={false}
            onValueChange={() => {}}
            disabled={true}
            textColor={textColor}
            borderColor={borderColor}
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