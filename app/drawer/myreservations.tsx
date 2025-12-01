import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Mantenemos tu router
import React from 'react';
import {
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Componentes de Iconos (Adaptados) ---
const ReservationIcon = (props: { size: 'xl'; color: string }) => {
  const sizeMap = { xl: 28 };
  return (
    <MaterialCommunityIcons
      name="clipboard-check-outline"
      size={sizeMap[props.size] || 24}
      color={props.color}
    />
  );
};
const UserIcon = (props: { size: 'sm' | number; color: string }) => {
  // Ajuste para aceptar número o string, por compatibilidad
  const iconSize = typeof props.size === 'number' ? props.size : 16;
  return (
    <FontAwesome name="user-o" size={iconSize} color={props.color} />
  );
};
const BagIcon = (props: { size: 'sm'; color: string }) => {
  return (
    <MaterialCommunityIcons
      name="briefcase-outline"
      size={16}
      color={props.color}
    />
  );
};

// --- Definimos un TIPO flexible para las reservaciones ---
type ReservationItem = {
  id: number;
  image: any;
  users?: number;
  bags?: number;
};

// --- Datos de Ejemplo ---
const oldReservations: ReservationItem[] = [
  {
    id: 1,
    image: require('../../assets/images/Autos/aveo_5door_lrg.jpg'),
    users: 5,
    bags: 4,
  },
  {
    id: 2,
    image: require('../../assets/images/Autos/vento_lrg.jpg'),
    users: 5,
    bags: 4,
  },
  {
    id: 3,
    image: require('../../assets/images/Autos/kicks_lrg.jpg'),
    users: 5,
    bags: 2,
  },
];

const futureReservations: ReservationItem[] = [
  {
    id: 4,
    image: require('../../assets/images/Autos/cavalier_lrg.jpg'),
    bags: 4,
  },
  {
    id: 5,
    image: require('../../assets/images/Autos/trax_lrg.jpg'),
    users: 5,
    bags: 4,
  },
];

// --- Componente de Tarjeta de Reserva (Estilo Desarrollo - Tailwind) ---
const ReservationCard = ({ item }: { item: ReservationItem }) => {
  return (
    <View className="mr-4 w-[220px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      <RNImage
        source={item.image}
        alt="Car"
        className="w-full h-32 bg-gray-100"
        resizeMode="contain"
      />
      <View className="p-2 flex-row space-x-4 justify-center bg-gray-50 border-t border-gray-200">
        {item.users && (
          <View className="flex-row space-x-1 items-center">
            <UserIcon size="sm" color="gray" />
            <Text className="text-sm text-gray-500">{item.users}</Text>
          </View>
        )}
        {item.bags && (
          <View className="flex-row space-x-1 items-center">
            <BagIcon size="sm" color="gray" />
            <Text className="text-sm text-gray-500">{item.bags}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// --- Pantalla Principal ---
export default function MyReservationsScreen() {
  const router = useRouter(); 

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5">
          {/* ----- 1. Título y Header ----- */}
          {/* Aquí integré tu botón de perfil con el estilo nuevo de desarrollo */}
          <View className="flex-row items-center justify-between mb-6 pt-4">
            
            {/* Tu botón de perfil restaurado (Izquierda) */}
            <TouchableOpacity onPress={() => router.push('/drawer/profile/profile')}>
               <UserIcon size={24} color="#1f2937" />
            </TouchableOpacity>

            {/* Título Centralizado */}
            <View className="flex-row items-center space-x-2">
                <ReservationIcon size="xl" color="#F97A4B" />
                <Text className="text-2xl font-bold text-gray-900">
                My reservations
                </Text>
            </View>

            {/* Espacio invisible a la derecha para equilibrar el header */}
            <View style={{ width: 24 }} />
          </View>

          {/* ----- 2. Reservas Antiguas ----- */}
          <View className="space-y-4 mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Old reservations
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {oldReservations.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>

          {/* ----- 3. Reservas Futuras ----- */}
          <View className="space-y-4">
            <Text className="text-xl font-bold text-gray-800">
              Future reservations
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {futureReservations.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}