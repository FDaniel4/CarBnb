import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DrawerLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      {/* 🔔 Modal flotante de notificaciones */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowNotifications(false)}>
          <Pressable style={styles.notificationBox}>
            <Text style={styles.title}>🔔 Notificaciones</Text>
            <Text style={styles.title}>                                    </Text>
            <Text style={styles.notification}>Tu reserva fue confirmada ✅</Text>
            <Text style={styles.title}>                                    </Text>
            <Text style={styles.notification}>Tienes un nuevo mensaje 💬</Text>
            <Text style={styles.title}>                                    </Text>
            <Text style={styles.notification}>Recibiste una reseña 🌟</Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Drawer principal */}
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          overlayColor: 'rgba(0,0,0,0.5)',
          drawerActiveTintColor: 'orange',
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          sceneStyle: { backgroundColor: 'white' },
          // Aseguramos que el Drawer siga abriendo desde la derecha
          drawerPosition: 'right', 

          // ✅ MOVIDO a headerRight para que aparezca en el lado derecho
          headerRight: ({ tintColor }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              
              {/* Botón de notificaciones (aparece PRIMERO, a la izquierda) */}
              <TouchableOpacity onPress={() => setShowNotifications(true)}>
                <Ionicons name="notifications-outline" size={30} color="orange" />
              </TouchableOpacity>
              
              {/* Espacio pequeño entre íconos */}
              <View style={{ width: 10 }} />

              {/* Botón de menú (aparece SEGUNDO, justo a la derecha) */}
              <DrawerToggleButton tintColor={tintColor} />
            </View>
          ),
          // ❌ Eliminado: Ya no necesitamos headerLeft
          headerLeft: () => null,
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile/profile"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  notificationBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    width: 280,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'orange',
    marginBottom: 10,
  },
  notification: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
});

export default DrawerLayout;