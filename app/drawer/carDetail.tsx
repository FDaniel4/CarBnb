import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/use-theme-color';

// --- LIBRERÍA DE CALENDARIO ---
import { Calendar, LocaleConfig } from 'react-native-calendars';

// --- FIREBASE ---
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../context/LanguageContext';

// --- CONFIGURACIÓN DE IDIOMA DEL CALENDARIO (ESPAÑOL) ---
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: "Hoy"
};
LocaleConfig.defaultLocale = 'es';

const UserIcon = ({ color }: { color: string }) => (
  <FontAwesome name="user" size={20} color={color} />
);
const CogIcon = ({ color }: { color: string }) => (
  <Ionicons name="cog" size={24} color={color} />
);

// Helper para obtener días entre dos fechas (para pintar el rango)
const getDatesInRange = (startDate: string, endDate: string) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);
    // Ajuste por zona horaria simple
    currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
    stopDate.setMinutes(stopDate.getMinutes() + stopDate.getTimezoneOffset());
    
    while (currentDate <= stopDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

export default function CarDetailScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#F3F4F6';

  const params = useLocalSearchParams() as {
    id: string;
    name: string;
    style: string;
    price: string;
    passengers: string;
    transmission: string;
    image: string | string[];
    description: string;
    ownerId: string;
  };

  // --- ESTADOS PARA EL CALENDARIO ---
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // --- 1. OBTENER FECHAS BLOQUEADAS DE FIREBASE ---
  useEffect(() => {
    if (!params.id) return;
    
    // Escuchamos en tiempo real para ver si alguien más reserva
    const unsub = onSnapshot(doc(db, 'cars', params.id), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Si existe el array blockedDates, lo guardamos
            if (data.blockedDates && Array.isArray(data.blockedDates)) {
                setBlockedDates(data.blockedDates);
            }
        }
    });

    return () => unsub();
  }, [params.id]);

  // --- 2. LÓGICA DE SELECCIÓN DE FECHAS ---
  const onDayPress = (day: any) => {
    const selectedDay = day.dateString;

    // A. Si ya hay rango completo, reseteamos e iniciamos uno nuevo
    if (startDate && endDate) {
        setStartDate(selectedDay);
        setEndDate(null);
        return;
    }

    // B. Si no hay fecha de inicio, la establecemos
    if (!startDate) {
        setStartDate(selectedDay);
        return;
    }

    // C. Si hay inicio pero no fin
    if (startDate && !endDate) {
        // Validación 1: Si selecciona una fecha anterior a la de inicio, cambiamos el inicio
        if (selectedDay < startDate) {
            setStartDate(selectedDay);
        } 
        // Validación 2: Si selecciona una fecha posterior
        else if (selectedDay > startDate) {
            // Verificar si hay fechas bloqueadas en medio del rango
            const range = getDatesInRange(startDate, selectedDay);
            const hasBlockedDate = range.some(d => blockedDates.includes(d));

            if (hasBlockedDate) {
                Alert.alert(t('opps'), "No puedes seleccionar un rango que incluya fechas ya reservadas.");
                setStartDate(selectedDay); // Movemos el inicio a la nueva fecha para facilitar
            } else {
                setEndDate(selectedDay);
            }
        } else {
            // Si selecciona el mismo día, lo consideramos inicio y fin (1 día)
            setEndDate(selectedDay);
        }
    }
  };

  // --- 3. GENERAR MARCAS VISUALES PARA EL CALENDARIO ---
  const markedDates = useMemo(() => {
    let marks: any = {};

    // 1. Marcar fechas bloqueadas (Gris)
    blockedDates.forEach(date => {
        marks[date] = { 
            disabled: true, 
            disableTouchEvent: true, 
            color: scheme === 'dark' ? '#333' : '#d1d5db', 
            textColor: scheme === 'dark' ? '#555' : '#9ca3af',
            startingDay: true,
            endingDay: true
        };
    });

    // 2. Marcar selección del usuario (Naranja)
    if (startDate) {
        marks[startDate] = { selected: true, startingDay: true, color: '#F97A4B', textColor: 'white' };
        
        if (endDate) {
            const range = getDatesInRange(startDate, endDate);
            range.forEach((date, index) => {
                if (date === startDate) {
                    marks[date] = { selected: true, startingDay: true, color: '#F97A4B', textColor: 'white' };
                } else if (date === endDate) {
                    marks[date] = { selected: true, endingDay: true, color: '#F97A4B', textColor: 'white' };
                } else {
                    marks[date] = { selected: true, color: '#ffedd5', textColor: 'black' }; // Naranja claro en medio
                }
            });
        }
    }

    return marks;
  }, [startDate, endDate, blockedDates, scheme]);

  // --- FUNCIÓN DE REPARACIÓN DE URL ---
  const getFixedUrl = (urlParam: string | string[] | undefined) => {
    if (!urlParam) return "";
    let url = Array.isArray(urlParam) ? urlParam[0] : urlParam;

    if (url.includes("firebasestorage.googleapis.com") && url.includes("/o/")) {
        const parts = url.split("/o/");
        if (parts.length >= 2) {
            const base = parts[0];
            const rest = parts[1];
            const [path, query] = rest.split("?");
            
            if (path.includes("/")) {
                return `${base}/o/${encodeURIComponent(path)}?${query}`;
            }
        }
    }
    return url;
  };

  const imageUrl = getFixedUrl(params.image);

  // --- BOTÓN RESERVAR ACTUALIZADO ---
  const handleReserve = () => {
    if (!startDate || !endDate) {
        Alert.alert(t('missingData'), "Por favor selecciona una fecha de inicio y fin.");
        return;
    }

    router.push({
      pathname: '/drawer/payment',
      params: {
        carId: params.id,
        carName: params.name,
        price: params.price, // Precio por día
        ownerId: params.ownerId,
        image: imageUrl, 
        startDate: startDate,
        endDate: endDate
      },
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="flex-grow pb-10">
        
        {/* --- 1. IMAGEN DEL AUTO (Header) --- */}
        <View className="w-full h-72 bg-gray-200 relative">
          {imageUrl ? (
            <RNImage
              source={{ uri: imageUrl }} 
              accessibilityLabel={params.name}
              style={{ width: '100%', height: '100%' }} 
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-300">
                <Ionicons name="image-outline" size={50} color="gray" />
                <Text style={{color: 'gray'}}>{t('imageUnavailable')}</Text>
            </View>
          )}
          
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* --- 2. DETALLES --- */}
        <View 
            className="p-6 -mt-6 rounded-t-3xl flex-1"
            style={{ backgroundColor: background }}
        >
            {/* Título y Precio */}
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 mr-4">
                    <Text className="text-3xl font-bold" style={{ color: textColor }}>
                        {params.name}
                    </Text>
                    <Text className="text-lg text-gray-500 font-medium">
                        {params.style}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-bold text-orange-500">
                        ${params.price}
                    </Text>
                    <Text className="text-xs text-gray-400">{t('perDay')}</Text>
                </View>
            </View>

            {/* Especificaciones */}
            <View className="flex-row space-x-4 mb-6">
                <View 
                    className="flex-1 flex-row items-center justify-center p-4 rounded-xl"
                    style={{ backgroundColor: cardBg }}
                >
                    <UserIcon color={textColor} />
                    <Text className="ml-3 font-semibold" style={{ color: textColor }}>
                        {params.passengers} {t('passengersLabel')}
                    </Text>
                </View>

                <View 
                    className="flex-1 flex-row items-center justify-center p-4 rounded-xl"
                    style={{ backgroundColor: cardBg }}
                >
                    <CogIcon color={textColor} />
                    <Text className="ml-3 font-semibold" style={{ color: textColor }}>
                        {params.transmission === 'Auto' ? t('automatic') : (params.transmission === 'Manual' ? t('manual') : params.transmission)}
                    </Text>
                </View>
            </View>

            {/* --- 3. CALENDARIO DE DISPONIBILIDAD (NUEVO) --- */}
            <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
                {t('dateLabel') || 'Disponibilidad'}
            </Text>
            
            <View className="mb-8 rounded-xl overflow-hidden border border-gray-200">
                <Calendar
                    minDate={new Date().toISOString().split('T')[0]} // No reservar en el pasado
                    onDayPress={onDayPress}
                    markingType={'period'}
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: background,
                        calendarBackground: background,
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#F97A4B',
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

            {/* Descripción */}
            <Text className="text-lg font-bold mb-3" style={{ color: textColor }}>
                {t('descriptionLabel')}
            </Text>
            <Text className="text-base text-gray-500 leading-6 mb-10">
                {params.description && params.description.trim() !== "" && params.description !== "undefined"
                    ? params.description 
                    : t('noDescriptionProvided')}
            </Text>

            {/* Botón Reservar */}
            <TouchableOpacity
                className={`py-4 rounded-xl items-center shadow-lg shadow-orange-200 ${(!startDate || !endDate) ? 'bg-gray-400' : 'bg-orange-500'}`}
                onPress={handleReserve}
                disabled={!startDate || !endDate}
            >
                <Text className="text-white font-bold text-xl">
                    {t('bookNow')}
                </Text>
                {/* Mostrar fechas seleccionadas en el botón para feedback visual */}
                {startDate && endDate && (
                    <Text className="text-white text-xs mt-1">
                        {startDate} al {endDate}
                    </Text>
                )}
            </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}