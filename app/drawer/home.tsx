import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  // Importamos 'Image' de Gluestack, aunque usaremos la nativa para el carrusel
  Image as GluestackImage,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Pressable,
  SearchIcon,
  Switch,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Image as RNImage,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Iconos Personalizados ---
const CarIcon = (props: any) => (
  <Icon as={FontAwesome} name="car" {...props} />
);
const UserIcon = (props: any) => (
  <Icon as={FontAwesome} name="user" {...props} />
);
const AutoIcon = (props: any) => (
  <Icon as={MaterialCommunityIcons} name="cogs" {...props} /> // Icono para Automático
);
const ManualIcon = (props: any) => (
  <Icon as={MaterialCommunityIcons} name="cog-outline" {...props} /> // Icono para Manual
);
const CalendarIcon = (props: any) => (
  <Icon as={Ionicons} name="calendar-outline" {...props} />
);

// --- Datos de los Autos (ACTUALIZADOS) ---
const featuredCars = [
  {
    name: 'Kia Soul',
    style: '6 Puertas',
    image: require('@/assets/images/Autos/aveo_5door_lrg.jpg'), // CAMBIA ESTO por 'kia_soul.jpg' si la tienes
    price: '899',
    passengers: 4,
    transmission: 'Auto', // <-- VALOR CORTO
    brandLogo:
      'https://logodownload.org/wp-content/uploads/2017/02/mex-rent-a-car-logo-1.png', // Logo de Mex
  },
  {
    name: 'Ford Mustang',
    color: 'Rojo',
    style: '2 Puertas',
    image: require('@/assets/images/Autos/jetta_lrg.jpg'), // CAMBIA ESTO por 'ford_mustang.jpg' si la tienes
    price: '639',
    passengers: 2,
    transmission: 'Auto', // <-- VALOR CORTO
    brandLogo:
      'https://companieslogo.com/img/orig/CAR-c80c6819.png?t=1659337581', // Logo de Budget
  },
  {
    name: 'Volkswagen Vento',
    style: '4 Puertas',
    image: require('@/assets/images/Autos/vento_lrg.jpg'),
    price: '499',
    passengers: 4,
    transmission: 'Manual', // <-- VALOR CORTO
    brandLogo:
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Bob_Finance_logo.png', // Logo de Bob
  },
];

// --- Componente de Tarjeta de Auto (ACTUALIZADO) ---
const CarCard = ({ car }: { car: (typeof featuredCars)[0] }) => {
  const router = useRouter(); 

  return (
    <Box
      bg="$background0"
      borderRadius="$lg"
      overflow="hidden"
      width={220} // Ancho fijo para el carrusel
      mr="$4" // Margen a la derecha
    >
      {/* Usamos RNImage y resizeMode="contain" */}
      <Box w="$full" h={120} bg="$background100">
        <RNImage
          source={car.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain" // <-- Arreglo de imagen
        />
      </Box>
      <VStack p="$3" space="xs">
        <HStack justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="sm" color="$text900">
              {car.name}
            </Heading>
            <Text size="xs" color="$text900">
              {car.style}
            </Text>
          </Box>
          {/* Usamos GluestackImage para URLs */}
          <GluestackImage
            source={{ uri: car.brandLogo }}
            alt="Brand Logo"
            w={40}
            h={20}
            resizeMode="contain"
          />
        </HStack>
        <HStack alignItems="flex-end" space="xs">
          <Text color="$text500" size="xs">
            Desde
          </Text>
          <Heading size="md" color="$orange500">
            ${car.price}
          </Heading>
          <Text color="$text500" size="xs">
            /día
          </Text>
        </HStack>

        {/* ----- ¡AQUÍ ESTÁ LA CORRECCIÓN DE ICONOS! (Puertas eliminado) ----- */}
        <HStack space="sm" alignItems="center" mt="$1">
          {/* Pasajeros */}
          <HStack alignItems="center" space="xs">
            <UserIcon size="sm" color="$text800" />
            <Text size="sm" color="$text800">
              {car.passengers}
            </Text>
          </HStack>
          {/* Puertas (ELIMINADO) */}
          {/* Transmisión (Condicional) */}
          <HStack alignItems="center" space="xs">
            {car.transmission === 'Auto' ? (
              <AutoIcon size="sm" color="$text800" />
            ) : (
              <ManualIcon size="sm" color="$text800" />
            )}
            <Text size="sm" color="$text800">
              {car.transmission}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <Button
        bg="$orange500"
        borderRadius="$none"
        onPress={() => {
          // --- 3. ¡ESTA ES LA LÓGICA DE NAVEGACIÓN! ---
          router.push({
            pathname: '/drawer/carDetail', // <-- La nueva pantalla
            params: {
              // Pasamos todos los datos del auto
              name: car.name,
              style: car.style,
              price: car.price,
              passengers: car.passengers,
              transmission: car.transmission,
            },
          });
          // ------------------------------------------
        }}
      >
        <ButtonText>Select</ButtonText>
      </Button>
    </Box>
  );
};

// --- Pantalla Principal de Home ---
export default function HomeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // ----- INICIO DE LÓGICA PORTADA DE 'booknow.tsx' -----
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('City');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'from' | 'to'>('from');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateText, setFromDateText] = useState('From');
  const [toDateText, setToDateText] = useState('To');

  // --- Función para abrir el Modal de selección (simplificado) ---
  const openModal = (options: string[]) => {
    setModalOptions(options);
    setShowModal(true);
  };

  // --- Función para abrir el DatePicker ---
  const openDatePicker = (pickerType: 'from' | 'to') => {
    setCurrentPicker(pickerType);
    setShowDatePicker(true);
  };

  // --- Función que se llama cuando el DatePicker cambia ---
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

  // Botón "Hecho" para iOS
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
    <SafeAreaView style={styles.safeArea}>
      {/* Usamos ScrollView para toda la pantalla */}
      <ScrollView nestedScrollEnabled={true}>
        <Box bg="$white" p="$5">
          {/* ----- 1. Featured ----- */}
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Heading size="2xl" color="$text900">
              Featured
            </Heading>
            <HStack alignItems="center" space="sm">
              <Text size="xs" color="$text900">
                DARK MODE
              </Text>
              <Switch
                value={isDarkMode}
                onToggle={() => setIsDarkMode(!isDarkMode)}
              />
            </HStack>
          </HStack>

          {/* ----- 2. Carrusel Horizontal ----- */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
          >
            {featuredCars.map((car) => (
              <CarCard key={car.name} car={car} />
            ))}
          </ScrollView>

          {/* ----- 3. Formulario de Búsqueda Rápida (CON FUNCIONALIDAD) ----- */}
          <VStack space="md">
            {/* Botón City */}
            <Button
              size="lg"
              variant="outline"
              borderColor="$coolGray300"
              bg="$background0"
              justifyContent="space-between"
              borderRadius="$lg"
              onPress={() =>
                openModal(['New York', 'Los Angeles', 'Chicago', 'Miami'])
              } // <--- ACCIÓN
            >
              <ButtonText
                color={selectedCity === 'City' ? '$text500' : '$text800'}
              >
                {selectedCity}
              </ButtonText>
              <ButtonIcon as={ChevronDownIcon} color="$text700" />
            </Button>

            {/* Botones From/To */}
            <HStack
              space="md"
              alignItems="center"
              bg="$background0"
              p="$3"
              borderRadius="$lg"
              borderWidth={1}
              borderColor="$coolGray300"
            >
              <CalendarIcon size="xl" color="$orange500" />
              <VStack flex={1}>
                <Pressable
                  onPress={() => openDatePicker('from')} // <--- ACCIÓN
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    w: '$full',
                  }}
                >
                  <Text
                    size="lg"
                    color={fromDateText === 'From' ? '$text500' : '$text800'}
                  >
                    {fromDateText}
                  </Text>
                  <Icon as={ChevronRightIcon} color="$text700" />
                </Pressable>

                <Box h="$3" />

                <Pressable
                  onPress={() => openDatePicker('to')} // <--- ACCIÓN
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    w: '$full',
                  }}
                >
                  <Text
                    size="lg"
                    color={toDateText === 'To' ? '$text500' : '$text800'}
                  >
                    {toDateText}
                  </Text>
                  <Icon as={ChevronRightIcon} color="$text700" />
                </Pressable>
              </VStack>
            </HStack>

            {/* Botón Search */}
            <Button
              size="lg"
              bg="$orange500"
              borderRadius="$lg"
              onPress={() => {
                // Navega a 'booknow' pasando los filtros
                router.push({
                  pathname: '/drawer/searchResults',
                  params: {
                    city: selectedCity,
                    from: fromDateText,
                    to: toDateText,
                  },
                });
              }}
              mt="$2"
            >
              <ButtonIcon as={SearchIcon} mr="$2" />
              <ButtonText>Search</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>

      {/* ----- JSX PORTADO DE 'booknow.tsx' ----- */}
      {/* ----- Modal Genérico (oculto hasta que se llama) ----- */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent bg="$orange100" borderRadius="$lg">
          <ModalHeader borderBottomWidth={0}>
            <Heading size="lg" color="$orange500">
              Select City
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} color="$orange500" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {modalOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setSelectedCity(option); // <-- Actualiza la ciudad
                  setShowModal(false);
                }}
                sx={{
                  p: '$3',
                  borderBottomWidth: 1,
                  borderColor: '$orange200',
                  ':active': {
                    bg: '$orange200',
                  },
                }}
              >
                <Text color="$text700">{option}</Text>
              </Pressable>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ----- DatePicker (oculto hasta que se llama) ----- */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentPicker === 'from' ? fromDate : toDate}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}
      {/* Botones "Cancelar" y "Hecho" solo para iOS */}
      {showDatePicker && Platform.OS === 'ios' && (
        <HStack justifyContent="space-around" p="$2" bg="$white">
          <Button variant="outline" onPress={() => setShowDatePicker(false)}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={onDoneIOS}>
            <ButtonText>Done</ButtonText>
          </Button>
        </HStack>
      )}
    </SafeAreaView>
  );
}

// Agregamos estilos para el SafeAreaView
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
});