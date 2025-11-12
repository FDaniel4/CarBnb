import CustomDrawer from "@/components/shared/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DrawerLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/drawer/home");
  };

  return (
    <>
      {/* 🔔 Modal flotante de notificaciones (de desarrollo) */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowNotifications(false)}
        >
          <Pressable style={styles.notificationBox}>
            <Text style={styles.title}>🔔 Notificaciones</Text>
            <Text style={styles.notification}>
              Tu reserva fue confirmada ✅
            </Text>
            <Text style={styles.notification}>Tienes un nuevo mensaje 💬</Text>
            <Text style={[styles.notification, { marginBottom: 0 }]}>
              Recibiste una reseña 🌟
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- INICIO DEL MERGE RESUELTO --- */}
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={({ navigation }) => ({ // Usamos la versión con ({ navigation })
          overlayColor: "rgba(0,0,0,0.5)",
          drawerActiveTintColor: "orange",
          headerShadowVisible: false,
          headerStyle: {
            height: 130,
            backgroundColor: "white",
          },
          headerTitleAlign: "center",
          sceneStyle: { backgroundColor: "white" },
          drawerPosition: "right",
          drawerStyle: { width: 310 },
          headerTitle: "",

          headerRight: ({ tintColor }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              {/* Botón de notificaciones */}
              <TouchableOpacity onPress={() => setShowNotifications(true)}>
                <Ionicons
                  name="notifications-outline"
                  size={40}
                  color="orange"
                />
              </TouchableOpacity>

              <View style={{ width: 10 }} />

              {/* Botón de menú */}
              <TouchableOpacity
                onPress={() =>
                  navigation.dispatch(DrawerActions.openDrawer())
                }
              >
                <Ionicons name="menu" size={40} color="orange" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoHome} className="ml-4">
              <Image
                source={require("../../assets/images/Logo-blanco.jpg")}
                className="w-24 h-24"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        })}
      >
        {/* --- Pantallas principales (Comunes) --- */}
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile/profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="booknow"
          options={{
            drawerLabel: "Book Now",
            title: "Book Now",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="publish/publishcar"
          options={{
            drawerLabel: "Publicar Auto",
            title: "Publicar Auto",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="myreservations"
          options={{
            drawerLabel: "Mis Reservaciones",
            title: "Mis Reservaciones",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
        />

        {/* --- Pantallas de 'desarrollo' --- */}
        <Drawer.Screen
          name="autos/mycars"
          options={{
            drawerLabel: "Mis Autos",
            title: "Mis Autos",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-sport-outline" size={size} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="help/faq"
          options={{
            drawerLabel: "Help & FAQ",
            title: "Frequently Asked Questions",
          }}
        />

        {/* --- Pantallas ocultas (Todas juntas) --- */}
        <Drawer.Screen
            name="carDetail"
            options={{
              drawerItemStyle: { display: 'none' },
              title: "Detalles del Auto",
            }}
          />
          <Drawer.Screen
            name="payment"
            options={{
              drawerItemStyle: { display: 'none' },
              title: "Pagar Reserva",
            }}
          />
          <Drawer.Screen
            name="searchResults"
            options={{
              drawerItemStyle: { display: 'none' },
              title: "Autos Disponibles",
            }}
          />
        <Drawer.Screen
          name="autos/editcar"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Editar mi Auto",
          }}
        />
      </Drawer>
    </>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 10,
  },
  notificationBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    width: 280,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "orange",
    marginBottom: 10,
  },
  notification: {
    fontSize: 15,
    color: "#333",
    marginBottom: 25,
  },
});

export default DrawerLayout;