import { router } from 'expo-router';
import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.error('Logout Error:', error);
        Alert.alert('Error', 'Could not sign out.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging out...' : 'Log Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 100, alignItems: 'center', justifyContent: 'center' },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default LogoutButton;