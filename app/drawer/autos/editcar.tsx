import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

// --- Firebase y Hooks ---
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useThemeColor } from '../../../hooks/use-theme-color';
import { db } from '../../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

type CarData = {
  name: string;
  price: string;
  description: string;
  image: string;
  style: string;
  passengers: number;
  transmission: string;
};

export default function EditCarScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams() as { carId: string };
  
  // 2. USAR HOOK DE IDIOMA
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
  });

  // 1. Cargar datos del auto
  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return;
      try {
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCarData(docSnap.data() as CarData);
        } else {
          Alert.alert(t('error'), t('carNotFound')); // <-- Traducido
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert(t('error'), t('loadError')); // <-- Traducido
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  // 2. Guardar cambios
  const handleSave = async () => {
    if (!carData.name || !carData.price) {
        Alert.alert(t('error'), t('validationError')); // <-- Traducido
        return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        name: carData.name,
        price: carData.price,
        description: carData.description,
      });
      
      Alert.alert(t('saved'), t('saveSuccessMsg'), [ // <-- Traducido
          { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('saveErrorMsg')); // <-- Traducido
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
        
        {/* Header con botón atrás */}
        <View className="flex-row items-center mb-6">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4"
            >
                <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold" style={{ color: textColor }}>{t('editCarTitle')}</Text> {/* <-- Traducido */}
        </View>

        {/* Tarjeta de Edición */}
        <View 
            className="rounded-2xl p-4 shadow-sm border"
            style={{ backgroundColor: cardBg, borderColor }}
        >
            {/* Imagen (Solo visualización por ahora) */}
            <View className="w-full h-48 bg-gray-200 rounded-xl mb-6 overflow-hidden">
                <Image 
                    source={{ uri: carData.image }} 
                    className="w-full h-full"
                    resizeMode="cover"
                />
                 <View className="absolute bottom-2 right-2 bg-black/60 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs">{t('photoReadOnly')}</Text> {/* <-- Traducido */}
                 </View>
            </View>

            {/* Nombre */}
            <View className="mb-4">
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('carNameLabel')}</Text> {/* <-- Traducido */}
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
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('priceLabel')}</Text> {/* <-- Traducido */}
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
                <Text className="text-xs uppercase font-bold text-gray-500 mb-1">{t('descriptionLabel')}</Text> {/* <-- Traducido */}
                <TextInput
                    value={carData.description}
                    onChangeText={(text) => setCarData({...carData, description: text})}
                    multiline
                    numberOfLines={6}
                    className="rounded-lg p-3 text-base leading-6"
                    style={{ backgroundColor: inputBg, color: textColor, textAlignVertical: 'top', height: 120 }}
                />
            </View>

        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
            className={`mt-8 py-4 rounded-xl items-center shadow-md ${saving ? 'bg-gray-400' : 'bg-orange-500'}`}
        >
            {saving ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white text-lg font-bold">{t('saveChanges')}</Text> /* <-- Traducido */
            )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}