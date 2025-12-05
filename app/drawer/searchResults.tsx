import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase ---
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';

// --- Hooks de Tema ---
import { useThemeColor } from '../../hooks/use-theme-color';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../context/LanguageContext';

// --- Tipos ---
type Car = {
  id: string;
  name: string;
  city: string; 
  style: string;
  price: string;
  passengers: number;
  transmission: string;
  image: string;
  description?: string;
  ownerId: string;
};

// --- Iconos ---
const UserIcon = ({ color }: { color: string }) => <FontAwesome name="user" size={14} color={color} />;
const AutoIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="cogs" size={14} color={color} />;
const ManualIcon = ({ color }: { color: string }) => <MaterialCommunityIcons name="cog-outline" size={14} color={color} />;

// --- HELPER PARA URLS ---
const getFixedUrl = (urlParam: string | undefined) => {
    if (!urlParam) return "";
    let url = urlParam;

    if (url.includes("firebasestorage.googleapis.com") && url.includes("/o/")) {
        const parts = url.split("/o/");
        if (parts.length >= 2) {
            const base = parts[0];
            const rest = parts[1];
            const [path, query] = rest.split("?");
            
            if (path.includes("/")) {
                return `${base}/o/${encodeURIComponent(path)}?${query}`;
            }
        }
    }
    return url.replace(/ /g, '%20');
};

// --- Componente de la Tarjeta de Auto ---
const CarListItem = ({ 
    car, 
    textColor, 
    cardBg, 
    borderColor,
    searchDates 
}: { 
    car: Car; 
    textColor: string; 
    cardBg: string; 
    borderColor: string;
    searchDates?: { start: string; end: string }
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const fixedImage = getFixedUrl(car.image);

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/drawer/carDetail',
          params: {
            id: car.id,
            name: car.name,
            style: car.style,
            price: car.price,
            passengers: car.passengers.toString(),
            transmission: car.transmission,
            image: fixedImage,
            description: car.description || '',
            ownerId: car.ownerId,
            // PASAMOS LAS FECHAS SELECCIONADAS
            startDate: searchDates?.start,
            endDate: searchDates?.end
          },
        });
      }}
      className="flex-row rounded-xl border overflow-hidden mb-4 shadow-sm"
      style={{ backgroundColor: cardBg, borderColor: borderColor }}
    >
      <View className="w-[140px] h-[110px] bg-gray-200">
        <RNImage
          source={{ uri: fixedImage }}
          alt={car.name}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Badge Ciudad */}
        <View className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded">
            <Text className="text-white text-[9px] font-bold">{car.city}</Text>
        </View>
      </View>

      <View className="p-3 flex-1 justify-between">
        <View>
            <Text className="text-base font-bold" numberOfLines={1} style={{ color: textColor }}>
                {car.name}
            </Text>
            <Text className="text-xs opacity-70" style={{ color: textColor }}>
                {car.style}
            </Text>
        </View>

        <View className="flex-row space-x-3 items-center mt-1">
          <View className="flex-row items-center space-x-1">
            <UserIcon color={textColor} />
            <Text className="text-xs" style={{ color: textColor }}>{car.passengers}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {car.transmission === 'Auto' ? <AutoIcon color={textColor} /> : <ManualIcon color={textColor} />}
            <Text className="text-xs" style={{ color: textColor }}>
                {car.transmission === 'Auto' ? t('automatic') : (car.transmission === 'Manual' ? t('manual') : car.transmission)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-end mt-2">
            <View />
            <Text className="text-xl font-bold text-orange-500">
                ${car.price}
                <Text className="text-xs font-normal" style={{ color: textColor }}> {t('perDay')}</Text>
            </Text>
        </View>
      </View>
    </Pressable>
  );
};

// --- Pantalla de Resultados ---
export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as {
    city?: string;
    from?: string; // ISO String
    to?: string;   // ISO String
  };

  const { t } = useLanguage();
  
  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E7EB';

  // --- Estados ---
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Formatear fechas para mostrar en el header y pasar al detalle
  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;
  
  const searchDates = (fromDate && toDate) ? {
      start: fromDate.toISOString().split('T')[0],
      end: toDate.toISOString().split('T')[0]
  } : undefined;

  const displayDate = (date: Date | null) => {
      if (!date) return '...';
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // --- Consulta a Firebase ---
  useEffect(() => {
    setLoading(true);
    const carsRef = collection(db, 'cars');
    // Traemos todos para filtrar en cliente (Firestore no soporta bien búsquedas de texto parcial o insensitivo simple sin configuración extra)
    // O si prefieres exacto: query(carsRef, where('city', '==', params.city))
    
    const unsubscribe = onSnapshot(carsRef, (snapshot) => {
      const allCars = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Car));

      const currentUserId = auth.currentUser?.uid;

      const filteredCars = allCars.filter(car => {
        // 1. No mostrar mis propios autos
        if (car.ownerId === currentUserId) return false;
        
        // 2. Filtro por ciudad (si se seleccionó una)
        if (params.city && params.city !== 'undefined') {
            // Comparación simple, idealmente normalizar strings (toLowerCase)
            return car.city === params.city;
        }
        
        return true;
      });

      setCars(filteredCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.city]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      {/* Header Personalizado */}
      <View className="px-5 py-4 border-b" style={{ borderColor: borderColor }}>
          <View className="flex-row items-center mb-2">
            <Pressable onPress={() => router.back()} className="mr-3">
                <Ionicons name="arrow-back" size={24} color={textColor} />
            </Pressable>
            <Text className="text-xl font-bold" style={{ color: textColor }}>
                {t('searchResults')}
            </Text>
          </View>
          
          <View className="flex-row items-center space-x-2 opacity-80">
             <Ionicons name="location-sharp" size={16} color="#F97A4B" />
             <Text style={{ color: textColor }}>
                {params.city || t('allCars')}
             </Text>
             <Text style={{ color: borderColor }}>|</Text>
             <Ionicons name="calendar" size={16} color="#F97A4B" />
             <Text style={{ color: textColor }}>
                {displayDate(fromDate)} - {displayDate(toDate)}
             </Text>
          </View>
      </View>

      <ScrollView contentContainerClassName="p-5">
        {loading ? (
           <ActivityIndicator size="large" color="#F97A4B" className="mt-10" />
        ) : cars.length === 0 ? (
           <View className="items-center justify-center mt-20">
              <MaterialCommunityIcons name="car-off" size={64} color="gray" />
              <Text className="text-gray-500 mt-4 text-center">
                  No se encontraron autos disponibles en {params.city || 'esta ubicación'}.
              </Text>
              <Pressable 
                onPress={() => router.back()}
                className="mt-6 bg-orange-500 px-6 py-3 rounded-full"
              >
                  <Text className="text-white font-bold">Volver a buscar</Text>
              </Pressable>
           </View>
        ) : (
           <View>
              <Text className="mb-4 text-xs font-bold uppercase text-gray-500">
                  {cars.length} {t('resultsIn')} {params.city || 'Total'}
              </Text>
              {cars.map((car) => (
                <CarListItem 
                    key={car.id} 
                    car={car} 
                    textColor={textColor}
                    cardBg={cardBg}
                    borderColor={borderColor}
                    searchDates={searchDates}
                />
              ))}
           </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}