import {
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    ChevronDownIcon,
    ChevronRightIcon,
    CloseIcon,
    Heading,
    HStack,
    Icon,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Pressable, // Importamos Pressable para los selectores de fecha
    Text,
    VStack,
} from '@gluestack-ui/themed';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
// La campanita de "Book now" es especial, la importamos desde expo-vector-icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
// Importamos SafeAreaView para respetar los bordes del teléfono
import { SafeAreaView } from 'react-native-safe-area-context';

// Creamos un componente de Icono personalizado para esa campana
const ReceptionBellIcon = (props: any) => (
  <Icon
    as={MaterialCommunityIcons}
    name="bell-ring-outline"
    {...props}
  />
);

export default function BookNowScreen() {
  // ----- ESTADO PARA LOS MODALS (City, Type, etc.) -----
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('City');
  const [selectedTransmission, setSelectedTransmission] =
    useState('Transmission'); // Usamos la palabra correcta en el estado
  const [selectedCarType, setSelectedCarType] = useState('Type of car');

  // ----- ESTADO PARA EL DATEPICKER (From, To) -----
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'from' | 'to'>('from');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateText, setFromDateText] = useState('From');
  const [toDateText, setToDateText] = useState('To');

  // --- Función para abrir el Modal de selección ---
  const openModal = (
    title: string,
    options: string[],
    setter: (value: string) => void
  ) => {
    setModalTitle(title);
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
    // En Android, ocultamos el picker después de seleccionar
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set') {
      // Solo actualizamos si el usuario presionó "OK"
      if (currentPicker === 'from') {
        setFromDate(currentDate);
        setFromDateText(currentDate.toLocaleDateString()); // Actualizamos el texto
      } else {
        setToDate(currentDate);
        setToDateText(currentDate.toLocaleDateString()); // Actualizamos el texto
      }
    } else {
      // Si el usuario cancela (solo en Android)
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  // Botón "Hecho" para iOS (ya que el picker es un modal)
  const onDoneIOS = () => {
    setShowDatePicker(false);
    if (currentPicker === 'from') {
      setFromDateText(fromDate.toLocaleDateString());
    } else {
      setToDateText(toDate.toLocaleDateString());
    }
  };

  return (
    // Usamos SafeAreaView para evitar la barra de estado
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="$white" p="$5">
        {/* ----- 2. Sección del Título ----- */}
        <HStack alignItems="center" space="sm" mb="$6" pt="$4">
          <ReceptionBellIcon size="xl" color="$orange500" />
          <Heading size="2xl" color="$text900">
            Book now
          </Heading>
        </HStack>

        {/* ----- 3. Formulario ----- */}
        <VStack space="md">
          {/* Selector de Ciudad (Redondeado) */}
          <Button
            size="lg"
            borderColor="$orange200"
            bg="$orange100"
            justifyContent="space-between"
            borderRadius="$lg" // <-- AJUSTE DE ESTILO
            onPress={() =>
              openModal(
                'Select City',
                ['New York', 'Los Angeles', 'Chicago', 'Miami'],
                setSelectedCity
              )
            }
          >
            <ButtonText color="$text700">{selectedCity}</ButtonText>
            <ButtonIcon as={ChevronRightIcon} color="$text700" />
          </Button>

          {/* Selectores de Fecha (Estilo de línea) */}
          <Box>
            <Text color="$gray500" mb="$2">
              Date
            </Text>
            {/* Botón "Desde" */}
            <Pressable
              onPress={() => openDatePicker('from')}
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: '$coolGray300',
                py: '$3', // Padding vertical
              }}
              mb="$3"
            >
              <Text
                fontSize="$lg"
                color={fromDateText === 'From' ? '$gray500' : '$text800'}
              >
                {fromDateText}
              </Text>
              <Icon as={ChevronDownIcon} color="$text700" />
            </Pressable>

            <Text color="$gray500" mb="$2">
              Date
            </Text>
            {/* Botón "Hasta" */}
            <Pressable
              onPress={() => openDatePicker('to')}
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: '$coolGray300',
                py: '$3', // Padding vertical
              }}
            >
              <Text
                fontSize="$lg"
                color={toDateText === 'To' ? '$gray500' : '$text800'}
              >
                {toDateText}
              </Text>
              <Icon as={ChevronDownIcon} color="$text700" />
            </Pressable>
          </Box>

          {/* Selector de Transmisión (Redondeado) */}
          <Button
            size="lg"
            borderColor="$orange200"
            bg="$orange100"
            justifyContent="space-between"
            borderRadius="$lg" // <-- AJUSTE DE ESTILO
            onPress={() =>
              openModal(
                'Select Transmission',
                ['Automatic', 'Manual'],
                setSelectedTransmission
              )
            }
          >
            {/* El typo "Transmition" de la imagen se corrige aquí */}
            <ButtonText color="$text700">{selectedTransmission}</ButtonText>
            <ButtonIcon as={ChevronRightIcon} color="$text700" />
          </Button>

          {/* Selector de Tipo de Auto (Redondeado) */}
          <Button
            size="lg"
            borderColor="$orange200"
            bg="$orange100"
            justifyContent="space-between"
            borderRadius="$lg" // <-- AJUSTE DE ESTILO
            onPress={() =>
              openModal(
                'Select Car Type',
                ['Sedan', 'SUV', 'Truck', 'Sport'],
                setSelectedCarType
              )
            }
          >
            <ButtonText color="$text700">{selectedCarType}</ButtonText>
            <ButtonIcon as={ChevronRightIcon} color="$text700" />
          </Button>

          {/* Botón de Búsqueda (Redondeado) */}
          <Button
            size="lg"
            bg="$orange500"
            borderRadius="$lg" // <-- AJUSTE DE ESTILO
            onPress={() => {
              console.log('Buscando con:', {
                city: selectedCity,
                from: fromDateText,
                to: toDateText,
                transmission: selectedTransmission,
                type: selectedCarType,
              });
              // TODO: Navegar a la pantalla de resultados de búsqueda
            }}
            mt="$4"
          >
            <ButtonText>SEARCH</ButtonText>
          </Button>
        </VStack>

        {/* ----- Modal Genérico (oculto hasta que se llama) ----- */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <ModalBackdrop />
          {/* AQUÍ COMIENZAN LAS CORRECCIONES DE ESTILO */}
          <ModalContent bg="$orange100" borderRadius="$lg">
            <ModalHeader borderBottomWidth={0}>
              <Heading size="lg" color="$orange500">{modalTitle}</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} color="$orange500" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              {modalOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    // Aquí actualizamos el estado correspondiente
                    if (modalTitle === 'Select City') setSelectedCity(option);
                    if (modalTitle === 'Select Transmission')
                      setSelectedTransmission(option);
                    if (modalTitle === 'Select Car Type')
                      setSelectedCarType(option);
                    setShowModal(false);
                  }}
                  sx={{
                    p: '$3',
                    borderBottomWidth: 1,
                    borderColor: '$orange200', // <-- Borde naranja
                    ':active': {
                      bg: '$orange200', // <-- Color al presionar
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
          <HStack justifyContent="space-around" p="$2">
            <Button variant="outline" onPress={() => setShowDatePicker(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={onDoneIOS}>
              <ButtonText>Done</ButtonText>
            </Button>
          </HStack>
        )}
      </Box>
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