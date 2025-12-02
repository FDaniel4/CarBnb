import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/use-theme-color';

const UserIcon = ({ color }: { color: string }) => (
  <FontAwesome name="user" size={20} color={color} />
);
const CogIcon = ({ color }: { color: string }) => (
  <Ionicons name="cog" size={24} color={color} />
);

export default function CarDetailScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#F3F4F6';

  const params = useLocalSearchParams() as {
    id: string;
    name: string;
    style: string;
    price: string;
    passengers: string;
    transmission: string;
    image: string | string[];
    description: string;
    ownerId: string;
  };

  // --- FUNCIÓN DE REPARACIÓN DE URL ---
  // Si Expo Router decodificó la URL de Firebase (quitó los %2F), esto la arregla.
  const getFixedUrl = (urlParam: string | string[] | undefined) => {
    if (!urlParam) return "";
    let url = Array.isArray(urlParam) ? urlParam[0] : urlParam;

    // Si es una URL de Firebase Storage y tiene la estructura rota
    if (url.includes("firebasestorage.googleapis.com") && url.includes("/o/")) {
        const parts = url.split("/o/");
        if (parts.length >= 2) {
            const base = parts[0];
            const rest = parts[1];
            // Separamos el path de los query params (?alt=...)
            const [path, query] = rest.split("?");
            
            // Si el path tiene barras normales (/), significa que se rompió.
            // Las volvemos a codificar a %2F
            if (path.includes("/")) {
                return `${base}/o/${encodeURIComponent(path)}?${query}`;
            }
        }
    }
    return url;
  };

  const imageUrl = getFixedUrl(params.image);

  const handleReserve = () => {
    router.push({
      pathname: '/drawer/payment',
      params: {
        carId: params.id,
        carName: params.name,
        price: params.price,
        ownerId: params.ownerId,
        image: imageUrl, // Pasamos la URL ya arreglada
      },
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="flex-grow pb-10">
        
        {/* --- 1. IMAGEN DEL AUTO (Header) --- */}
        <View className="w-full h-72 bg-gray-200 relative">
          {imageUrl ? (
            <RNImage
              source={{ uri: imageUrl }} 
              accessibilityLabel={params.name}
              style={{ width: '100%', height: '100%' }} 
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-300">
                <Ionicons name="image-outline" size={50} color="gray" />
                <Text style={{color: 'gray'}}>Imagen no disponible</Text>
            </View>
          )}
          
          {/* Botón Atrás Flotante */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* --- 2. DETALLES (Contenedor redondeado) --- */}
        <View 
            className="p-6 -mt-6 rounded-t-3xl flex-1"
            style={{ backgroundColor: background }}
        >
            {/* Título y Precio */}
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 mr-4">
                    <Text className="text-3xl font-bold" style={{ color: textColor }}>
                        {params.name}
                    </Text>
                    <Text className="text-lg text-gray-500 font-medium">
                        {params.style}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-bold text-orange-500">
                        ${params.price}
                    </Text>
                    <Text className="text-xs text-gray-400">/día</Text>
                </View>
            </View>

            {/* Especificaciones (Pasajeros / Transmisión) */}
            <View className="flex-row space-x-4 mb-8">
                <View 
                    className="flex-1 flex-row items-center justify-center p-4 rounded-xl"
                    style={{ backgroundColor: cardBg }}
                >
                    <UserIcon color={textColor} />
                    <Text className="ml-3 font-semibold" style={{ color: textColor }}>
                        {params.passengers} Pasajeros
                    </Text>
                </View>

                <View 
                    className="flex-1 flex-row items-center justify-center p-4 rounded-xl"
                    style={{ backgroundColor: cardBg }}
                >
                    <CogIcon color={textColor} />
                    <Text className="ml-3 font-semibold" style={{ color: textColor }}>
                        {params.transmission}
                    </Text>
                </View>
            </View>

            {/* Descripción */}
            <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
                Descripción
            </Text>
            <Text className="text-base text-gray-500 leading-6 mb-10">
                {params.description && params.description.trim() !== "" && params.description !== "undefined"
                    ? params.description 
                    : "El propietario no ha proporcionado una descripción detallada para este vehículo, pero cuenta con todas las características de seguridad estándar."}
            </Text>

            {/* Botón Reservar */}
            <TouchableOpacity
                className="bg-orange-500 py-4 rounded-xl items-center shadow-lg shadow-orange-200"
                onPress={handleReserve}
            >
                <Text className="text-white font-bold text-xl">
                    Reservar Ahora
                </Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}