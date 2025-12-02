import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase y Hooks ---
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useColorScheme } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { auth, db } from '../../utils/firebaseConfig'; // Ajusta ruta relativa si es necesario

// Tipo de dato que viene de Firestore
type Reservation = {
  id: string;
  carName: string;
  carImage: string;
  pricePaid: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  dates: string;
  createdAt: any;
};

export default function MyReservationsScreen() {
  const router = useRouter();
  
  // --- Estados ---
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#F3F4F6';

  // 1. Cargar Reservas
  useEffect(() => {
    // Si es invitado, mostramos pantalla de bloqueo
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        setIsGuest(true);
        setLoading(false);
        return;
    }

    // Query: Dame las reservas donde YO soy el renterId, ordenadas por fecha
    const q = query(
      collection(db, 'reservations'),
      where('renterId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      
      setReservations(data);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper para el color del estatus
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 dark:bg-green-900';
          case 'completed': return 'bg-blue-100 dark:bg-blue-900';
          case 'cancelled': return 'bg-red-100 dark:bg-red-900';
          default: return 'bg-gray-100 dark:bg-gray-800';
      }
  };

  const getStatusTextColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'text-green-700 dark:text-green-300';
          case 'completed': return 'text-blue-700 dark:text-blue-300';
          case 'cancelled': return 'text-red-700 dark:text-red-300';
          default: return 'text-gray-700 dark:text-gray-300';
      }
  };

  if (loading) {
    return (
        <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
            <ActivityIndicator size="large" color="#F97A4B" />
        </SafeAreaView>
    );
  }

  // --- VISTA INVITADO (BLOQUEO) ---
  if (isGuest) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
          <View className="flex-1 justify-center items-center p-6">
              <MaterialCommunityIcons name="lock-alert-outline" size={80} color={scheme === 'dark' ? '#555' : '#DDD'} />
              <Text className="text-2xl font-bold mt-6 text-center" style={{ color: textColor }}>
                  Historial Restringido
              </Text>
              <Text className="text-gray-500 mt-2 text-center mb-10 text-base leading-6">
                  Inicia sesión para ver tus viajes pasados y futuros.
              </Text>
              <TouchableOpacity
                  className="bg-orange-500 py-4 px-10 rounded-full shadow-lg"
                  onPress={() => signOut(auth)}
              >
                  <Text className="text-white font-bold text-lg">Iniciar Sesión</Text>
              </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }

  // --- VISTA PRINCIPAL ---
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5 pb-20">
        
        {/* Encabezado */}
        <View className="flex-row items-center space-x-3 mb-6">
            <MaterialCommunityIcons name="clipboard-check-outline" size={32} color="#F97A4B" />
            <Text className="text-3xl font-bold" style={{ color: textColor }}>
                Mis Reservaciones
            </Text>
        </View>

        {reservations.length === 0 ? (
          // Estado Vacío
          <View className="items-center mt-20 opacity-50">
             <MaterialCommunityIcons name="car-key" size={80} color="gray" />
             <Text className="text-gray-500 mt-4 text-lg text-center">Aún no tienes viajes.</Text>
             <TouchableOpacity 
                className="mt-4 bg-orange-100 px-6 py-3 rounded-full"
                onPress={() => router.push('/drawer/home')}
             >
                 <Text className="text-orange-500 font-bold">Explorar Autos</Text>
             </TouchableOpacity>
          </View>
        ) : (
          // Lista de Reservas
          <View className="space-y-4">
              {reservations.map((item) => (
                <View 
                    key={item.id} 
                    className="flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border"
                    style={{ backgroundColor: cardBg, borderColor }}
                >
                    {/* Imagen del Auto */}
                    <View className="w-32 h-32 bg-gray-200">
                        <RNImage 
                            source={{ uri: item.carImage || 'https://placehold.co/200x200/png?text=Car' }} 
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Detalles */}
                    <View className="flex-1 p-3 justify-between">
                        <View>
                            <View className="flex-row justify-between items-start">
                                <Text className="font-bold text-base flex-1 mr-2" numberOfLines={1} style={{ color: textColor }}>
                                    {item.carName}
                                </Text>
                                {/* Badge de Status */}
                                <View className={`px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
                                    <Text className={`text-[10px] uppercase font-bold ${getStatusTextColor(item.status)}`}>
                                        {item.status === 'confirmed' ? 'Confirmado' : item.status}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-xs text-gray-500 mt-1">
                                {item.dates}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-end">
                            <View>
                                <Text className="text-xs text-gray-400 uppercase">Total Pagado</Text>
                                <Text className="text-lg font-bold text-orange-500">${item.pricePaid}</Text>
                            </View>
                            {/* Botón de acción pequeño (ej. ver detalle) */}
                            <TouchableOpacity className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                <Ionicons name="chevron-forward" size={16} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}