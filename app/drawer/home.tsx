import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  ChevronDownIcon,
  ChevronRightIcon,
  // Importamos 'Image' de Gluestack, aunque usaremos la nativa para el carrusel
  Image as GluestackImage,
  Heading,
  HStack,
  Icon,
  Pressable,
  SearchIcon,
  Switch,
  Text,
  VStack,
} from '@gluestack-ui/themed';
// Importamos los iconos que necesitamos
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- 1. ASEGÚRATE QUE ESTO ESTÉ IMPORTADO
import React, { useState } from 'react';
// 1. IMPORTANTE: Traemos 'Image' de 'react-native'
import {
  Image as RNImage,
  ScrollView,
  StyleSheet,
} from 'react-native';
// Importamos SafeAreaView para respetar los bordes del teléfono
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Iconos Personalizados ---
const CarIcon = (props: any) => (
  <Icon as={FontAwesome} name="car" {...props} />
);
const UserIcon = (props: any) => (
  <Icon as={FontAwesome} name="user" {...props} />
);
const CogIcon = (props: any) => (
  <Icon as={Ionicons} name="cog" {...props} />
);
const CalendarIcon = (props: any) => (
  <Icon as={Ionicons} name="calendar-outline" {...props} />
);

// --- Datos de los Autos ---
// ¡Usamos las imágenes que acabas de subir!
const featuredCars = [
  {
    name: 'Kia Soul',
    style: '6 Puertas', // Ajusta esto
    image: require('@/assets/images/Autos/aveo_5door_lrg.jpg'), // CAMBIA ESTO por 'kia_soul.jpg' si la tienes
    price: '8',
    passengers: 4,
    transmission: 'Automático',
    brandLogo:
      'https://logodownload.org/wp-content/uploads/2017/02/mex-rent-a-car-logo-1.png', // Logo de Mex
  },
  {
    name: 'Ford Mustang',
    style: '2 Puertas', // Ajusta esto
    image: require('@/assets/images/Autos/jetta_lrg.jpg'), // CAMBIA ESTO por 'ford_mustang.jpg' si la tienes
    price: '63',
    passengers: 2,
    transmission: 'Automático',
    brandLogo:
      'https://companieslogo.com/img/orig/CAR-c80c6819.png?t=1659337581', // Logo de Budget
  },
  {
    name: 'Volkswagen Vento',
    style: '4 Puertas',
    image: require('@/assets/images/Autos/vento_lrg.jpg'),
    price: '4',
    passengers: 4,
    transmission: 'Automático',
    brandLogo:
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Bob_Finance_logo.png', // Logo de Bob
  },
];

// --- Componente de Tarjeta de Auto ---
const CarCard = ({ car }: { car: (typeof featuredCars)[0] }) => {
  const router = useRouter(); // <-- 2. AÑADIMOS EL ROUTER AQUÍ

  return (
    <Box
      bg="$background0"
      borderRadius="$lg"
      // elevation={5} // <-- Arreglo de 'shadow'
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
            <Heading size="sm">{car.name}</Heading>
            <Text size="xs" color="$text500">
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
        {/* Arreglo de 'color': quitado del HStack */}
        <HStack space="sm" alignItems="center">
          <HStack alignItems="center" space="xs">
            <UserIcon size="xs" color="gray" />
            <Text size="xs">{car.passengers}</Text>
          </HStack>
          <HStack alignItems="center" space="xs">
            <CogIcon size="xs" color="gray" />
            <Text size="xs">{car.transmission}</Text>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Usamos ScrollView para toda la pantalla */}
      <ScrollView nestedScrollEnabled={true}>
        {/* Arreglo de ScrollView: quitado 'flex={1}' */}
        <Box bg="$white" p="$5">
          {/* ----- 1. Featured ----- */}
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Heading size="2xl">Featured</Heading>
            <HStack alignItems="center" space="sm">
              <Text size="xs">DARK MODE</Text>
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

          {/* ----- 3. Formulario de Búsqueda Rápida ----- */}
          <VStack space="md">
            {/* Botón City */}
            <Button
              size="lg"
              variant="outline"
              borderColor="$coolGray300"
              bg="$background0"
              justifyContent="space-between"
              borderRadius="$lg"
              onPress={() => {
                /* TODO: Abrir modal de ciudad */
              }}
            >
              <ButtonText color="$text500">City</ButtonText>
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
                  onPress={() => {
                    /* TODO: Abrir DatePicker From */
                  }}
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    w: '$full',
                  }}
                >
                  <Text size="lg" color="$text500">
                    From
                  </Text>
                  <Icon as={ChevronRightIcon} color="$text700" />
                </Pressable>

                <Box h="$3" />
                {/* Espacio o línea divisoria */}

                <Pressable
                  onPress={() => {
                    /* TODO: Abrir DatePicker To */
                  }}
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    w: '$full',
                  }}
                >
                  <Text size="lg" color="$text500">
                    To
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
                /* TODO: Ir a la pantalla BookNow con filtros? */
                router.push('/drawer/booknow'); // <-- Navega a tu otra pantalla
              }}
              mt="$2"
            >
              <ButtonIcon as={SearchIcon} mr="$2" />
              <ButtonText>Search</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
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