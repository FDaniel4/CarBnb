import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
// Importamos los iconos que necesitamos
import {
  FontAwesome,
  // Ionicons, // Ya no se usa el BackIcon
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// Importamos SafeAreaView para respetar los bordes del teléfono
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Iconos Personalizados ---
const ReservationIcon = (props: any) => (
  <Icon
    as={MaterialCommunityIcons}
    name="clipboard-check-outline"
    {...props}
  />
);
const UserIcon = (props: any) => (
  <Icon as={FontAwesome} name="user-o" {...props} />
);
const BagIcon = (props: any) => (
  <Icon as={MaterialCommunityIcons} name="briefcase-outline" {...props} />
);

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
    image: require('@/assets/images/Autos/aveo_5door_lrg.jpg'),
    users: 5,
    bags: 4,
  },
  {
    id: 2,
    image: require('@/assets/images/Autos/vento_lrg.jpg'),
    users: 5,
    bags: 4,
  },
  {
    id: 3,
    image: require('@/assets/images/Autos/kicks_lrg.jpg'),
    users: 5,
    bags: 2,
  },
];

const futureReservations: ReservationItem[] = [
  {
    id: 4,
    image: require('@/assets/images/Autos/cavalier_lrg.jpg'),
    bags: 4,
  },
  {
    id: 5,
    image: require('@/assets/images/Autos/trax_lrg.jpg'),
    users: 5,
    bags: 4,
  },
];

// --- 2. Componente ESTÁTICO de Tarjeta de Reserva ---
const ReservationCard = ({ item }: { item: ReservationItem }) => {
  return (
    // Quitamos el 'Pressable'
    <Box
      mr="$4"
      width={220} // Ancho fijo para el carrusel
      bg="$background0"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$coolGray200"
      overflow="hidden"
    >
      <Image
        source={item.image}
        alt="Car"
        w="$full"
        h={120}
        resizeMode="contain"
        bg="$background100" // Fondo claro para la imagen
      />
      {/* Barra de iconos */}
      <HStack
        p="$2"
        space="md"
        justifyContent="center"
        bg="$background50"
        borderTopWidth={1}
        borderColor="$coolGray200"
      >
        {item.users && ( // Solo muestra si existe
          <HStack space="sm" alignItems="center">
            {/* CORRECCIÓN: 'size' y 'color' arreglados */}
            <UserIcon size={14} color="$text600" />
            <Text size="sm" color="$text600">
              {item.users}
            </Text>
          </HStack>
        )}
        {item.bags && ( // Solo muestra si existe
          <HStack space="sm" alignItems="center">
            {/* CORRECCIÓN: 'size' y 'color' arreglados */}
            <BagIcon size={14} color="$text600" />
            <Text size="sm" color="$text600">
              {item.bags}
            </Text>
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

// --- Pantalla Principal "My Reservations" ---
export default function MyReservationsScreen() {
  const router = useRouter(); // <-- OBTENEMOS EL ROUTER

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Box p="$5">
          {/* ----- 1. Título (CORREGIDO) ----- */}
          <HStack
            alignItems="center"
            justifyContent="space-between" // <-- 1. Cambiado a 'space-between'
            w="$full" // <-- 2. Añadido ancho completo
            mb="$6"
            pt="$4"
          >
            {/* Izquierda: Botón de Perfil */}
            <TouchableOpacity
              onPress={() => router.push('/drawer/profile/profile')}
            >
              <UserIcon size={20} color="$text800" />
            </TouchableOpacity>

            {/* Centro: Icono y Título (agrupados) */}
            <HStack alignItems="center" space="sm">
              <ReservationIcon size={24} color="$orange500" />
              <Heading size="2xl" color="$text900">
                Mis Reservaciones
              </Heading>
            </HStack>

            {/* Derecha: Un "spacer" invisible para centrar el título */}
            <Box w={32} />
          </HStack>

          {/* ----- 2. Reservas Antiguas ----- */}
          <VStack space="md" mb="$6">
            <Heading size="xl" color="$text800">
              Old reservations
            </Heading>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {oldReservations.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </VStack>

          {/* ----- 3. Reservas Futuras ----- */}
          <VStack space="md">
            <Heading size="xl" color="$text800">
              Future reservations
            </Heading>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {futureReservations.map((item) => (
                <ReservationCard key={item.id} item={item} />
              ))}
            </ScrollView>
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