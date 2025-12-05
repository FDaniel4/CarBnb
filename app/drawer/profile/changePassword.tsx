import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Hooks y Firebase ---
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { useThemeColor } from '../../../hooks/use-theme-color';
import { auth } from '../../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();
  
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
      Alert.alert(t('error'), t('emptyFields'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('error'), t('passwordsDoNotMatch'));
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(t('error'), t('passwordTooShort'));
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
        Alert.alert(t('successTitle'), t('passwordUpdated'), [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (error: any) {
        setLoading(false);
        console.error(error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
          Alert.alert(t('error'), t('currentPasswordIncorrect'));
        } else {
          Alert.alert(t('error'), t('updatePasswordError'));
        }
      }
    } else {
      setLoading(false);
      Alert.alert(t('error'), t('userNotFound'));
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5">
        <View className="items-center mb-8 mt-4">
          <Text className="text-2xl font-bold" style={{ color: textColor }}>
            {t('changePasswordTitle')}
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            {t('changePasswordSubtitle')}
          </Text>
        </View>

        <View className="space-y-4">
          {/* Contraseña Actual */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>{t('currentPasswordLabel')}</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="lock-closed-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={t('currentPasswordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-base text-black dark:text-white"
              />
            </View>
          </View>

          {/* Nueva Contraseña */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>{t('newPasswordLabel')}</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="key-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t('newPasswordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-base text-black dark:text-white"
              />
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View>
            <Text className="mb-2 font-semibold" style={{ color: textColor }}>{t('confirmPasswordLabel')}</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200">
              <Ionicons name="checkmark-circle-outline" size={20} color="gray" className="mr-3" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('confirmPasswordPlaceholder')}
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
              {t('updatePasswordBtn')}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}