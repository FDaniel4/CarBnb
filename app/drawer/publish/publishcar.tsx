import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase y Hooks ---
import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useThemeColor } from '../../../hooks/use-theme-color';
import { auth, db, storage } from '../../../utils/firebaseConfig';

// 1. IMPORTAR CONTEXTO DE IDIOMA
import { useLanguage } from '../../context/LanguageContext';

export default function PublishCarScreen() {
  const router = useRouter();
  
  // 2. USAR EL HOOK DE IDIOMA
  const { t } = useLanguage();

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBg = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';
  const placeholderColor = '#9CA3AF';
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#F9FAFB';

  // --- Estados del Formulario ---
  const [name, setName] = useState('');
  const [city, setCity] = useState(''); 
  const [style, setStyle] = useState(''); 
  const [price, setPrice] = useState('');
  const [passengers, setPassengers] = useState('4');
  const [transmission, setTransmission] = useState<'Auto' | 'Manual'>('Auto');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // --- Checar Auth ---
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      setIsGuest(true);
    }
  }, []);

  // --- 1. Seleccionar Imagen ---
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permissionDenied'), t('galleryPermissionMsg')); // <-- Traducido
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- 2. Subir y Publicar ---
  const handlePublish = async () => {
    if (isGuest) return;

    // Validar que todos los campos, incluida la ciudad, estén llenos
    if (!name || !price || !imageUri || !style || !city) {
      Alert.alert(t('missingData'), t('missingDataMsg')); // <-- Traducido
      return;
    }

    setLoading(true);

    try {
      // A) Subir Imagen
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = ref(storage, `cars/${auth.currentUser!.uid}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // B) Guardar en Firestore (con la ciudad)
      await addDoc(collection(db, 'cars'), {
        ownerId: auth.currentUser!.uid,
        name,
        city, // <--- Guardamos la ciudad para el buscador
        style,
        price,
        passengers: parseInt(passengers),
        transmission,
        description,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      Alert.alert(t('successTitle'), t('publishSuccessMsg'), [ // <-- Traducido
        { text: 'OK', onPress: () => router.push('/drawer/home') }
      ]);

      // Limpiar formulario
      setName(''); setCity(''); setPrice(''); setImageUri(null); setDescription('');

    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('publishErrorMsg')); // <-- Traducido
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers de Estilo para Transmisión ---
  const getTransContainerStyle = (type: 'Auto' | 'Manual') => {
    // ... (sin cambios de lógica, solo estilo visual)
    return ""; // (Este helper no se usaba directamente en el render original de arriba, se usaba inline class. Aquí mantengo tu estructura)
  };

  // --- VISTA DE BLOQUEO ---
  if (isGuest) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
          <View className="flex-1 justify-center items-center p-6">
              <Ionicons name="lock-closed-outline" size={80} color={scheme === 'dark' ? '#555' : '#DDD'} />
              <Text className="text-2xl font-bold mt-6 text-center" style={{ color: textColor }}>
                  {t('accessRestricted')} {/* <-- Traducido */}
              </Text>
              <Text className="text-gray-500 mt-2 text-center mb-10 text-base leading-6">
                  {t('guestMessagePublish')} {/* <-- Traducido */}
              </Text>
              <TouchableOpacity
                  className="bg-orange-500 py-4 px-10 rounded-full shadow-lg"
                  onPress={() => signOut(auth)}
              >
                  <Text className="text-white font-bold text-lg">{t('signIn')}</Text> {/* <-- Traducido */}
              </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }

  // --- VISTA PRINCIPAL ---
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5 pb-10">
        <Text className="text-3xl font-bold mb-6" style={{ color: textColor }}>{t('publishCarTitle')}</Text> {/* <-- Traducido */}

        {/* FOTO */}
        <TouchableOpacity 
          onPress={handlePickImage}
          className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6 justify-center items-center overflow-hidden border-2 border-dashed border-gray-400"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={40} color="gray" />
              <Text className="text-gray-500 mt-2">{t('tapToAddPhoto')}</Text> {/* <-- Traducido */}
            </View>
          )}
        </TouchableOpacity>

        {/* FORMULARIO */}
        <View className="space-y-4">
          
          {/* Modelo */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('modelLabel')}</Text> {/* <-- Traducido */}
            <TextInput
              placeholder={t('modelPlaceholder')} // <-- Traducido
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={setName}
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base"
            />
          </View>

          {/* Ciudad */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('cityLabel')}</Text> {/* <-- Traducido */}
            <TextInput
              placeholder={t('cityPlaceholder')} // <-- Traducido
              placeholderTextColor={placeholderColor}
              value={city}
              onChangeText={setCity}
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base"
            />
          </View>

          {/* Estilo y Pasajeros */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('styleLabel')}</Text> {/* <-- Traducido */}
              <TextInput
                placeholder={t('stylePlaceholder')} // <-- Traducido
                placeholderTextColor={placeholderColor}
                value={style}
                onChangeText={setStyle}
                style={{ backgroundColor: inputBg, color: textColor }}
                className="p-4 rounded-lg text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('passengersLabel')}</Text> {/* <-- Traducido */}
              <TextInput
                placeholder="4"
                placeholderTextColor={placeholderColor}
                value={passengers}
                onChangeText={setPassengers}
                keyboardType="numeric"
                style={{ backgroundColor: inputBg, color: textColor }}
                className="p-4 rounded-lg text-base"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            {/* Automático */}
            <TouchableOpacity
              className="flex-row items-center space-x-2"
              onPress={() => setTransmission('Auto')}
            >
              <View
                className={`w-6 h-6 rounded-md border-2 ${
                  transmission === 'Auto' ? 'bg-orange-500 border-orange-500' : 'border-gray-400'
                }`}
              />
              <Text
                className={`text-base font-semibold ${
                  transmission === 'Auto' ? 'text-orange-500' : 'text-gray-600'
                }`}
              >
                {t('automatic')} {/* <-- Traducido */}
              </Text>
            </TouchableOpacity>

            {/* Manual */}
            <TouchableOpacity
              className="flex-row items-center space-x-2"
              onPress={() => setTransmission('Manual')}
            >
              <View
                className={`w-6 h-6 rounded-md border-2 ${
                  transmission === 'Manual' ? 'bg-orange-500 border-orange-500' : 'border-gray-400'
                }`}
              />
              <Text
                className={`text-base font-semibold ${
                  transmission === 'Manual' ? 'text-orange-500' : 'text-gray-600'
                }`}
              >
                {t('manual')} {/* <-- Traducido */}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Precio */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('pricePerDayLabel')}</Text> {/* <-- Traducido */}
            <TextInput
              placeholder={t('pricePlaceholder')} // <-- Traducido
              placeholderTextColor={placeholderColor}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base font-bold text-orange-500"
            />
          </View>

          {/* Descripción */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">{t('descriptionLabel')}</Text> {/* <-- Traducido */}
            <TextInput
              placeholder={t('descriptionPlaceholder')} // <-- Traducido
              placeholderTextColor={placeholderColor}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: inputBg, color: textColor, height: 100, textAlignVertical: 'top' }}
              className="p-4 rounded-lg text-base"
            />
          </View>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          onPress={handlePublish}
          disabled={loading}
          className={`mt-8 py-4 rounded-xl items-center shadow-md ${loading ? 'bg-gray-400' : 'bg-orange-500'}`}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">{t('publishCarBtn')}</Text>} {/* <-- Traducido */}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}