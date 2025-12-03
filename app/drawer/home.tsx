import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Image as RNImage,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Imports con rutas relativas ---
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useThemeColor } from '../../hooks/use-theme-color';
import { auth, db } from '../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../context/LanguageContext';

// --- Tipos ---
export type Car = {
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

const CarCard = ({
  car,
  textColor,
  cardBackground,
}: {
  car: Car;
  textColor: string;
  cardBackground: string;
}) => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View
      className="rounded-lg overflow-hidden w-64 mr-4 border border-gray-200 shadow-sm"
      style={{ backgroundColor: cardBackground }}
    >
      <View className="w-full h-40 bg-gray-100 relative">
        <RNImage
          source={{ uri: car.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Badge de Ciudad */}
        <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md">
            <Text className="text-white text-[10px] font-bold">{car.city}</Text>
        </View>
      </View>

      <View className="p-3 space-y-2">
        <View>
          <Text className="text-base font-bold" numberOfLines={1} style={{ color: textColor }}>
            {car.name}
          </Text>
          <Text className="text-xs opacity-70" style={{ color: textColor }}>
            {car.style}
          </Text>
        </View>
        
        <View className="flex-row items-end justify-between">
          <View>
              <Text className="text-xs text-gray-500">{t('fromPriceLabel')}</Text>
              <Text className="text-lg font-bold text-orange-500">
                ${car.price}<Text className="text-xs font-normal text-gray-500">{t('perDay')}</Text>
              </Text>
          </View>
        </View>

        <View className="flex-row space-x-4 pt-2 border-t border-gray-100">
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
      </View>

      <TouchableOpacity
        className="bg-orange-500 py-3 items-center"
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
              image: car.image,
              description: car.description || '',
              ownerId: car.ownerId,
            },
          });
        }}
      >
        <Text className="text-white font-bold uppercase text-xs">{t('select')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  
  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();

  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scheme = useColorScheme();
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F9FAFB';

  // --- Estado de Datos ---
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Cargar Autos de Firestore y Filtrar ---
  useEffect(() => {
    // Traemos una buena cantidad de autos para tener variedad
    const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'), limit(15));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allCars: Car[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Car));

      // FILTRO: Excluir autos que sean míos
      const currentUserId = auth.currentUser?.uid;
      const othersCars = allCars.filter(car => car.ownerId !== currentUserId);

      setRecentCars(othersCars.slice(0, 5)); // Los 5 más recientes ajenos
      setAvailableCars(othersCars); // Todos los ajenos disponibles

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Estados de Filtros ---
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Aguascalientes');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'from' | 'to'>('from');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  
  const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  
  const openDatePicker = (type: 'from' | 'to') => {
    setCurrentPicker(type);
    setShowDatePicker(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'set' && date) {
      currentPicker === 'from' ? setFromDate(date) : setToDate(date);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView nestedScrollEnabled>
        <View className="p-5 pb-20">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-3xl font-bold" style={{ color: textColor }}>{t('exploreTitle')}</Text>
              <Text className="text-orange-500 font-bold">{t('exploreSubtitle')}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t('modeLabel')} {colorScheme}</Text>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={(val) => setColorScheme(val ? 'dark' : 'light')}
                trackColor={{ false: '#e5e7eb', true: '#fdba74' }}
                thumbColor={colorScheme === 'dark' ? '#f97316' : '#f4f4f5'}
              />
            </View>
          </View>

          {/* Carrusel 1: Recién Agregados */}
          <View className="mb-8">
              <Text className="text-lg font-bold mb-4" style={{ color: textColor }}>{t('recentlyAdded')}</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
              ) : recentCars.length === 0 ? (
                <Text className="text-gray-400 italic">{t('noRecentCars')}</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                  {recentCars.map(car => (
                    <CarCard key={car.id} car={car} textColor={textColor} cardBackground={cardBackground} />
                  ))}
                </ScrollView>
              )}
          </View>

           {/* Carrusel 2: Autos Disponibles */}
           <View className="mb-8">
             <View className="flex-row justify-between items-end mb-4">
                <Text className="text-lg font-bold" style={{ color: textColor }}>{t('allCars')}</Text>
                <TouchableOpacity onPress={() => router.push('/drawer/searchResults')}>
                    <Text className="text-orange-500 text-xs font-bold">{t('viewMore')}</Text>
                </TouchableOpacity>
             </View>
             
             {loading ? (
               <ActivityIndicator size="small" color="#f97316" />
             ) : availableCars.length === 0 ? (
               <Text className="text-gray-400 italic">{t('noAvailableCars')}</Text>
             ) : (
               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                 {/* Invertimos el orden o mostramos más para variar la vista */}
                 {[...availableCars].reverse().map(car => (
                   <CarCard key={`avail-${car.id}`} car={car} textColor={textColor} cardBackground={cardBackground} />
                 ))}
               </ScrollView>
             )}
          </View>

          {/* Buscador */}
          <View className="rounded-2xl p-5 space-y-4 shadow-sm" style={{ backgroundColor: cardBackground }}>
            <Text className="font-bold text-gray-400 uppercase text-xs">{t('searchByDateLocation')}</Text>
            
            {/* Ciudad */}
            <TouchableOpacity 
              onPress={() => setShowModal(true)}
              className="flex-row items-center p-4 rounded-xl border border-gray-100"
              style={{ backgroundColor: inputBackground }}
            >
              <Ionicons name="location-sharp" size={20} color="#f97316" style={{ marginRight: 12 }} />
              <View className="flex-1">
                <Text className="text-xs text-gray-400">{t('locationLabel')}</Text>
                <Text className="font-bold text-base" style={{ color: textColor }}>{selectedCity}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>

            {/* Fechas */}
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={() => openDatePicker('from')}
                className="flex-1 flex-row items-center p-3 rounded-xl border border-gray-100"
                style={{ backgroundColor: inputBackground }}
              >
                <Ionicons name="calendar" size={18} color="#f97316" style={{ marginRight: 8 }} />
                <View>
                    <Text className="text-xs text-gray-400">{t('fromLabel')}</Text>
                    <Text className="font-bold" style={{ color: textColor }}>{formatDate(fromDate)}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => openDatePicker('to')}
                className="flex-1 flex-row items-center p-3 rounded-xl border border-gray-100"
                style={{ backgroundColor: inputBackground }}
              >
                <Ionicons name="calendar" size={18} color="#f97316" style={{ marginRight: 8 }} />
                <View>
                    <Text className="text-xs text-gray-400">{t('toLabel')}</Text>
                    <Text className="font-bold" style={{ color: textColor }}>{formatDate(toDate)}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Botón Buscar */}
            <TouchableOpacity 
              className="bg-orange-500 py-4 rounded-xl items-center mt-2 shadow-orange-200 shadow-md"
              onPress={() => {
                router.push({
                  pathname: '/drawer/searchResults',
                  params: { 
                    city: selectedCity,
                    from: fromDate.toISOString(),
                    to: toDate.toISOString()
                  }
                });
              }}
            >
              <Text className="text-white font-bold text-lg">{t('searchCarsBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Ciudades */}
      <Modal visible={showModal} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center p-5" onPress={() => setShowModal(false)}>
          <View className="bg-white rounded-2xl overflow-hidden">
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
              <Text className="font-bold text-lg">{t('selectCityTitle')}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {['Aguascalientes', 'CDMX', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla'].map(city => (
              <TouchableOpacity 
                key={city} 
                className="p-4 border-b border-gray-50 active:bg-orange-50"
                onPress={() => { setSelectedCity(city); setShowModal(false); }}
              >
                <Text className={`text-base ${selectedCity === city ? 'text-orange-500 font-bold' : 'text-gray-700'}`}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={currentPicker === 'from' ? fromDate : toDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}