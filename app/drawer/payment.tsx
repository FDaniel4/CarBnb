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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- 1. Importar Hook de Stripe ---
import { useStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Hook de Stripe
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams() as {
    price: string;
    carName: string;
  };

  const priceToPay = params.price || '300';
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- 2. Preparar la hoja de pago (Payment Sheet) ---
  const initializePaymentSheet = async () => {
    // ! IMPORTANTE: Como es un proyecto escolar sin backend, 
    // esto fallará al intentar procesar el pago real porque necesitamos un 'client_secret'
    // que solo un servidor seguro puede generar.
    // Usamos un string falso para inicializar la UI.
    
    const { error } = await initPaymentSheet({
      merchantDisplayName: "CarBnb Inc.",
      paymentIntentClientSecret: 'pi_mock_secret_para_demo', // Falso, para demo
      defaultBillingDetails: {
        name: 'Usuario de Prueba',
      }
    });
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  // --- 3. Lógica de Pago ---
  const handlePayment = async () => {
    setLoading(true);

    // A) INTENTO CON STRIPE (Modo Demo)
    // Intentamos abrir la hoja de pago. 
    const { error } = await presentPaymentSheet();

    if (error) {
        // Si falla (que fallará por falta de servidor), mostramos alerta educativa
        // y simulamos el éxito.
        Alert.alert(
            "Modo Escolar / Demo",
            "En una app real, aquí se abriría la pasarela segura de Stripe. Como no tenemos un servidor backend conectado, simularemos un pago exitoso.",
            [
                { 
                    text: "Entendido", 
                    onPress: () => setShowSuccessModal(true) // <-- Éxito simulado
                }
            ]
        );
    } else {
      // Si el pago fuera real y exitoso
      setShowSuccessModal(true);
    }
    setLoading(false);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.navigate('/drawer/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5 space-y-6">
          
          {/* Resumen de Compra */}
          <View className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
             <Text className="text-gray-500 text-sm uppercase font-bold mb-2">Resumen de Reserva</Text>
             <View className="flex-row justify-between mb-1">
                <Text className="text-lg font-bold text-gray-800">{params.carName || 'Auto'}</Text>
                <Text className="text-lg font-bold text-orange-500">${priceToPay}</Text>
             </View>
             <Text className="text-gray-400 text-xs">Total a pagar ahora</Text>
          </View>

          {/* ----- DETALLES DE PAGO (Ahora manejado por Stripe) ----- */}
          <View className="space-y-4">
            <View className="bg-blue-50 p-4 rounded-md border border-blue-100 flex-row items-center">
              <Ionicons name="lock-closed" size={20} color="#3b82f6" style={{marginRight: 10}} />
              <Text className="text-blue-700 flex-1 text-sm">
                Los pagos son procesados de forma segura por Stripe. No almacenamos tus datos bancarios.
              </Text>
            </View>
          </View>

          {/* ----- Botón de Pago ----- */}
          <View className="space-y-4 mt-4">
            <TouchableOpacity
                className={`rounded-lg p-4 ${loading ? 'bg-gray-400' : 'bg-orange-500'}`}
                onPress={handlePayment}
                disabled={loading}
              >
                <Text className="text-white text-xl font-bold text-center">
                  {loading ? 'Procesando...' : `Pagar $${priceToPay} con Stripe`}
                </Text>
            </TouchableOpacity>

            {/* Otros Métodos (Visuales) */}
            <View className="flex-row space-x-4 justify-center mt-4">
              <TouchableOpacity>
                <RNImage
                  source={{ uri: 'https://placehold.co/150x50/f40f02/ffffff?text=OXXO&font=raleway' }}
                  accessibilityLabel="OXXO"
                  className="w-[100px] h-[40px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <RNImage
                  source={{ uri: 'https://placehold.co/150x50/0070ba/ffffff?text=PayPal&font=raleway' }}
                  accessibilityLabel="PayPal"
                  className="w-[100px] h-[40px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Éxito */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={handleGoHome}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 p-5"
          onPress={handleGoHome}
        >
          <Pressable className="bg-white rounded-lg w-full max-w-sm">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                <Text className="text-lg font-bold text-gray-800">
                  ¡Pago Exitoso!
                </Text>
              </View>
              <TouchableOpacity onPress={handleGoHome}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View className="p-4 space-y-4">
              <Text className="text-base text-gray-700">
                Tu reservación para el {params.carName} ha sido confirmada correctamente.
              </Text>
              <TouchableOpacity
                className="bg-orange-500 rounded-lg p-3"
                onPress={handleGoHome}
              >
                <Text className="text-white text-center font-bold">
                  Volver al Inicio
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}