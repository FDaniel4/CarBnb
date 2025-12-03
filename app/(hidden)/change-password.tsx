import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ChangePassword = () => {
  const router = useRouter();

  // Datos simulados del usuario
  const user = {
    name: 'Brendan Moore',
    email: 'brendamoo@gmail.com',
    phone: '+52 (449) 000 0000',
  };

  // Estados de contraseñas
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Validación
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    if (newPassword !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    Alert.alert('Éxito', 'Tu contraseña ha sido cambiada correctamente.');
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Datos del usuario */}
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222' }}>{user.name}</Text>
        <Text style={{ color: '#666', marginTop: 5 }}>{user.email}</Text>
        <Text style={{ color: '#666', marginTop: 2 }}>{user.phone}</Text>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="Current password"
        placeholderTextColor="#999"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#eb6409',
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          color: '#222', // color del texto
        }}
      />
      <TextInput
        placeholder="New password"
        placeholderTextColor="#999"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#eb6409',
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          color: '#222',
        }}
      />
      <TextInput
        placeholder="Repeat new password"
        placeholderTextColor="#999"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#eb6409',
          padding: 12,
          marginBottom: 25,
          borderRadius: 8,
          color: '#222',
        }}
      />

      {/* Botón Cambiar Contraseña */}
      <TouchableOpacity
        onPress={handleChangePassword}
        style={{
          backgroundColor: '#ff6700',
          paddingVertical: 14,
          borderRadius: 8,
          width: '100%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          Change password
        </Text>
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity
        onPress={() => router.push('/drawer/profile/profile')} 
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: '#eb6409', fontWeight: '600', fontSize: 16 }}>
          Go back
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
