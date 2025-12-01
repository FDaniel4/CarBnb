import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal, 
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

const ReceptionBellIcon = (props: any) => (
  <MaterialCommunityIcons name="bell-ring-outline" {...props} />
);

export default function BookNowScreen() {
  const router = useRouter(); 

  // ----- ESTADO PARA LOS MODALS (City, Type, etc.) -----
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('City');
  const [selectedTransmission, setSelectedTransmission] =
    useState('Transmission');
  const [selectedCarType, setSelectedCarType] = useState('Type of car');
  const [modalAction, setModalAction] = useState<
    ((value: string) => void) | null
  >(null);

  // ----- ESTADO PARA EL DATEPICKER (From, To) -----
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<'from' | 'to'>('from');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromDateText, setFromDateText] = useState('From');
  const [toDateText, setToDateText] = useState('To');

  const openModal = (
    title: string,
    options: string[],
    setter: (value: string) => void 
  ) => {
    setModalTitle(title);
    setModalOptions(options);
    setModalAction(() => setter); 
    setShowModal(true);
  };

  // --- Función para abrir el DatePicker (sin cambios) ---
  const openDatePicker = (pickerType: 'from' | 'to') => {
    setCurrentPicker(pickerType);
    setShowDatePicker(true);
  };

  // --- Funciones de DatePicker (sin cambios) ---
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      <ScrollView
        contentContainerClassName="p-5 pb-10"
      >
        <View className="flex-row items-center space-x-2 mb-6 pt-4">
          <ReceptionBellIcon size={28} color="#F97A4B" />
          <Text className="text-2xl font-bold text-gray-900">Book now</Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            className="flex-row justify-between items-center py-4 px-4 bg-orange-100 border border-orange-200 rounded-lg"
            onPress={() =>
              openModal(
                'Select City',
                ['New York', 'Los Angeles', 'Chicago', 'Miami'],
                setSelectedCity 
              )
            }
          >
            <Text className="text-gray-700 text-base">{selectedCity}</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <View>
            <Text className="text-gray-500 mb-2">Date</Text>
            <TouchableOpacity
              onPress={() => openDatePicker('from')}
              className="flex-row justify-between items-center border-b border-gray-300 py-3 mb-3"
            >
              <Text
                className={`text-lg ${
                  fromDateText === 'From' ? 'text-gray-500' : 'text-gray-800'
                }`}
              >
                {fromDateText}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>

            <Text className="text-gray-500 mb-2">Date</Text>
            <TouchableOpacity
              onPress={() => openDatePicker('to')}
              className="flex-row justify-between items-center border-b border-gray-300 py-3"
            >
              <Text
                className={`text-lg ${
                  toDateText === 'To' ? 'text-gray-500' : 'text-gray-800'
                }`}
              >
                {toDateText}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Selector de Transmisión */}
          <TouchableOpacity
            className="flex-row justify-between items-center py-4 px-4 bg-orange-100 border border-orange-200 rounded-lg"
            onPress={() =>
              openModal(
                'Select Transmission',
                ['Automatic', 'Manual'],
                setSelectedTransmission // <-- Pasamos la función setter
              )
            }
          >
            <Text className="text-gray-700 text-base">
              {selectedTransmission}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Selector de Tipo de Auto */}
          <TouchableOpacity
            className="flex-row justify-between items-center py-4 px-4 bg-orange-100 border border-orange-200 rounded-lg"
            onPress={() =>
              openModal(
                'Select Car Type',
                ['Sedan', 'SUV', 'Truck', 'Sport'],
                setSelectedCarType // <-- Pasamos la 'setter'
              )
            }
          >
            <Text className="text-gray-700 text-base">{selectedCarType}</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Botón de Búsqueda */}
          <TouchableOpacity
            className="py-4 bg-orange-500 rounded-lg mt-4"
            onPress={() => {
              console.log('Buscando con:', {
                city: selectedCity,
                from: fromDateText,
                to: toDateText,
                transmission: selectedTransmission,
                type: selectedCarType,
              });
              // Navegar a la pantalla de resultados
              router.push({
                pathname: '/drawer/searchResults',
                params: {
                  city: selectedCity,
                  from: fromDateText,
                  to: toDateText,
                }
              });
            }}
          >
            <Text className="text-white text-base font-bold text-center">
              SEARCH
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
          <Pressable className="w-full bg-orange-100 rounded-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-orange-200">
              <Text className="text-lg font-bold text-orange-500">
                {modalTitle}
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
                    if (modalAction) {
                      modalAction(option);
                    }
                    setShowModal(false);
                  }}
                >
                  <Text className="text-gray-700 text-base">{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
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
      {showDatePicker && Platform.OS === 'ios' && (
        <View className="flex-row justify-around p-2">
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
