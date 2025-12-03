import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme as useRNScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Calendario ---
import { Calendar, LocaleConfig } from 'react-native-calendars';

// --- Firebase y Hooks ---
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useThemeColor } from '../../../hooks/use-theme-color';
import { db } from '../../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

// Configuración de idioma para el calendario (Español)
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: "Hoy"
};
LocaleConfig.defaultLocale = 'es';

type CarData = {
  name: string;
  price: string;
  description: string;
  image: string;
  style: string;
  passengers: number;
  transmission: string;
  blockedDates?: string[];
};

// Helper para calcular rangos de fechas (mismo que en PaymentScreen)
const getDatesInRange = (startDate: string, endDate: string) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);
    currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
    stopDate.setMinutes(stopDate.getMinutes() + stopDate.getTimezoneOffset());
    
    while (currentDate <= stopDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

export default function EditCarScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams() as { carId: string };
  const { t } = useLanguage();

  // --- Tema ---
  const scheme = useRNScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const inputBg = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E7EB';

  // --- Estados ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [carData, setCarData] = useState<CarData>({
    name: '',
    price: '',
    description: '',
    image: '',
    style: '',
    passengers: 4,
    transmission: '',
    blockedDates: []
  });

  // Todas las fechas bloqueadas (Manuales + Reservas)
  const [localBlockedDates, setLocalBlockedDates] = useState<string[]>([]);
  
  // Fechas que pertenecen EXCLUSIVAMENTE a reservas confirmadas
  const [reservedByUsers, setReservedByUsers] = useState<string[]>([]);

  // 1. Cargar datos del auto Y reservas asociadas
  useEffect(() => {
    const fetchData = async () => {
      if (!carId) return;
      try {
        // A. Cargar datos del Auto
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as CarData;
          setCarData(data);
          setLocalBlockedDates(data.blockedDates || []);

          // B. Cargar Reservas Confirmadas de este auto
          // Esto es crucial para saber qué fechas son "intocables"
          const q = query(
            collection(db, 'reservations'), 
            where('carId', '==', carId),
            where('status', '==', 'confirmed')
          );
          
          const querySnapshot = await getDocs(q);
          let tempReserved: string[] = [];
          
          querySnapshot.forEach((resDoc) => {
             const resData = resDoc.data();
             if (resData.startDate && resData.endDate) {
                 const dates = getDatesInRange(resData.startDate, resData.endDate);
                 tempReserved.push(...dates);
             }
          });
          
          setReservedByUsers(tempReserved);

        } else {
          Alert.alert(t('error'), t('carNotFound'));
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert(t('error'), t('loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [carId]);

  // --- Lógica Inteligente del Calendario ---
  const handleDayPress = (day: any) => {
    const date = day.dateString;

    // 1. PROTECCIÓN: Si la fecha es de una reserva, NO se puede quitar aquí
    if (reservedByUsers.includes(date)) {
        Alert.alert(
            "Fecha Reservada", 
            "Este día está apartado por un cliente. Para liberarlo, debe cancelar la reserva correspondiente en la sección de Reservas."
        );
        return;
    }

    // 2. Lógica estándar para bloqueos manuales
    if (localBlockedDates.includes(date)) {
        // Desbloquear (si era manual)
        setLocalBlockedDates(prev => prev.filter(d => d !== date));
    } else {
        // Bloquear manualmente
        setLocalBlockedDates(prev => [...prev, date]);
    }
  };

  // Generar marcas visuales diferenciadas
  const markedDates = useMemo(() => {
    const marks: any = {};
    
    localBlockedDates.forEach(date => {
        // Verificamos si la fecha es de una reserva
        const isClientReservation = reservedByUsers.includes(date);

        marks[date] = {
            selected: true,
            // Naranja = Cliente (Intocable) | Rojo = Tu bloqueo (Editable)
            selectedColor: isClientReservation ? '#F97A4B' : '#EF4444', 
            textColor: 'white',
            // Opcional: deshabilitar interacción visualmente si es reserva
            // disableTouchEvent: isClientReservation 
        };
    });
    
    return marks;
  }, [localBlockedDates, reservedByUsers]);

  // 2. Guardar cambios
  const handleSave = async () => {
    if (!carData.name || !carData.price) {
        Alert.alert(t('error'), t('validationError'));
        return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        name: carData.name,
        price: carData.price,
        description: carData.description,
        // Guardamos la lista combinada (Manuales + Reservas)
        blockedDates: localBlockedDates 
      });
      
      Alert.alert(t('saved'), t('saveSuccessMsg'), [
          { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('saveErrorMsg'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-4 pb-10">
        
        {/* Header */}
        <View className="flex-row items-center mb-6">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4"
            >
                <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold" style={{ color: textColor }}>{t('editCarTitle')}</Text>
        </View>

        {/* Tarjeta de Edición */}
        <View 
            className="rounded-2xl p-4 shadow-sm border mb-6"
            style={{ backgroundColor: cardBg, borderColor }}
        >
            {/* Imagen */}
            <View className="w-full h-48 bg-gray-200 rounded-xl mb-6 overflow-hidden">
                <Image 
                    source={{ uri: carData.image }} 
                    className="w-full h-full"
                    resizeMode="cover"
                />
                 <View className="absolute bottom-2 right-2 bg-black/60 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs">{t('photoReadOnly')}</Text>
                 </View>
            </View>

            {/* Nombre */}
            <View className="mb-4">
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('carNameLabel')}</Text>
                <View className="flex-row items-center rounded-lg px-3" style={{ backgroundColor: inputBg }}>
                    <TextInput
                        value={carData.name}
                        onChangeText={(text) => setCarData({...carData, name: text})}
                        className="flex-1 py-3 text-base font-bold"
                        style={{ color: textColor }}
                    />
                    <MaterialIcons name="edit" size={18} color="gray" />
                </View>
            </View>

            {/* Precio */}
            <View className="mb-4">
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('priceLabel')}</Text>
                <View className="flex-row items-center rounded-lg px-3" style={{ backgroundColor: inputBg }}>
                    <Text className="text-orange-500 text-lg font-bold mr-1">$</Text>
                    <TextInput
                        value={carData.price}
                        onChangeText={(text) => setCarData({...carData, price: text})}
                        keyboardType="numeric"
                        className="flex-1 py-3 text-lg font-bold text-orange-500"
                    />
                    <MaterialIcons name="edit" size={18} color="gray" />
                </View>
            </View>

             {/* Descripción */}
             <View className="mb-2">
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('descriptionLabel')}</Text>
                <TextInput
                    value={carData.description}
                    onChangeText={(text) => setCarData({...carData, description: text})}
                    multiline
                    numberOfLines={4}
                    className="rounded-lg p-3 text-base leading-6"
                    style={{ backgroundColor: inputBg, color: textColor, textAlignVertical: 'top', height: 100 }}
                />
            </View>
        </View>

        {/* --- SECCIÓN NUEVA: GESTIÓN DE DISPONIBILIDAD --- */}
        <View className="mb-6">
            <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
                Gestión de Disponibilidad
            </Text>
            
            {/* Leyenda de Colores */}
            <View className="flex-row mb-3 space-x-4">
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-[#EF4444] mr-2" />
                    <Text className="text-xs text-gray-500">Bloqueado por ti</Text>
                </View>
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded-full bg-[#F97A4B] mr-2" />
                    <Text className="text-xs text-gray-500">Reservado (Cliente)</Text>
                </View>
            </View>
            
            <View className="rounded-xl overflow-hidden border border-gray-200">
                <Calendar
                    minDate={new Date().toISOString().split('T')[0]}
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: cardBg,
                        calendarBackground: cardBg,
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#EF4444', // Default fallback
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#F97A4B',
                        dayTextColor: textColor,
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#F97A4B',
                        monthTextColor: textColor,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 14
                    }}
                />
            </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
            className={`mt-2 py-4 rounded-xl items-center shadow-md ${saving ? 'bg-gray-400' : 'bg-orange-500'}`}
        >
            {saving ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white text-lg font-bold">{t('saveChanges')}</Text>
            )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}