import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {
    Box,
    Heading,
    HStack,
    Icon,
    Image,
    Pressable,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Iconos Personalizados ---
const UserIcon = (props: any) => (
  <Icon as={FontAwesome} name="user" {...props} />
);
const CogIcon = (props: any) => (
  <Icon as={Ionicons} name="cog" {...props} />
);

// --- Datos de los Autos Disponibles (Simulación) ---
// (Usamos los datos de tus imágenes de /Autos)
const availableCars = [
  {
    id: 1,
    name: 'Volkswagen Vento',
    style: '4 Puertas',
    image: require('@/assets/images/Autos/vento_lrg.jpg'),
    price: '4',
    passengers: 4,
    transmission: 'Automático',
  },
  {
    id: 2,
    name: 'Chevrolet Aveo',
    style: '5 Puertas',
    image: require('@/assets/images/Autos/aveo_5door_lrg.jpg'),
    price: '8',
    passengers: 5,
    transmission: 'Automático',
  },
  {
    id: 3,
    name: 'Nissan Kicks',
    style: 'SUV',
    image: require('@/assets/images/Autos/kicks_lrg.jpg'),
    price: '12',
    passengers: 5,
    transmission: 'Automático',
  },
  {
    id: 4,
    name: 'Chevrolet Trax',
    style: 'SUV',
    image: require('@/assets/images/Autos/trax_lrg.jpg'),
    price: '15',
    passengers: 5,
    transmission: 'Automático',
  },
];

// --- Componente de la Tarjeta de Auto (en lista) ---
const CarListItem = ({ car }: { car: (typeof availableCars)[0] }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        // Al seleccionar, vamos al detalle del auto
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
      bg="$background0"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$coolGray200"
      overflow="hidden"
      sx={{
        ':active': { bg: '$background100' },
      }}
    >
      <HStack>
        {/* Imagen */}
        <Box w={140} h={100} bg="$background100">
          <Image
            source={car.image}
            alt={car.name}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </Box>

        {/* Info */}
        <VStack p="$3" flex={1} space="xs">
          {/* ----- CORRECCIÓN DE COLOR ----- */}
          <Heading size="md" color="$text900">
            {car.name}
          </Heading>

          <HStack space="sm" alignItems="center">
            <HStack alignItems="center" space="xs">
              {/* ----- CORRECCIÓN DE COLOR ----- */}
              <UserIcon size="xs" color="$text800" />
              <Text size="xs" color="$text800">
                {car.passengers}
              </Text>
            </HStack>
            <HStack alignItems="center" space="xs">
              {/* ----- CORRECCIÓN DE COLOR ----- */}
              <CogIcon size="xs" color="$text800" />
              <Text size="xs" color="$text800">
                {car.transmission}
              </Text>
            </HStack>
          </HStack>

          <Box flex={1} />

          <HStack>
            <Heading size="lg" color="$orange500">
              ${car.price}
              <Text size="xs" color="$text900">
                /día
              </Text>
            </Heading>
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
};

// --- Pantalla de Resultados de Búsqueda ---
export default function SearchResultsScreen() {
  // Obtenemos los filtros de la pantalla 'home'
  const params = useLocalSearchParams() as {
    city?: string;
    from?: string;
    to?: string;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <VStack p="$5" space="md">
          {/* Título */}
          <Box>
            {/* (Esto ya estaba corregido) */}
            <Heading size="2xl" color="$text900">
              Resultados en {params.city || 'tu ciudad'}
            </Heading>
            <Text color="$text900" size="sm">
              Desde {params.from || '...'} hasta {params.to || '...'}
            </Text>
          </Box>

          {/* Lista de Autos */}
          {availableCars.map((car) => (
            <CarListItem key={car.id} car={car} />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
});