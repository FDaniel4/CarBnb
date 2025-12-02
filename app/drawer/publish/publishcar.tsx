import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase y Hooks ---
import { useThemeColor } from '@/hooks/use-theme-color';
import { auth, db, storage } from '@/utils/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useColorScheme } from 'react-native';

export default function PublishCarScreen() {
  const router = useRouter();
  
  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBg = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';
  const placeholderColor = '#9CA3AF';

  // --- Estados del Formulario ---
  const [name, setName] = useState('');
  const [style, setStyle] = useState(''); // Ej: "4 Puertas", "SUV"
  const [price, setPrice] = useState('');
  const [passengers, setPassengers] = useState('4');
  const [transmission, setTransmission] = useState<'Auto' | 'Manual'>('Auto');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  // --- 1. Seleccionar Imagen ---
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Formato rectangular para autos
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- 2. Subir y Publicar ---
  const handlePublish = async () => {
    // Validaciones
    if (!auth.currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión para publicar.');
      return;
    }
    if (!name || !price || !imageUri || !style) {
      Alert.alert('Faltan datos', 'Por favor completa los campos principales y añade una foto.');
      return;
    }

    setLoading(true);

    try {
      // A) Subir Imagen a Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Creamos un nombre único para la imagen
      const imageRef = ref(storage, `cars/${auth.currentUser.uid}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // B) Guardar datos en Firestore
      await addDoc(collection(db, 'cars'), {
        ownerId: auth.currentUser.uid, // Quién lo publicó
        name: name,
        style: style,
        price: price, // Guardamos como string o número
        passengers: parseInt(passengers),
        transmission: transmission,
        description: description,
        image: imageUrl, // La URL de la nube
        createdAt: serverTimestamp(),
      });

      Alert.alert('¡Éxito!', 'Tu auto ha sido publicado.', [
        { text: 'OK', onPress: () => router.push('/drawer/home') }
      ]);

      // Limpiar formulario (opcional)
      setName('');
      setPrice('');
      setImageUri(null);

    } catch (error) {
      console.error("Error publicando auto:", error);
      Alert.alert('Error', 'No se pudo publicar el auto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5 pb-10">
        
        <Text className="text-3xl font-bold mb-6" style={{ color: textColor }}>
          Publicar Auto
        </Text>

        {/* --- SELECCIONAR FOTO --- */}
        <TouchableOpacity 
          onPress={handlePickImage}
          className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6 justify-center items-center overflow-hidden border-2 border-dashed border-gray-400"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={40} color="gray" />
              <Text className="text-gray-500 mt-2">Toca para agregar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* --- FORMULARIO --- */}
        <View className="space-y-4">
          
          {/* Modelo */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">Modelo del Auto</Text>
            <TextInput
              placeholder="Ej. Kia Soul 2022"
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={setName}
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base"
            />
          </View>

          {/* Estilo y Pasajeros (Fila) */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">Estilo</Text>
              <TextInput
                placeholder="Ej. SUV"
                placeholderTextColor={placeholderColor}
                value={style}
                onChangeText={setStyle}
                style={{ backgroundColor: inputBg, color: textColor }}
                className="p-4 rounded-lg text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">Pasajeros</Text>
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

          {/* Transmisión (Selector) */}
          <View>
            <Text className="mb-2 font-bold text-gray-500 text-xs uppercase">Transmisión</Text>
            {/* Transmisión (Checkboxes) */}
<View className="mt-4">
  <Text className="mb-2 font-bold text-gray-500 text-xs uppercase">
    Tipo de Transmisión
  </Text>

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
        Automático
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
        Manual
      </Text>
    </TouchableOpacity>
  </View>
</View>

          </View>

          {/* Precio */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">Precio por Día ($)</Text>
            <TextInput
              placeholder="Ej. 500"
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
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">Descripción</Text>
            <TextInput
              placeholder="Detalles adicionales..."
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

        {/* --- BOTÓN PUBLICAR --- */}
        <TouchableOpacity
          onPress={handlePublish}
          disabled={loading}
          className={`mt-8 py-4 rounded-xl items-center shadow-md ${loading ? 'bg-gray-400' : 'bg-orange-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Publicar Auto
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}