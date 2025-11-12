import { FontAwesome, Ionicons } from '@expo/vector-icons';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Iconos Personalizados ---
const UserIcon = (props: any) => (
  <Icon as={FontAwesome} name="user" {...props} />
);
const CogIcon = (props: any) => (
  <Icon as={Ionicons} name="cog" {...props} />
);

// --- Función para obtener la imagen correcta ---
// Ya que no podemos pasar 'require' como parámetro,
// usamos el nombre para encontrar la imagen.
const getImageFromName = (name: string) => {
  if (name === 'Kia Soul') {
    return require('@/assets/images/Autos/aveo_5door_lrg.jpg');
  }
  if (name === 'Ford Mustang') {
    return require('@/assets/images/Autos/jetta_lrg.jpg');
  }
  if (name === 'Volkswagen Vento') {
    return require('@/assets/images/Autos/vento_lrg.jpg');
  }
  // Añade más 'if' para otros autos
  return require('@/assets/images/Autos/kicks_lrg.jpg'); // Imagen por defecto
};

export default function CarDetailScreen() {
  const router = useRouter();

  // 1. Obtenemos los parámetros que 'home.tsx' nos envió
  const params = useLocalSearchParams() as {
    name: string;
    style: string;
    price: string;
    passengers: string;
    transmission: string;
  };

  const imageSource = getImageFromName(params.name);

  // 2. ¡AQUÍ ESTÁ LA CORRECCIÓN!
  // Navegamos a la nueva pantalla 'payment'
  const handleReserve = () => {
    // Pasamos los datos del auto a la pantalla de Pagos
    router.push({
      pathname: '/drawer/payment', // <-- ¡LISTO! Apunta a 'payment'
      params: {
        carName: params.name,
        price: params.price,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <VStack flex={1} bg="$white">
        {/* 1. Imagen del Auto */}
        <Box w="$full" h={250} bg="$background100">
          <Image
            source={imageSource}
            alt={params.name}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </Box>

        {/* 2. Detalles del Auto */}
        <VStack p="$5" space="md" flex={1}>
          {/* ----- CORRECCIÓN DE COLOR ----- */}
          <Heading size="2xl" color="$text900">{params.name}</Heading>
          <Text size="lg" color="$text900">
            {params.style}
          </Text>

          {/* Specs */}
          <HStack
            space="xl"
            alignItems="center"
            bg="$background50"
            p="$3"
            borderRadius="$lg"
          >
            <HStack alignItems="center" space="sm">
              {/* ----- CORRECCIÓN DE COLOR ----- */}
              <UserIcon size="lg" color="$text900" />
              <Text fontSize="$md" color="$text900">
                {params.passengers} Pasajeros
              </Text>
            </HStack>
            <HStack alignItems="center" space="sm">
              {/* ----- CORRECCIÓN DE COLOR ----- */}
              <CogIcon size="lg" color="$text900" />
              <Text fontSize="$md" color="$text900">
                {params.transmission}
              </Text>
            </HStack>
          </HStack>

          {/* Descripción Falsa */}
          {/* ----- CORRECCIÓN DE COLOR ----- */}
          <Text mt="$4" color="$text990">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          {/* Precio (abajo) */}
          <Box flex={1} />
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Heading size="3xl" color="$orange500">
              ${params.price}
              {/* ----- CORRECCIÓN DE COLOR ----- */}
              <Text size="md" color="$text900">
                /día
              </Text>
            </Heading>
            <Button
              size="lg"
              bg="$orange500"
              borderRadius="$lg"
              onPress={handleReserve}
            >
              <ButtonText>Reservar</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
});