import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Alert as NativeAlert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Firebase y Hooks ---
import { signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useColorScheme } from "react-native";
import { useThemeColor } from "../../../hooks/use-theme-color";
import { auth, db, storage } from "../../../utils/firebaseConfig";

// 1. IMPORTAR CONTEXTO
import { useLanguage } from "../../context/LanguageContext";

// Definimos el tipo de Auto
type Car = {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: string;
  style: string;
  rating?: number;
};

export default function MyCarsScreen() {
  const router = useRouter();
  
  // 2. USAR HOOK DE TRADUCCIÓN
  const { t } = useLanguage();
  
  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#F3F4F6';

  // --- Estados ---
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // 1. Cargar autos
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        setIsGuest(true);
        setLoading(false);
        return;
    }

    const q = query(
      collection(db, 'cars'),
      where('ownerId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCars: Car[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Car));
      setCars(fetchedCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Función para Logout
  const handleLoginRedirect = () => {
      signOut(auth);
  };

  const handleDeletePress = (car: Car) => {
    setSelectedCar(car);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedCar) return;
    setConfirmVisible(false);
    
    try {
      if (selectedCar.image && selectedCar.image.startsWith('http')) {
         try {
             const imageRef = ref(storage, selectedCar.image);
             await deleteObject(imageRef);
         } catch (err) {
             console.log("La imagen no existía o ya fue borrada");
         }
      }
      await deleteDoc(doc(db, 'cars', selectedCar.id));
      NativeAlert.alert(t('deletedTitle'), t('deletedMsg'));
    } catch (error) {
      console.error("Error eliminando auto:", error);
      NativeAlert.alert(t('error'), t('deleteErrorMsg'));
    }
  };

  const handleEditPress = (car: Car) => {
    router.push({
        pathname: '/drawer/autos/editcar',
        params: { carId: car.id }
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </SafeAreaView>
    );
  }

  // --- PANTALLA DE BLOQUEO (INVITADO) ---
  if (isGuest) {
      return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
            <View className="flex-1 justify-center items-center p-6">
                <MaterialIcons name="lock-outline" size={100} color={scheme === 'dark' ? '#555' : '#DDD'} />
                <Text className="text-2xl font-bold mt-6 text-center" style={{ color: textColor }}>
                    {t('accessRestricted')}
                </Text>
                <Text className="text-gray-500 mt-2 text-center mb-10 text-base leading-6">
                    {t('guestMessageCars')}
                </Text>
                <TouchableOpacity
                    className="bg-orange-500 py-4 px-10 rounded-full shadow-lg shadow-orange-200"
                    onPress={handleLoginRedirect}
                >
                    <Text className="text-white font-bold text-lg">{t('loginRegister')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      );
  }

  // --- PANTALLA NORMAL (USUARIO) ---
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <View className="p-4 flex-1">
        
        <View className="flex-row justify-between items-center mb-6 mt-2">
             <Text className="text-2xl font-bold" style={{ color: textColor }}>{t('myCarsTitle')}</Text>
             <TouchableOpacity 
                className="bg-orange-500 p-2 rounded-full"
                onPress={() => router.push('/drawer/publish/publishcar')}
             >
                 <Ionicons name="add" size={24} color="white" />
             </TouchableOpacity>
        </View>

        {cars.length === 0 ? (
            <View className="flex-1 justify-center items-center opacity-50">
                <MaterialIcons name="no-photography" size={60} color="gray" />
                <Text className="text-gray-500 mt-4 text-center text-base">{t('noCarsPublished')}</Text>
            </View>
        ) : (
            <ScrollView contentContainerClassName="pb-10">
            {cars.map((car) => (
                <View 
                    key={car.id} 
                    className="flex-row rounded-2xl p-3 mb-4 shadow-sm border"
                    style={{ backgroundColor: cardBg, borderColor }}
                >
                <Image 
                    source={{ uri: car.image }} 
                    className="w-24 h-20 rounded-xl mr-3 bg-gray-200"
                    resizeMode="cover" 
                />

                <View className="flex-1 justify-between py-1">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                            <Text className="font-bold text-base" numberOfLines={1} style={{ color: textColor }}>
                                {car.name}
                            </Text>
                            <Text className="text-xs text-gray-500" numberOfLines={1}>
                                {car.style} • ${car.price}/día
                            </Text>
                        </View>
                        
                        <View className="flex-row space-x-3">
                            <TouchableOpacity onPress={() => handleEditPress(car)}>
                                <MaterialIcons name="edit" size={22} color="#3b82f6" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeletePress(car)}>
                                <MaterialIcons name="delete" size={22} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text className="text-xs text-gray-400 mt-1" numberOfLines={2}>
                        {car.description || t('noDescription')}
                    </Text>

                    <View className="flex-row mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <MaterialIcons
                            key={i}
                            name={i < (car.rating || 5) ? "star" : "star-border"}
                            size={16}
                            color="#FF7A00"
                            />
                        ))}
                    </View>
                </View>
                </View>
            ))}
            </ScrollView>
        )}

        <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50 p-5">
            <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm items-center shadow-lg">
              <MaterialIcons name="warning" size={50} color="#FF7A00" />
              <Text className="text-lg font-bold text-center my-4 dark:text-white">
                {t('deleteCarTitle')}
              </Text>
              
              <Text className="text-sm text-gray-500 text-center mb-6 dark:text-gray-300">
                {t('deleteWarningPrefix')}{selectedCar?.name}{t('deleteWarningSuffix')}
              </Text>
              
              <View className="flex-row w-full space-x-4">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700"
                  onPress={() => setConfirmVisible(false)}
                >
                  <Text className="text-center font-bold text-gray-700 dark:text-gray-200">{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-red-500"
                  onPress={confirmDelete}
                >
                  <Text className="text-center font-bold text-white">{t('delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}