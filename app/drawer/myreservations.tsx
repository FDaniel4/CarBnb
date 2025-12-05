import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Image as RNImage,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase y Hooks ---
import { signOut } from 'firebase/auth';
import {
    addDoc // <--- IMPORTANTE: Necesario para crear el correo en la colección 'mail'
    ,
    arrayRemove,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { useThemeColor } from '../../hooks/use-theme-color';
import { auth, db } from '../../utils/firebaseConfig';

// 1. IMPORTAR EL CONTEXTO DE IDIOMA
import { useLanguage } from '../context/LanguageContext';

// Tipo de dato
type Reservation = {
  id: string;
  carId: string;
  ownerId: string;
  carName: string;
  carImage: string;
  pricePaid: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  dates: string;
  startDate: string;
  endDate: string;
  ownerPhone?: string; 
  ownerEmail?: string;     // <--- Nuevo: Email del dueño para notificaciones
  ownerPushToken?: string; // <--- Nuevo: Token para Push Notifications
  createdAt: any;
};

// Helper para recalcular el rango de fechas
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

export default function MyReservationsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // --- Estados ---
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // --- Tema ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#F3F4F6';

  // 1. Cargar Reservas y buscar datos del dueño (Email/Push/Teléfono)
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
        setIsGuest(true);
        setLoading(false);
        return;
    }

    const q = query(
      collection(db, 'reservations'),
      where('renterId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const loadedReservations: Reservation[] = [];

      for (const resDoc of snapshot.docs) {
          const data = resDoc.data() as Reservation;
          let phoneToUse = data.ownerPhone;
          let emailToUse = data.ownerEmail;
          let tokenToUse = data.ownerPushToken;

          // Si falta información del dueño, la buscamos en 'users'
          if ((!phoneToUse || !emailToUse || !tokenToUse) && data.ownerId) {
              try {
                  const userDocRef = doc(db, 'users', data.ownerId);
                  const userSnap = await getDoc(userDocRef);
                  if (userSnap.exists()) {
                      const userData = userSnap.data();
                      if (!phoneToUse) phoneToUse = userData.phone;
                      if (!emailToUse) emailToUse = userData.email;
                      if (!tokenToUse) tokenToUse = userData.pushToken; // Asumiendo que guardaste el token aquí al login
                  }
              } catch (err) {
                  console.log("Error buscando dueño:", err);
              }
          }

          loadedReservations.push({
              id: resDoc.id,
              ...data,
              ownerPhone: phoneToUse,
              ownerEmail: emailToUse,
              ownerPushToken: tokenToUse
          });
      }
      
      setReservations(loadedReservations);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. Helper para enviar Push Notification (Expo) ---
  const sendPushNotification = async (expoPushToken: string, title: string, body: string) => {
    if (!expoPushToken) return;
    
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  // --- 3. Helper para enviar Email (Firebase Extension) ---
  const sendEmailNotification = async (toEmail: string, subject: string, htmlContent: string) => {
      if (!toEmail) return;
      
      // Escribimos en la colección 'mail' (Requiere extensión "Trigger Email" instalada en Firebase)
      await addDoc(collection(db, 'mail'), {
          to: toEmail,
          message: {
            subject: subject,
            html: htmlContent,
          }
      });
  };

  // --- 4. Lógica para WhatsApp ---
  const handleWhatsApp = (phone?: string, carName?: string) => {
    if (!phone) {
        Alert.alert(t('error') || "Error", "El propietario no tiene un teléfono registrado.");
        return;
    }
    
    const cleanPhone = phone.replace(/[^\d+]/g, ''); 
    const message = `Hola, tengo una reserva para tu auto ${carName || 'en CarBnb'}.`;
    const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            Alert.alert("Error", "WhatsApp no está instalado en este dispositivo.");
        }
    });
  };

  // --- LÓGICA DE CANCELACIÓN CON NOTIFICACIONES ---
  const handleCancel = (reservation: Reservation) => {
    Alert.alert(
        t('cancel') || "Cancelar Reserva",
        "¿Estás seguro de que deseas cancelar este viaje? Se liberarán las fechas.",
        [
            { text: t('no') || "No", style: "cancel" },
            { 
                text: t('yes') || "Sí, cancelar", 
                style: "destructive", 
                onPress: async () => {
                    if(!reservation.carId) return;
                    setCancellingId(reservation.id);
                    try {
                        let datesToFree: string[] = [];
                        if (reservation.startDate && reservation.endDate) {
                            datesToFree = getDatesInRange(reservation.startDate, reservation.endDate);
                        }

                        // A. Actualizar estado
                        const resRef = doc(db, 'reservations', reservation.id);
                        await updateDoc(resRef, { status: 'cancelled' });

                        // B. Liberar fechas
                        if (datesToFree.length > 0) {
                            const carRef = doc(db, 'cars', reservation.carId);
                            await updateDoc(carRef, {
                                blockedDates: arrayRemove(...datesToFree)
                            });
                        }

                        // C. NOTIFICACIONES AL DUEÑO
                        // 1. Push
                        if (reservation.ownerPushToken) {
                            await sendPushNotification(
                                reservation.ownerPushToken, 
                                "Reserva Cancelada", 
                                `El usuario ha cancelado la reserva de tu ${reservation.carName}.`
                            );
                        }

                        // 2. Email
                        if (reservation.ownerEmail) {
                            await sendEmailNotification(
                                reservation.ownerEmail,
                                `Cancelación de Reserva: ${reservation.carName}`,
                                `<p>Hola,</p><p>Te informamos que la reserva para tu auto <strong>${reservation.carName}</strong> ha sido cancelada por el usuario.</p><p>Las fechas han sido liberadas.</p>`
                            );
                        }
                        
                        Alert.alert(t('successTitle') || "Cancelada", "Tu reserva ha sido cancelada y el dueño notificado.");

                    } catch (error) {
                        console.error("Error cancelando:", error);
                        Alert.alert(t('error') || "Error", "No se pudo cancelar la reserva.");
                    } finally {
                        setCancellingId(null);
                    }
                } 
            }
        ]
    );
  };

  const getFixedImageUrl = (url: string) => {
    let imageUrl = 'https://placehold.co/200x200/png?text=Car';
    if (url && url !== '') {
        imageUrl = url;
        if (imageUrl.includes('firebasestorage.googleapis.com')) {
            const parts = imageUrl.split('?');
            const baseUrl = parts[0];
            const queryParams = parts.length > 1 ? '?' + parts[1] : '';
            const oIndex = baseUrl.indexOf('/o/');
            if (oIndex !== -1) {
                const prefix = baseUrl.substring(0, oIndex + 3);
                const path = baseUrl.substring(oIndex + 3);
                const encodedPath = path.replace(/\//g, '%2F');
                imageUrl = `${prefix}${encodedPath}${queryParams}`;
            }
        }
        imageUrl = imageUrl.replace(/ /g, '%20');
    }
    return imageUrl;
  };

  // --- UI Helpers (Status Colors, Labels) ---
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 dark:bg-green-900';
          case 'completed': return 'bg-blue-100 dark:bg-blue-900';
          case 'cancelled': return 'bg-red-100 dark:bg-red-900';
          default: return 'bg-gray-100 dark:bg-gray-800';
      }
  };

  const getStatusTextColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'text-green-700 dark:text-green-300';
          case 'completed': return 'text-blue-700 dark:text-blue-300';
          case 'cancelled': return 'text-red-700 dark:text-red-300';
          default: return 'text-gray-700 dark:text-gray-300';
      }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
        case 'confirmed': return t('confirmed');
        case 'completed': return t('completed');
        case 'cancelled': return t('cancelled');
        default: return status;
    }
  };

  if (loading) {
    return (
        <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
            <ActivityIndicator size="large" color="#F97A4B" />
        </SafeAreaView>
    );
  }

  if (isGuest) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
          <View className="flex-1 justify-center items-center p-6">
              <MaterialCommunityIcons name="lock-alert-outline" size={80} color={scheme === 'dark' ? '#555' : '#DDD'} />
              <Text className="text-2xl font-bold mt-6 text-center" style={{ color: textColor }}>{t('accessRestricted')}</Text>
              <Text className="text-gray-500 mt-2 text-center mb-10 text-base leading-6">{t('guestMessageCars')}</Text>
              <TouchableOpacity className="bg-orange-500 py-4 px-10 rounded-full shadow-lg" onPress={() => signOut(auth)}>
                  <Text className="text-white font-bold text-lg">{t('signIn')}</Text>
              </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView 
        contentContainerClassName="p-5 pb-20"
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {}} tintColor="#F97A4B" />
        }
      >
        <View className="flex-row items-center space-x-3 mb-6">
            <MaterialCommunityIcons name="clipboard-check-outline" size={32} color="#F97A4B" />
            <Text className="text-3xl font-bold" style={{ color: textColor }}>{t('myReservations')}</Text>
        </View>

        {reservations.length === 0 ? (
          <View className="items-center mt-20 opacity-50">
             <MaterialCommunityIcons name="car-key" size={80} color="gray" />
             <Text className="text-gray-500 mt-4 text-lg text-center">{t('noReservations')}</Text>
             <TouchableOpacity className="mt-4 bg-orange-100 px-6 py-3 rounded-full" onPress={() => router.push('/drawer/home')}>
                 <Text className="text-orange-500 font-bold">{t('exploreCars')}</Text>
             </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
              {reservations.map((item) => {
                const imageUrl = getFixedImageUrl(item.carImage);

                return (
                  <View 
                      key={item.id} 
                      className="flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border"
                      style={{ backgroundColor: cardBg, borderColor }}
                  >
                      {/* Imagen */}
                      <View className="w-32 h-full bg-gray-200">
                          <RNImage 
                              source={{ uri: imageUrl }} 
                              className="w-full h-full"
                              resizeMode="cover"
                              style={{ width: '100%', height: 140 }} 
                          />
                      </View>

                      {/* Info y Acciones */}
                      <View className="flex-1 p-3 justify-between min-h-[140px]">
                          <View>
                              <View className="flex-row justify-between items-start mb-1">
                                  <Text className="font-bold text-base flex-1 mr-2" numberOfLines={1} style={{ color: textColor }}>
                                      {item.carName}
                                  </Text>
                                  <View className={`px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
                                      <Text className={`text-[10px] uppercase font-bold ${getStatusTextColor(item.status)}`}>
                                          {getStatusLabel(item.status)}
                                      </Text>
                                  </View>
                              </View>
                              <View className="flex-row items-center mb-2">
                                <Ionicons name="calendar-outline" size={12} color="gray" style={{marginRight:4}} />
                                <Text className="text-xs text-gray-500 flex-1">{item.dates}</Text>
                              </View>
                          </View>

                          <View>
                              <Text className="text-xs text-gray-400 uppercase">{t('totalPaid')}</Text>
                              <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-bold text-orange-500">${item.pricePaid}</Text>
                                
                                <View className="flex-row items-center space-x-2">
                                    {/* Botón WhatsApp */}
                                    {item.status === 'confirmed' && (
                                        <TouchableOpacity
                                            onPress={() => handleWhatsApp(item.ownerPhone, item.carName)}
                                            className="bg-green-50 dark:bg-green-900/30 p-2 rounded-full border border-green-100 dark:border-green-900"
                                        >
                                            <Ionicons name="logo-whatsapp" size={20} color="#22c55e" />
                                        </TouchableOpacity>
                                    )}

                                    {/* Botón Cancelar/Flecha */}
                                    {item.status === 'confirmed' ? (
                                        <TouchableOpacity 
                                            onPress={() => handleCancel(item)}
                                            disabled={cancellingId === item.id}
                                            className="bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-900"
                                        >
                                            {cancellingId === item.id ? (
                                                <ActivityIndicator size="small" color="red" />
                                            ) : (
                                                <Text className="text-xs font-bold text-red-500 dark:text-red-400">
                                                    {t('cancel') || 'Cancelar'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                            <Ionicons name="chevron-forward" size={16} color="gray" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                              </View>
                          </View>
                      </View>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}