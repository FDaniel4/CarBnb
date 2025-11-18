import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image as RNImage, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReservationIcon = (props: { size: 'xl'; color: string }) => {
  const sizeMap = { xl: 28 }; 
  return (
    <MaterialCommunityIcons
      name="clipboard-check-outline"
      size={sizeMap[props.size]}
      color={props.color}
    />
  );
};
const UserIcon = (props: { size: 'sm'; color: string }) => {
  const sizeMap = { sm: 16 }; 
  return (
    <FontAwesome name="user-o" size={sizeMap[props.size]} color={props.color} />
  );
};
const BagIcon = (props: { size: 'sm'; color: string }) => {
  const sizeMap = { sm: 16 }; 
  return (
    <MaterialCommunityIcons
      name="briefcase-outline"
      size={sizeMap[props.size]}
      color={props.color}
    />
  );
};

// --- 1. Definimos un TIPO flexible para las reservaciones ---
type ReservationItem = {
  id: number;
  image: any;
  users?: number; // Hacemos 'users' opcional
  bags?: number; // Hacemos 'bags' opcional
};

// --- Datos de Ejemplo (¡Usa tus imágenes!) ---
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

// --- 4. Componente de Tarjeta de Reserva  ---
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
        {item.bags && ( // Solo muestra si existe
          <View className="flex-row space-x-1 items-center">
            <BagIcon size="sm" color="gray" />
            <Text className="text-sm text-gray-500">{item.bags}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// --- Pantalla Principal "My Reservations"  ---
export default function MyReservationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5">
          {/* ----- 1. Título  ----- */}
          <View className="flex-row items-center space-x-2 mb-6 pt-4">
            <ReservationIcon size="xl" color="#F97A4B" />
            <Text className="text-2xl font-bold text-gray-900">
              My reservations
            </Text>
          </View>

          {/* ----- 2. Reservas Antiguas  ----- */}
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

          {/* ----- 3. Reservas Futuras  ----- */}
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
