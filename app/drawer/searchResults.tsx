import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable, 
  Image as RNImage, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserIcon = (props: { size: number; color: string }) => (
  <FontAwesome name="user" size={props.size} color={props.color} />
);
const CogIcon = (props: { size: number; color: string }) => (
  <Ionicons name="cog" size={props.size} color={props.color} />
);

// --- Datos de los Autos Disponibles (Simulación) ---
const availableCars = [
  {
    id: 1,
    name: 'Volkswagen Vento',
    style: '4 Puertas',
    image: require('../../assets/images/Autos/vento_lrg.jpg'),
    price: '4',
    passengers: 4,
    transmission: 'Automático',
  },
  {
    id: 2,
    name: 'Chevrolet Aveo',
    style: '5 Puertas',
    image: require('../../assets/images/Autos/aveo_5door_lrg.jpg'),
    price: '8',
    passengers: 5,
    transmission: 'Automático',
  },
  {
    id: 3,
    name: 'Nissan Kicks',
    style: 'SUV',
    image: require('../../assets/images/Autos/kicks_lrg.jpg'),
    price: '12',
    passengers: 5,
    transmission: 'Automático',
  },
  {
    id: 4,
    name: 'Chevrolet Trax',
    style: 'SUV',
    image: require('../../assets/images/Autos/trax_lrg.jpg'),
    price: '15',
    passengers: 5,
    transmission: 'Automático',
  },
];

// --- Componente de la Tarjeta de Auto  ---
const CarListItem = ({ car }: { car: (typeof availableCars)[0] }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        // Lógica de navegación 
        router.push({
          pathname: '/drawer/carDetail',
          params: {
            name: car.name,
            style: car.style,
            price: car.price,
            passengers: car.passengers,
            transmission: car.transmission,
          },
        });
      }}
      // 5. Reemplazamos 'sx' con 'className' funcional
      className="flex-row rounded-lg border border-gray-200 overflow-hidden bg-white active:bg-gray-100"
    >
      <View className="flex-row">
        <View className="w-[140px] h-[100px] bg-gray-100">
          <RNImage
            source={car.image}
            alt={car.name}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        <View className="p-3 flex-1 space-y-1">
          <Text className="text-base font-bold text-gray-900">
            {car.name}
          </Text>

          <View className="flex-row space-x-3 items-center">
            <View className="flex-row items-center space-x-1">
              <UserIcon size={14} color="#374151" />
              <Text className="text-xs text-gray-800">{car.passengers}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <CogIcon size={14} color="#374151" />
              <Text className="text-xs text-gray-800">{car.transmission}</Text>
            </View>
          </View>

          <View className="flex-1" />

          <View>
            <Text className="text-xl font-bold text-orange-500">
              ${car.price}
              <Text className="text-xs font-normal text-gray-900"> /día</Text>
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// --- Pantalla de Resultados de Búsqueda  ---
export default function SearchResultsScreen() {
  // Lógica de 'params' 
  const params = useLocalSearchParams() as {
    city?: string;
    from?: string;
    to?: string;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5 space-y-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Resultados en {params.city || 'tu ciudad'}
            </Text>
            <Text className="text-sm text-gray-900">
              Desde {params.from || '...'} hasta {params.to || '...'}
            </Text>
          </View>

          {availableCars.map((car) => (
            <CarListItem key={car.id} car={car} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
