import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Image as RNImage,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';

// --- Firebase ---
import { auth, db } from '@/utils/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function PaymentScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Recibir parámetros (incluyendo la imagen)
  const params = useLocalSearchParams() as {
    carId: string;
    carName: string;
    price: string;
    ownerId: string;
    image: string; // Recibimos la URL de la imagen
  };

  const priceToPay = params.price || '0';

  // 2. Inicializar Stripe (Modo Demo)
  useEffect(() => {
    initPaymentSheet({
      merchantDisplayName: "CarBnb Inc.",
      paymentIntentClientSecret: 'pi_mock_secret_demo', // Falso, solo para UI
      defaultBillingDetails: { name: 'Usuario Demo' }
    });
  }, []);

  // 3. Guardar Reserva en Firestore
  const createReservation = async () => {
    try {
      if (!auth.currentUser) return;

      await addDoc(collection(db, 'reservations'), {
        carId: params.carId,
        carName: params.carName,
        carImage: params.image || '', // Guardamos la foto para mostrarla en 'Mis Reservas'
        renterId: auth.currentUser.uid,
        ownerId: params.ownerId,
        pricePaid: priceToPay,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        dates: 'Fechas pendientes' // Aquí podrías pasar las fechas reales si las tuvieras
      });
      
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error creando reserva:", error);
      Alert.alert("Error", "El pago pasó pero falló el registro.");
    }
  };

  // 4. Manejar el Pago
  const handlePayment = async () => {
    setLoading(true);
    
    // Intentamos abrir la hoja de pago.
    // En modo demo (sin backend), esto fallará o no completará el proceso real.
    const { error } = await presentPaymentSheet();

    if (error) {
        // Si falla (esperado en demo), mostramos alerta y procedemos
        Alert.alert(
            "Modo Demo / Escolar",
            "La pasarela de Stripe requiere un servidor backend. Simularemos que el pago fue exitoso.",
            [{ text: "Continuar", onPress: () => createReservation() }]
        );
    } else {
      // Si el pago fuera real
      createReservation();
    }
    setLoading(false);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.navigate('/drawer/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="p-5">
        
        <Text className="text-2xl font-bold mb-6 text-gray-800">Confirmar y Pagar</Text>
        
        {/* --- Resumen de la Orden --- */}
        <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 shadow-sm">
           <View className="flex-row items-center mb-4">
              {/* Foto del Auto */}
              {params.image ? (
                  <RNImage 
                    source={{ uri: params.image }} 
                    className="w-20 h-16 rounded-lg mr-4 bg-gray-200" 
                    resizeMode="cover" 
                  />
              ) : (
                  <View className="w-20 h-16 rounded-lg mr-4 bg-gray-200 items-center justify-center">
                      <Ionicons name="car" size={24} color="gray" />
                  </View>
              )}
              
              <View className="flex-1">
                  <Text className="text-gray-500 text-xs uppercase font-bold">Vehículo</Text>
                  <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                      {params.carName || 'Auto seleccionado'}
                  </Text>
              </View>
           </View>

           <View className="h-px bg-gray-200 mb-3" />
           
           <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Total a pagar</Text>
              <Text className="text-2xl font-bold text-orange-500">${priceToPay}</Text>
           </View>
        </View>

        {/* --- Aviso de Seguridad --- */}
        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row items-center mb-8">
            <Ionicons name="shield-checkmark" size={24} color="#3b82f6" style={{marginRight: 12}} />
            <Text className="text-blue-700 flex-1 text-sm leading-5">
            Pagos procesados de forma segura por Stripe. No almacenamos tu información financiera.
            </Text>
        </View>

        {/* --- Botón de Pago --- */}
        <TouchableOpacity
            className={`bg-black py-4 rounded-xl items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
            onPress={handlePayment}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <View className="flex-row items-center">
                    <Ionicons name="card" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text className="text-white font-bold text-lg">Pagar Ahora</Text>
                </View>
            )}
        </TouchableOpacity>

      </ScrollView>

      {/* --- Modal de Éxito --- */}
      <Modal transparent visible={showSuccessModal} animationType="fade" onRequestClose={handleGoHome}>
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
           <View className="bg-white p-8 rounded-3xl w-full items-center shadow-2xl">
              <View className="bg-green-100 p-4 rounded-full mb-4">
                  <Ionicons name="checkmark" size={40} color="#22c55e" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Exitosa!</Text>
              <Text className="text-gray-500 text-center mb-8 text-base">
                Tu vehículo ha sido reservado correctamente. Puedes ver los detalles en "Mis Reservaciones".
              </Text>
              
              <TouchableOpacity 
                onPress={handleGoHome} 
                className="bg-orange-500 py-4 px-10 rounded-full w-full"
              >
                 <Text className="text-white font-bold text-center text-lg">Volver al Inicio</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}