import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Hooks y Firebase ---
import { useThemeColor } from '@/hooks/use-theme-color';
import { auth } from '@/utils/firebaseConfig';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
} from 'firebase/auth';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  // Estados
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Tema
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleChangePassword = async () => {
    // 1. Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'las contraseñas nuevas no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    if (user && user.email) {
      // 2. Crear credencial para re-autenticar
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      try {
        // 3. Re-autenticar al usuario (Confirmar que es él)
        await reauthenticateWithCredential(user, credential);

        // 4. Si pasa, actualizamos la contraseña
        await updatePassword(user, newPassword);

        setLoading(false);
        Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (error: any) {
        setLoading(false);
        console.error(error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'La contraseña actual es incorrecta.');
        } else {
          Alert.alert('Error', 'No se pudo actualizar la contraseña. Intenta nuevamente.');
        }
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'No se encontró el usuario.');
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5">
        <View className="items-center mb-8 mt-4">
          <Text className="text-2xl font-bold" style={{ color: textColor }}>
            Cambiar Contraseña
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            Por seguridad, ingresa tu contraseña actual antes de crear una nueva.
          </Text>
        </View>

        <View className="space-y-4">
          {/* Contraseña Actual */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>Contraseña Actual</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="lock-closed-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-base text-black dark:text-white" // Agregado dark:text-white para visibilidad
              />
            </View>
          </View>

          {/* Nueva Contraseña */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>Nueva Contraseña</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="key-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nueva contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-base text-black dark:text-white"
              />
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>Confirmar Nueva Contraseña</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="checkmark-circle-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-base text-black dark:text-white"
              />
            </View>
          </View>
        </View>

        {/* Botón de Guardar */}
        <TouchableOpacity
          className={`mt-8 py-4 rounded-xl items-center shadow-sm ${loading ? 'bg-gray-400' : 'bg-orange-500'}`}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">
              Actualizar Contraseña
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}