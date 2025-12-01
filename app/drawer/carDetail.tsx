import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserIcon = (props: { size: number; color: string }) => (
  <FontAwesome name="user" size={props.size} color={props.color} />
);
const CogIcon = (props: { size: number; color: string }) => (
  <Ionicons name="cog" size={props.size} color={props.color} />
);

// --- Función para obtener la imagen correcta ---
const getImageFromName = (name: string) => {
  if (name === 'Kia Soul') {
    return require('../../assets/images/Autos/aveo_5door_lrg.jpg');
  }
  if (name === 'Volkswagen Vento') {
    // Asumiendo que Vento usa vento_lrg.jpg
    return require('../../assets/images/Autos/vento_lrg.jpg');
  }
  if (name === 'Ford Mustang') {
    // Asumiendo que Mustang usa jetta_lrg.jpg
    return require('../../assets/images/Autos/jetta_lrg.jpg');
  }
  // Añade más 'if' para otros autos
  return require('../../assets/images/Autos/kicks_lrg.jpg'); // Imagen por defecto
};

export default function CarDetailScreen() {
  const router = useRouter();

  // 1. Obtenemos los parámetros 
  const params = useLocalSearchParams() as {
    name: string;
    style: string;
    price: string;
    passengers: string;
    transmission: string;
  };

  const imageSource = getImageFromName(params.name);

  // 2. Lógica de navegación
  const handleReserve = () => {
    router.push({
      pathname: '/drawer/payment',
      params: {
        carName: params.name,
        price: params.price,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-grow bg-white">
        <View className="w-full h-64 bg-gray-100">
          <RNImage
            source={imageSource}
            alt={params.name}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        <View className="p-5 space-y-4">
          <Text className="text-3xl font-bold text-gray-900">
            {params.name}
          </Text>
          <Text className="text-lg text-gray-900">{params.style}</Text>

          <View className="flex-row space-x-6 items-center bg-gray-50 p-3 rounded-lg">
            <View className="flex-row items-center space-x-2">
              <UserIcon size={24} color="#1f2937" />
              <Text className="text-base text-gray-900">
                {params.passengers} Pasajeros
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <CogIcon size={24} color="#1f2937" />
              <Text className="text-base text-gray-900">
                {params.transmission}
              </Text>
            </View>
          </View>

          {/* Descripción Falsa */}
          <Text className="mt-4 text-gray-900">
            Disfruta de un viaje cómodo y seguro con nuestro {params.name}.
            Perfecto para explorar la ciudad o hacer un viaje por carretera.
            Equipado con todas las comodidades que necesitas para una
            experiencia inolvidable.
          </Text>

          {/* Precio (abajo) */}
          <View className="flex-row justify-between items-center mb-4 mt-6">
            <Text className="text-4xl font-bold text-orange-500">
              ${params.price}
              <Text className="text-base font-normal text-gray-900"> /día</Text>
            </Text>
            <TouchableOpacity
              className="bg-orange-500 rounded-lg py-3 px-6"
              onPress={handleReserve}
            >
              <Text className="text-white font-bold text-base">Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
