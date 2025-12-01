import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Image as RNImage,
  ScrollView,
  Switch,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  useColorScheme, // 1. Importar hook de React Native
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind'; // 2. Importar hook de NativeWind
import { useThemeColor } from '@/hooks/use-theme-color'; // 3. Importar hook de Tema

// --- Iconos Personalizados (ahora reciben color dinámico) ---
const UserIcon = (props: { size: 'sm' | 'lg'; color: string }) => {
  const sizeMap = { sm: 16, lg: 24 };
  return (
    <FontAwesome name="user" size={sizeMap[props.size]} color={props.color} />
  );
};
const AutoIcon = (props: { size: 'sm' | 'lg'; color: string }) => {
  const sizeMap = { sm: 16, lg: 24 };
  return (
    <MaterialCommunityIcons
      name="cogs"
      size={sizeMap[props.size]}
      color={props.color}
    />
  );
};
const ManualIcon = (props: { size: 'sm' | 'lg'; color: string }) => {
  const sizeMap = { sm: 16, lg: 24 };
  return (
    <MaterialCommunityIcons
      name="cog-outline"
      size={sizeMap[props.size]}
      color={props.color}
    />
  );
};
const CalendarIcon = (props: { size: 'xl'; color: string }) => {
  const sizeMap = { xl: 28 };
  return (
    <Ionicons
      name="calendar-outline"
      size={sizeMap[props.size]}
      color={props.color}
    />
  );
};

// --- Datos de los Autos (sin cambios) ---
const featuredCars = [
  {
    name: 'Kia Soul',
    style: '6 Puertas',
    image: require('@/assets/images/Autos/aveo_5door_lrg.jpg'),
    price: '899',
    passengers: 4,
    transmission: 'Auto',
    brandLogo:
      'https://logodownload.org/wp-content/uploads/2017/02/mex-rent-a-car-logo-1.png',
  },
  {
    name: 'Ford Mustang',
    style: '2 Puertas',
    image: require('@/assets/images/Autos/jetta_lrg.jpg'),
    price: '639',
    passengers: 2,
    transmission: 'Auto',
    brandLogo:
      'https://companieslogo.com/img/orig/CAR-c80c6819.png?t=1659337581',
  },
  {
    name: 'Volkswagen Vento',
    style: '4 Puertas',
    image: require('@/assets/images/Autos/vento_lrg.jpg'),
    price: '499',
    passengers: 4,
    transmission: 'Manual',
    brandLogo:
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Bob_Finance_logo.png',
  },
];

// --- Componente de Tarjeta de Auto (con props de tema) ---
const CarCard = ({
  car,
  textColor,
  cardBackground,
}: {
  car: (typeof featuredCars)[0];
  textColor: string;
  cardBackground: string;
}) => {
  const router = useRouter();

  return (
    <View
      className="rounded-lg overflow-hidden w-56 mr-4 border border-gray-100"
      style={{ backgroundColor: cardBackground }} // Aplicar fondo de tarjeta
    >
      <View className="w-full h-32 bg-gray-100">
        <RNImage
          source={car.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <View className="p-3 space-y-1">
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className="text-sm font-bold"
              style={{ color: textColor }} // Aplicar color
            >
              {car.name}
            </Text>
            <Text className="text-xs" style={{ color: textColor }}>
              {car.style}
            </Text>
          </View>
          <RNImage
            source={{ uri: car.brandLogo }}
            alt="Brand Logo"
            className="w-10 h-5"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row items-end space-x-1">
          <Text className="text-xs text-gray-500">Desde</Text>
          <Text className="text-base font-bold text-orange-500">
            ${car.price}
          </Text>
          <Text className="text-xs text-gray-500">/día</Text>
        </View>

        <View className="flex-row space-x-3 items-center pt-1">
          <View className="flex-row items-center space-x-1">
            <UserIcon size="sm" color={textColor} />
            <Text className="text-sm" style={{ color: textColor }}>
              {car.passengers}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {car.transmission === 'Auto' ? (
              <AutoIcon size="sm" color={textColor} />
            ) : (
              <ManualIcon size="sm" color={textColor} />
            )}
            <Text className="text-sm" style={{ color: textColor }}>
              {car.transmission}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="bg-orange-500 py-3"
        onPress={() => {
          // Lógica de router (sin cambios)
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
      >
        <Text className="text-white font-bold text-center">Select</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Pantalla Principal de Home (con lógica de Tema) ---
export default function HomeScreen() {
  const router = useRouter();

  // --- 4. Hooks de Tema ---
  const { colorScheme, setColorScheme } = useNativeWindColorScheme(); // Para el Switch
  const background = useThemeColor({}, 'background'); // Para el fondo
  const textColor = useThemeColor({}, 'text'); // Para el texto
  const scheme = useColorScheme(); // Para lógica interna (react-native)

  // Definir colores de UI basados en el tema
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3'; // Gris claro o oscuro
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF'; // Blanco o casi negro
  const modalBackground = scheme === 'dark' ? '#1C1C1E' : '#FFEDD5'; // Naranja muy claro o casi negro
  const modalTextColor = scheme === 'dark' ? '#FFFFFF' : '#4B5563'; // Blanco o gris

  const isDarkMode = colorScheme === 'dark';
  const toggleDarkMode = (isOn: boolean) => {
    setColorScheme(isOn ? 'dark' : 'light');
  };

  // ----- Lógica de 'booknow.tsx' (sin cambios) -----
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('City');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'from' | 'to'>('from');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateText, setFromDateText] = useState('From');
  const [toDateText, setToDateText] = useState('To');

  const openModal = (options: string[]) => {
    setModalOptions(options);
    setShowModal(true);
  };

  const openDatePicker = (pickerType: 'from' | 'to') => {
    setCurrentPicker(pickerType);
    setShowDatePicker(true);
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate =
      selectedDate || (currentPicker === 'from' ? fromDate : toDate);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set') {
      if (currentPicker === 'from') {
        setFromDate(currentDate);
        setFromDateText(currentDate.toLocaleDateString());
      } else {
        setToDate(currentDate);
        setToDateText(currentDate.toLocaleDateString());
      }
    } else {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  const onDoneIOS = () => {
    setShowDatePicker(false);
    if (currentPicker === 'from') {
      setFromDateText(fromDate.toLocaleDateString());
    } else {
      setToDateText(toDate.toLocaleDateString());
    }
  };
  // ----- FIN DE LÓGICA PORTADA -----

  return (
    // 5. Aplicar fondo dinámico
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView nestedScrollEnabled={true}>
        <View className="p-1">
          {/* ----- 1. Featured ----- */}
          <View className="flex-row justify-between items-center mb-4 px-4 pt-4">
            <Text
              className="text-3xl font-bold"
              style={{ color: textColor }} // Aplicar color
            >
              Featured
            </Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-xs" style={{ color: textColor }}>
                DARK MODE
              </Text>
              {/* 6. Conectar Switch al hook de NativeWind */}
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#767577', true: '#F97A4B' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* ----- 2. Carrusel Horizontal ----- */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerClassName="px-4"
          >
            {featuredCars.map((car) => (
              <CarCard
                key={car.name}
                car={car}
                textColor={textColor}
                cardBackground={cardBackground}
              />
            ))}
          </ScrollView>

          {/* ----- 3. Formulario de Búsqueda Rápida ----- */}
          <View className="space-y-4 px-4">
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 px-4 rounded-lg border"
              style={{
                backgroundColor: inputBackground,
                borderColor: scheme === 'dark' ? '#3A3A3C' : '#E5E7EB', // Colores de borde
              }}
              onPress={() =>
                openModal(['New York', 'Los Angeles', 'Chicago', 'Miami'])
              }
            >
              <Text
                className={`text-base ${
                  selectedCity === 'City' ? 'text-gray-500' : ''
                }`}
                style={{
                  color: selectedCity === 'City' ? '#888' : textColor,
                }}
              >
                {selectedCity}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={textColor}
              />
            </TouchableOpacity>

            <View
              className="flex-row space-x-4 items-center p-3 rounded-lg border"
              style={{
                backgroundColor: inputBackground,
                borderColor: scheme === 'dark' ? '#3A3A3C' : '#E5E7EB',
              }}
            >
              <CalendarIcon size="xl" color="#F97A4B" />
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => openDatePicker('from')}
                  className="flex-row justify-between w-full"
                >
                  <Text
                    className={`text-lg ${
                      fromDateText === 'From' ? 'text-gray-500' : ''
                    }`}
                    style={{
                      color: fromDateText === 'From' ? '#888' : textColor,
                    }}
                  >
                    {fromDateText}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={textColor}
                  />
                </TouchableOpacity>

                <View className="h-3" />

                <TouchableOpacity
                  onPress={() => openDatePicker('to')}
                  className="flex-row justify-between w-full"
                >
                  <Text
                    className={`text-lg ${
                      toDateText === 'To' ? 'text-gray-500' : ''
                    }`}
                    style={{
                      color: toDateText === 'To' ? '#888' : textColor,
                    }}
                  >
                    {toDateText}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row justify-center items-center py-4 bg-orange-500 rounded-lg mt-2"
              onPress={() => {
                router.push({
                  pathname: '/drawer/searchResults',
                  params: {
                    city: selectedCity,
                    from: fromDateText,
                    to: toDateText,
                  },
                });
              }}
            >
              <Ionicons name="search" size={20} color="white" className="mr-2" />
              <Text className="text-white text-base font-bold text-center">
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ----- Modal (con Tema) ----- */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 p-5"
          onPress={() => setShowModal(false)}
        >
          <Pressable
            className="w-full rounded-lg"
            style={{ backgroundColor: modalBackground }} // Fondo de modal
          >
            <View
              className="flex-row justify-between items-center p-4 border-b"
              style={{
                borderColor: scheme === 'dark' ? '#3A3A3C' : '#FDE68A',
              }} // Borde de modal
            >
              <Text className="text-lg font-bold text-orange-500">
                Select City
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#F97A4B" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              {modalOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="py-3"
                  onPress={() => {
                    setSelectedCity(option);
                    setShowModal(false);
                  }}
                >
                  <Text
                    className="text-base"
                    style={{ color: modalTextColor }} // Color de texto de modal
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ----- DatePicker (sin cambios) ----- */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentPicker === 'from' ? fromDate : toDate}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          // themeVariant={scheme} // Puedes intentar pasar el 'scheme'
        />
      )}
      {showDatePicker && Platform.OS === 'ios' && (
        <View
          className="flex-row justify-around p-2"
          style={{ backgroundColor: background }}
        >
          <TouchableOpacity
            className="py-2 px-4"
            onPress={() => setShowDatePicker(false)}
          >
            <Text className="text-blue-500 text-base">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 px-4" onPress={onDoneIOS}>
            <Text className="text-blue-500 text-base font-bold">Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}