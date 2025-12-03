import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Firebase ---
// Agregamos getDoc para buscar al dueño y addDoc para notificaciones
import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';

// --- Hooks de Tema ---
import { useThemeColor } from '../../hooks/use-theme-color';

// --- Contexto de Idioma ---
import { useLanguage } from '../context/LanguageContext';

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

const calculateDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
};

export default function PaymentScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useLanguage();

  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBg = scheme === 'dark' ? '#1C1C1E' : '#F9FAFB'; 
  const borderColor = scheme === 'dark' ? '#3A3A3C' : '#E5E7EB'; 
  const subTextColor = scheme === 'dark' ? '#9CA3AF' : '#4B5563'; 
  const securityBg = scheme === 'dark' ? 'rgba(30, 58, 138, 0.3)' : '#EFF6FF';
  const securityBorder = scheme === 'dark' ? '#1E3A8A' : '#DBEAFE';
  const securityText = scheme === 'dark' ? '#93C5FD' : '#1D4ED8';

  const params = useLocalSearchParams() as {
    carId: string;
    carName: string;
    price: string;
    ownerId: string;
    image: string; 
    startDate?: string;
    endDate?: string;
  };

  const startDate = params.startDate || new Date().toISOString().split('T')[0];
  const endDate = params.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const days = calculateDays(startDate, endDate);
  const pricePerDay = parseFloat(params.price || '300');
  const totalToPay = (pricePerDay * days).toFixed(2);

  let imageUrl = 'https://placehold.co/200x200/png?text=Car';
  if (params.image && params.image !== '') {
      imageUrl = params.image;
      if (imageUrl.includes('firebasestorage') && imageUrl.includes('/o/')) {
          const parts = imageUrl.split('/o/');
          if (parts.length > 1) {
              const [path, qs] = parts[1].split('?');
              imageUrl = `${parts[0]}/o/${path.replace(/\//g, '%2F')}?${qs}`;
          }
      }
      imageUrl = imageUrl.replace(/ /g, '%20');
  }

  useEffect(() => {
    initPaymentSheet({
      merchantDisplayName: "CarBnb Inc.",
      paymentIntentClientSecret: 'pi_mock_secret_demo', 
      defaultBillingDetails: { name: t('demoUser') || 'Usuario Demo' }
    });
  }, []);

  // --- Funciones de Notificación ---
  const sendPushNotification = async (token: string, title: string, body: string) => {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: token, title, body, sound: 'default' }),
      });
  };

  const createReservation = async () => {
    try {
      if (!auth.currentUser) return;

      // 1. Crear la reserva
      await addDoc(collection(db, 'reservations'), {
        carId: params.carId,
        carName: params.carName,
        carImage: params.image || '', 
        renterId: auth.currentUser.uid,
        ownerId: params.ownerId,
        pricePaid: totalToPay,
        pricePerDay: pricePerDay,
        daysTotal: days,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        startDate: startDate,
        endDate: endDate,
        dates: `${startDate} - ${endDate}`
      });

      // 2. Bloquear fechas
      const daysToBlock = getDatesInRange(startDate, endDate);
      await updateDoc(doc(db, 'cars', params.carId), {
        blockedDates: arrayUnion(...daysToBlock)
      });

      // 3. ENVIAR NOTIFICACIONES AL DUEÑO
      const ownerSnap = await getDoc(doc(db, 'users', params.ownerId));
      if (ownerSnap.exists()) {
          const ownerData = ownerSnap.data();
          
          // A) Push Notification
          if (ownerData.pushToken) {
              await sendPushNotification(
                  ownerData.pushToken,
                  "¡Nueva Reserva! 🚗",
                  `Han reservado tu ${params.carName} del ${startDate} al ${endDate}.`
              );
          }

          // B) Email (Vía extensión Firebase "Trigger Email")
          if (ownerData.email) {
              await addDoc(collection(db, 'mail'), {
                  to: ownerData.email,
                  message: {
                      subject: `Nueva Reserva: ${params.carName}`,
                      html: `
                        <h1>¡Felicidades! Tienes una nueva reserva</h1>
                        <p>Tu auto <strong>${params.carName}</strong> ha sido reservado.</p>
                        <ul>
                            <li><strong>Fechas:</strong> ${startDate} al ${endDate}</li>
                            <li><strong>Total:</strong> $${totalToPay}</li>
                        </ul>
                        <p>Ingresa a la app para ver más detalles.</p>
                      `
                  }
              });
          }
      }
      
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error creando reserva:", error);
      Alert.alert(t('paymentErrorTitle'), t('paymentErrorMsg'));
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    const { error } = await presentPaymentSheet();

    if (error) {
        Alert.alert(
            t('demoModeTitle'),
            t('demoModeMsg'),
            [
                { text: t('cancel'), style: 'cancel' },
                { text: t('continue'), onPress: () => createReservation() }
            ]
        );
    } else {
      createReservation();
    }
    setLoading(false);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.navigate('/drawer/home');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView contentContainerClassName="p-5">
        
        <Text className="text-2xl font-bold mb-6" style={{ color: textColor }}>
            {t('confirmPayTitle')}
        </Text>
        
        <View className="p-4 rounded-2xl border mb-6 shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
           <View className="flex-row items-center mb-4">
              <View className="w-20 h-16 rounded-lg mr-4 bg-gray-200 overflow-hidden">
                  <RNImage source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="flex-1">
                  <Text className="text-xs uppercase font-bold" style={{ color: subTextColor }}>{t('vehicleLabel')}</Text>
                  <Text className="text-lg font-bold" numberOfLines={1} style={{ color: textColor }}>{params.carName || t('selectedCarDefault')}</Text>
                  <Text className="text-xs mt-1" style={{ color: subTextColor }}>{startDate} ➔ {endDate}</Text>
              </View>
           </View>
           <View className="h-px mb-3" style={{ backgroundColor: borderColor }} />
           <View className="flex-row justify-between items-center mb-2">
              <Text style={{ color: subTextColor }}>${pricePerDay} x {days} {days === 1 ? 'día' : 'días'}</Text>
              <Text style={{ color: textColor }}>${totalToPay}</Text>
           </View>
           <View className="h-px mb-3 opacity-50" style={{ backgroundColor: borderColor }} />
           <View className="flex-row justify-between items-center">
              <Text style={{ color: subTextColor, fontWeight: 'bold' }}>{t('totalToPay')}</Text>
              <Text className="text-2xl font-bold text-orange-500">${totalToPay}</Text>
           </View>
        </View>

        <View className="p-4 rounded-xl border flex-row items-center mb-8" style={{ backgroundColor: securityBg, borderColor: securityBorder }}>
            <Ionicons name="shield-checkmark" size={24} color={scheme === 'dark' ? '#60A5FA' : '#3b82f6'} style={{marginRight: 12}} />
            <Text className="flex-1 text-sm leading-5" style={{ color: securityText }}>{t('stripeSecurityMsg')}</Text>
        </View>

        <TouchableOpacity
            className={`py-4 rounded-xl items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
            style={{ backgroundColor: scheme === 'dark' ? '#F97A4B' : '#000' }} 
            onPress={handlePayment}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <View className="flex-row items-center">
                    <Ionicons name="card" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text className="text-white font-bold text-lg">{t('payNowBtn')} (${totalToPay})</Text>
                </View>
            )}
        </TouchableOpacity>

      </ScrollView>

      <Modal transparent visible={showSuccessModal} animationType="fade" onRequestClose={handleGoHome}>
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
           <View className="p-8 rounded-3xl w-full items-center shadow-2xl" style={{ backgroundColor: scheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }}>
              <View className="bg-green-100 p-4 rounded-full mb-4">
                  <Ionicons name="checkmark" size={40} color="#22c55e" />
              </View>
              <Text className="text-2xl font-bold mb-2" style={{ color: textColor }}>{t('reservationSuccessTitle')}</Text>
              <Text className="text-center mb-8 text-base" style={{ color: subTextColor }}>{t('reservationSuccessMsg')}</Text>
              <TouchableOpacity onPress={handleGoHome} className="bg-orange-500 py-4 px-10 rounded-full w-full">
                  <Text className="text-white font-bold text-center text-lg">{t('backToHome')}</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}