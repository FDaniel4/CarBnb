import CustomDrawer from "@/components/shared/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  ActivityIndicator
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

// --- Firebase ---
import { 
  collection, 
  onSnapshot, 
  // orderBy, // <-- ELIMINADO para evitar error de índice
  query, 
  where, 
  writeBatch, 
  doc 
} from "firebase/firestore";
import { auth, db } from "../../utils/firebaseConfig";

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from "../context/LanguageContext";

// Tipo para la notificación
type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: any;
};

const DrawerLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  // Estados para notificaciones
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();

  const scheme = useColorScheme();
  const background = useThemeColor({}, "background");
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const textColor = useThemeColor({}, "text");

  const handleGoHome = () => {
    router.push("/drawer/home");
  };

  // --- 1. ESCUCHAR NOTIFICACIONES EN TIEMPO REAL ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Buscamos en la colección 'notifications' las que sean para este usuario
    // SOLUCIÓN: Quitamos 'orderBy' para no requerir índice compuesto en Firestore
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AppNotification));

      // ORDENAMIENTO EN CLIENTE (JavaScript)
      // Ordenamos por fecha descendente (lo más nuevo arriba)
      notifs.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
      });

      setNotifications(notifs);
      
      // Contamos cuántas no han sido leídas
      const unread = notifs.filter(n => !n.read).length;
      setUnreadCount(unread);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. MARCAR COMO LEÍDAS AL ABRIR ---
  const handleOpenNotifications = async () => {
    setShowNotifications(true);

    // Si hay no leídas, las marcamos como leídas en lote (batch)
    if (unreadCount > 0) {
      const batch = writeBatch(db);
      
      notifications.forEach(n => {
        if (!n.read) {
          const ref = doc(db, 'notifications', n.id);
          batch.update(ref, { read: true });
        }
      });

      try {
        await batch.commit();
        // El listener (useEffect) actualizará el unreadCount a 0 automáticamente
      } catch (error) {
        console.error("Error marcando notificaciones:", error);
      }
    }
  };

  return (
    // CORRECCIÓN CRÍTICA: Usar View con flex: 1 en lugar de Fragment <>
    <View style={{ flex: 1 }}>
      {/* 🔔 Modal flotante */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <Pressable
          className="flex-1 justify-start items-end pt-28 pr-4"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }} 
          onPress={() => setShowNotifications(false)}
        >
          <Pressable
            className="w-80 rounded-2xl p-5 shadow-xl max-h-[500px]"
            style={{ backgroundColor: cardBackground }}
            onPress={(e) => e.stopPropagation()} // Evita cerrar al tocar dentro
          >
            <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <Text className="font-bold text-xl text-orange-500">
                🔔 {t('notifications') || "Notificaciones"}
                </Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                    <Ionicons name="close" size={24} color="gray" />
                </TouchableOpacity>
            </View>
            
            {loading ? (
                <ActivityIndicator color="orange" />
            ) : notifications.length === 0 ? (
                <View className="py-10 items-center">
                    <Ionicons name="notifications-off-outline" size={40} color="gray" />
                    <Text className="text-gray-400 mt-2 text-center">No tienes notificaciones nuevas.</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {notifications.map((item) => (
                        <View key={item.id} className="mb-4 border-b border-gray-50 pb-3 last:border-0">
                            <Text className="font-bold text-base mb-1" style={{ color: textColor }}>
                                {item.title}
                            </Text>
                            <Text className="text-sm text-gray-500 leading-5">
                                {item.body}
                            </Text>
                            {/* Fecha relativa simple */}
                            <Text className="text-[10px] text-gray-400 mt-2 text-right">
                                {item.createdAt?.toDate().toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
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
          headerShown: true, // Aseguramos que se muestre

          headerRight: ({ tintColor }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              {/* Botón de notificaciones */}
              <TouchableOpacity onPress={handleOpenNotifications} className="relative p-2">
                <Ionicons
                  name="notifications-outline"
                  size={32}
                  color="orange"
                />
                
                {/* --- PUNTITO ROJO (BADGE) --- */}
                {unreadCount > 0 && (
                    <View className="absolute top-2 right-2 bg-red-500 rounded-full w-3.5 h-3.5 border-2 border-white dark:border-black justify-center items-center">
                    </View>
                )}
              </TouchableOpacity>

              <View style={{ width: 5 }} />

              {/* Botón de menú */}
              <TouchableOpacity
                onPress={() =>
                  navigation.dispatch(DrawerActions.openDrawer())
                }
                className="p-2"
              >
                <Ionicons name="menu" size={36} color="orange" />
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
            drawerLabel: t('home'), 
            title: t('home'), 
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile/profile"
          options={{
            drawerLabel: t('profile'), 
            title: t('profile'), 
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="booknow"
          options={{
            drawerLabel: t('bookNow'), 
            drawerItemStyle: { display: "none" },
            title: t('bookNow'), 
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="publish/publishcar"
          options={{
            drawerLabel: t('publishCar'), 
            title: t('publishCarTitle'), 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="myreservations"
          options={{
            drawerLabel: t('myreservations'), 
            title: t('myReservations'), 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
        />

        {/* --- Pantallas de 'desarrollo' --- */}
        <Drawer.Screen
          name="autos/mycars"
          options={{
            drawerLabel: t('myCarsLabel'), 
            title: t('myCarsTitle'), 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="car-sport-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="help/faq"
          options={{
            drawerLabel: t('helpFaq'), 
            title: t('faq'), 
            drawerItemStyle: { display: "none" },
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
            title: t('carDetail'), 
          }}
        />
        <Drawer.Screen
          name="payment"
          options={{
            drawerItemStyle: { display: "none" },
            title: t('payment'), 
          }}
        />
        <Drawer.Screen
          name="searchResults"
          options={{
            drawerItemStyle: { display: "none" },
            title: t('searchResults'), 
          }}
        />
        <Drawer.Screen
          name="autos/editcar"
          options={{
            drawerItemStyle: { display: "none" },
            title: t('editCarTitle'), 
          }}
        />
        <Drawer.Screen
          name="profile/changePassword"
          options={{
            drawerItemStyle: { display: "none" },
            title: t('changePassword'), 
          }}
        />
        <Drawer.Screen
          name="help/support"
          options={{
            drawerLabel: t('terms'), 
            drawerItemStyle: { display: "none" },
            title: t('terms'), 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="help/soporteReal"
          options={{
            drawerLabel: t('support'), 
            drawerItemStyle: { display: "none" },
            title: t('support'), 
            drawerIcon: ({ color, size }) => (
              <Ionicons name="call-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
            name="settings/Settings"
            options={{
              drawerLabel: t('settings'), 
              title: "",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
                
              ),
            }}
          />
      </Drawer>
    </View>
  );
};

export default DrawerLayout;