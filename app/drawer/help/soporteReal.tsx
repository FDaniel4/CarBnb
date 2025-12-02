import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SoporteReal() {
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleCall = () => {
    Linking.openURL('tel:4499465030');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:carbnb@support.com');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-3xl font-bold mb-10" style={{ color: textColor }}>
          Soporte
        </Text>

        <TouchableOpacity
          className="items-center my-10"
          onPress={handleCall}
        >
          {/* Usamos Ionicons en lugar de SVG para consistencia y facilidad */}
          <Ionicons name="call-outline" size={100} color="orange" />
          <Text className="mt-3 text-lg font-semibold" style={{ color: textColor }}>
            Speak with support staff
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center my-10"
          onPress={handleEmail}
        >
          <Ionicons name="mail-outline" size={100} color="orange" />
          <Text className="mt-3 text-lg font-semibold" style={{ color: textColor }}>
            Send an email to support
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}