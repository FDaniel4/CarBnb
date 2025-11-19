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
  useColorScheme as useRNScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Hooks y Firebase ---
import { useThemeColor } from '@/hooks/use-theme-color';
import { auth, db, storage } from '@/utils/firebaseConfig';
import { onAuthStateChanged, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// Tipo de datos del usuario
type UserData = {
  fullName: string;
  email: string;
  profilePictureUrl: string;
  phone?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  
  // --- Estados ---
  const [userData, setUserData] = useState<UserData | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true); 
  const [uploadingImage, setUploadingImage] = useState(false); 
  const [savingPhone, setSavingPhone] = useState(false); 
  
  // Estado para saber si es invitado
  const [isGuest, setIsGuest] = useState(true);

  // --- Tema ---
  const scheme = useRNScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackground = scheme === 'dark' ? '#1C1C1E' : '#F9FAFB'; 
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E7EB';

  const requireLogin = () => {
    Alert.alert(
      "Opps!",
      "Necesitas una cuenta para realizar esta acción.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Ir a Login", 
          onPress: () => {
            signOut(auth); 
          } 
        }
      ]
    );
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Verificamos si es anónimo
        if (user.isAnonymous) {
          setIsGuest(true);
          setLoading(false);
          // No intentamos cargar datos de Firestore para invitados ya que no se tendria que poder y para que no rompan la app
          return;
        }

        setIsGuest(false);
        // Si es usuario real, cargamos Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUserData(data);
            if (!phone) setPhone(data.phone || '');
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
        // Si no hay usuario, _layout redirige, pero por si acaso:
        setIsGuest(true);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handlePickImage = async () => {
    if (isGuest) return requireLogin(); // <--- Restricción

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Se requiere acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri && auth.currentUser) {
        setUploadingImage(true);
        const uri = result.assets[0].uri;
        const userId = auth.currentUser.uid;

        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profile_pictures/${userId}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'users', userId), {
          profilePictureUrl: downloadURL,
        });

        Alert.alert('¡Listo!', 'Foto de perfil actualizada.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePhone = async () => {
    if (isGuest) return requireLogin(); // <--- Restricción
    if (!auth.currentUser) return;

    setSavingPhone(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), { phone }, { merge: true });
      Alert.alert('Guardado', 'Número de teléfono actualizado.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el teléfono.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleChangePassword = () => {
    if (isGuest) return requireLogin(); // <--- Restricción

    if (userData?.email) {
      sendPasswordResetEmail(auth, userData.email)
        .then(() => Alert.alert('Enviado', 'Revisa tu correo para cambiar la contraseña.'))
        .catch(() => Alert.alert('Error', 'No se pudo enviar el correo.'));
    }
  };

  const handleMyCars = () => {
    if (isGuest) return requireLogin(); 
    router.push('/drawer/autos/mycars');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
        <ActivityIndicator size="large" color="#F97A4B" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="flex-grow items-center p-5">
        
        {/* --- FOTO DE PERFIL --- */}
        <View className="mt-8 mb-5 relative">
          <TouchableOpacity onPress={handlePickImage} disabled={uploadingImage}>
            <Image
              source={{
                uri: userData?.profilePictureUrl || 'https://placehold.co/150x150/orange/white?text=User',
              }}
              className="w-32 h-32 rounded-full border-4 border-gray-100"
              resizeMode="cover"
            />
            {/* Icono de cámara (Botón flotante) */}
            <View className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full border-2 border-white">
              {uploadingImage ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name={isGuest ? "lock-closed" : "camera"} size={20} color="white" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* --- INFORMACIÓN PRINCIPAL --- */}
        <View className="items-center mb-8 w-full">
          <View className="flex-row items-center justify-center mb-1">
            <Text className="text-2xl font-bold text-center" style={{ color: textColor }}>
              {isGuest ? 'Invitado' : (userData?.fullName || 'Usuario')}
            </Text>
            {!isGuest && (
              <Ionicons name="checkmark-circle" size={20} color="#3b82f6" style={{ marginLeft: 6 }} />
            )}
          </View>
          
          <Text className="text-base text-gray-500 mb-4">
            {isGuest ? 'Regístrate para ver tus datos' : userData?.email}
          </Text>

          <View 
            className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-full px-4 border w-full max-w-xs h-12" 
            style={{ borderColor }}
          >
            <Ionicons name="call-outline" size={18} color="gray" className="mr-3" />
            
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={isGuest ? "No disponible" : "Agrega tu teléfono"}
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              editable={!isGuest} // Deshabilitado si es invitado
              className="flex-1 text-sm h-full" 
              style={{ color: isGuest ? '#9ca3af' : textColor }}
            />
            
            {/* Botón guardar (Solo visible si NO es invitado) */}
            {!isGuest && (
              <TouchableOpacity onPress={handleSavePhone} disabled={savingPhone}>
                <Text className="text-xs font-bold text-orange-500 ml-2">
                  {savingPhone ? '...' : 'GUARDAR'}
                </Text>
              </TouchableOpacity>
            )}
             {/* Candado (Solo visible si ES invitado) */}
             {isGuest && (
               <Ionicons name="lock-closed-outline" size={14} color="#9ca3af" />
             )}
          </View>
        </View>

        {/* --- MÉTRICAS (Diseño limpio) --- */}
        <View className="flex-row w-full justify-around mb-10">
          <View className="items-center flex-1 p-4 rounded-xl mr-2" style={{ backgroundColor: cardBackground }}>
            <Text className="text-xl font-bold" style={{ color: textColor }}>0</Text>
            <Text className="text-xs text-gray-500 uppercase mt-1">Autos</Text>
          </View>
          <View className="items-center flex-1 p-4 rounded-xl ml-2" style={{ backgroundColor: cardBackground }}>
            <Text className="text-xl font-bold text-orange-500">0</Text>
            <Text className="text-xs text-gray-500 uppercase mt-1">Reservas</Text>
          </View>
        </View>

        {/* --- BOTONES DE ACCIÓN (Restringidos) --- */}
        <View className="w-full space-y-4 ">
          {/* Botón Naranja (Acción Principal) */}
          <TouchableOpacity
            className={`py-4 rounded-xl items-center shadow-sm mb-1 ${isGuest ? 'bg-gray-400' : 'bg-orange-500'}`}
            onPress={() => router.push('/drawer/profile/changePassword')}
          >
            <Text className="text-white text-base font-bold">
              {isGuest ? 'Iniciar Sesión' : 'Cambiar Contraseña'}
            </Text>
          </TouchableOpacity>

          {/* Botón Secundario (Mis Autos) */}
          <TouchableOpacity
            className="py-4 rounded-xl items-center border"
            style={{ borderColor: isGuest ? 'gray' : 'orange' }}
            onPress={handleMyCars}
          >
            <Text className={`text-base font-bold ${isGuest ? 'text-gray-500' : 'text-orange-500'}`}>
              Ver Mis Autos
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}