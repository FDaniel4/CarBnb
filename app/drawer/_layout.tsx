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
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

const DrawerLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const scheme = useColorScheme();
  const background = useThemeColor({}, "background");
    const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';// Para el modal
  const textColor = useThemeColor({}, "text");

  const handleGoHome = () => {
    router.push("/drawer/home");
  };

  return (
    <>
      {/* 🔔 Modal flotante (Refactorizado con Tailwind y Tema) */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <Pressable
          className="flex-1 justify-start items-end pt-16 pr-2.5"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }} 
          onPress={() => setShowNotifications(false)}
        >
          <Pressable
            className="w-72 rounded-xl p-4 shadow-lg"
            style={{ backgroundColor: cardBackground }}
          >
            <Text className="font-bold text-lg text-orange-500 mb-2.5">
              🔔 Notificaciones
            </Text>
            <Text className="text-base mb-6" style={{ color: textColor }}>
              Tu reserva fue confirmada ✅
            </Text>
            <Text className="text-base mb-6" style={{ color: textColor }}>
              Tienes un nuevo mensaje 💬
            </Text>
            <Text className="text-base" style={{ color: textColor }}>
              Recibiste una reseña 🌟
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={({ navigation }) => ({
          overlayColor: "rgba(0,0,0,0.5)",
          drawerActiveTintColor: "orange",
          headerShadowVisible: false,
          headerStyle: {
            height: 120,
            backgroundColor: background, 
          },
          headerTitleAlign: "center",
          sceneStyle: { backgroundColor: background }, 
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
                source={require("../../assets/images/Logo-trans.png")}
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
            drawerIcon: ({ color, size }) => (
              <Ionicons name="help-outline" size={size} color={color} />
            ),
          }}
        />

        {/* --- Pantallas ocultas (Todas juntas) --- */}
        <Drawer.Screen
          name="carDetail"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Detalles del Auto",
          }}
        />
        <Drawer.Screen
          name="payment"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Pagar Reserva",
          }}
        />
        <Drawer.Screen
          name="searchResults"
          options={{
            drawerItemStyle: { display: "none" },
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
        <Drawer.Screen
          name="profile/changePassword"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Cambiar contraseña",
          }}
        />
        <Drawer.Screen
          name="help/support"
          options={{
            drawerLabel: "Terms & Conditions",
            title: "Terminos y condiciones",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="help/soporteReal"
          options={{
            drawerLabel: "Support",
            title: "TSoporte",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="call-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
            name="Settings"
            options={{
              drawerLabel: "Settings",
              title: "",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
                
              ),
            }}
          />
        <Drawer.Screen
          name="help/logout"
          options={{
            drawerLabel: "Log out",
            title: "logout",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;