import {
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    ChevronDownIcon,
    ChevronRightIcon,
    Heading,
    HStack,
    Icon,
    Text,
    VStack
} from '@gluestack-ui/themed';
import React from 'react';

// La campanita de "Book now" es especial, la importamos desde expo-vector-icons
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Creamos un componente de Icono personalizado para esa campana
const ReceptionBellIcon = (props: any) => (
  <Icon
    as={MaterialCommunityIcons}
    name="bell-ring-outline"
    {...props}
  />
);

export default function BookNowScreen() {
  // Aquí puedes manejar el estado de las fechas
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());

  return (
    <Box flex={1} bg="$white" p="$5" pt="$10">
      {/* ----- 1. Sección del Header ----- */}
        {/*
          ¡CAMBIA ESTA RUTA!
          Viendo tus archivos, podría ser:
          require('@/assets/images/Logo-negro.jpg') o
          require('@/assets/images/LogosinletrasB.jpg')
        */}
       

      {/* ----- 2. Sección del Título ----- */}
      <HStack alignItems="center" space="sm" mb="$6">
        <ReceptionBellIcon size="xl" color="$orange500" />
        <Heading size="2xl" color="$text900">
          Book now
        </Heading>
      </HStack>

      {/* ----- 3. Formulario ----- */}
      <VStack space="md">
        {/* Selector de Ciudad */}
        <Button
          variant="outline"
          size="lg"
          borderColor="$orange200"
          bg="$orange100"
          justifyContent="space-between"
          onPress={() => {
            /* TODO: Navegar a la pantalla de seleccionar ciudad */
          }}
        >
          <ButtonText color="$text700">City</ButtonText>
          <ButtonIcon as={ChevronRightIcon} color="$text700" />
        </Button>

        {/* Selectores de Fecha */}
        <Box>
          <Text color="$gray500" mb="$2">
            Date
          </Text>
          {/* Botón "Desde" */}
          <Button
            variant="outline"
            size="lg"
            borderColor="$coolGray300"
            justifyContent="space-between"
            onPress={() => {
              /* TODO: Abrir el modal de DatePicker "From" */
            }}
            mb="$3"
          >
            <ButtonText color="$text800">From</ButtonText>
            <ButtonIcon as={ChevronDownIcon} color="$text700" />
          </Button>

          <Text color="$gray500" mb="$2">
            Date
          </Text>
          {/* Botón "Hasta" */}
          <Button
            variant="outline"
            size="lg"
            borderColor="$coolGray300"
            justifyContent="space-between"
            onPress={() => {
              /* TODO: Abrir el modal de DatePicker "To" */
            }}
          >
            <ButtonText color="$text800">To</ButtonText>
            <ButtonIcon as={ChevronDownIcon} color="$text700" />
          </Button>
        </Box>

        {/* Selector de Transmisión */}
        <Button
          variant="outline"
          size="lg"
          borderColor="$orange200"
          bg="$orange100"
          justifyContent="space-between"
          onPress={() => {
            /* TODO: Navegar a la pantalla de seleccionar transmisión */
          }}
        >
          {/* Corregí el typo de la imagen ("Transmition") */}
          <ButtonText color="$text700">Transmission</ButtonText>
          <ButtonIcon as={ChevronRightIcon} color="$text700" />
        </Button>

        {/* Selector de Tipo de Auto */}
        <Button
          variant="outline"
          size="lg"
          borderColor="$orange200"
          bg="$orange100"
          justifyContent="space-between"
          onPress={() => {
            /* TODO: Navegar a la pantalla de seleccionar tipo */
          }}
        >
          <ButtonText color="$text700">Type of car</ButtonText>
          <ButtonIcon as={ChevronRightIcon} color="$text700" />
        </Button>

        {/* Botón de Búsqueda */}
        <Button
          size="lg"
          bg="$orange500"
          onPress={() => {
            /* TODO: Ejecutar la búsqueda */
          }}
          mt="$4"
        >
          <ButtonText>SEARCH</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}