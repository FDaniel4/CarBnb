import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Image as RNImage, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();

  // 1. Obtenemos los parámetros
  const params = useLocalSearchParams() as {
    price: string;
    carName: string;
  };

  // Usamos el precio que nos pasaron, o '300' como fallback
  const priceToPay = params.price || '300';

  // Estado para el modal de éxito 
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lógica para el botón "Pay" 
  const handlePayment = () => {
    // Aquí iría la lógica de Stripe, PayPal, etc.
    setShowSuccessModal(true);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.navigate('/drawer/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-5 space-y-6">
          {/* ----- 1. Detalles de la Tarjeta ----- */}
          <View className="space-y-4">
            <View className="bg-orange-100 p-3 rounded-md">
              <Text className="text-orange-500 font-bold">CARD DETAILS</Text>
            </View>

            <TextInput
              placeholder="Card holder name"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-300 p-3 text-lg"
            />

            <TextInput
              placeholder="Card number"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-300 p-3 text-lg"
            />

            <View className="flex-row space-x-4">
              <TextInput
                placeholder="Exp. Date"
                placeholderTextColor="#9ca3af"
                className="border-b border-gray-300 p-3 text-lg flex-1"
              />
              <TextInput
                placeholder="CVV"
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                className="border-b border-gray-300 p-3 text-lg flex-1"
              />
            </View>
          </View>

          {/* ----- 2. Dirección de Facturación ----- */}
          <View className="space-y-4">
            {/* Título de sección "BILLING ADDRESS" */}
            <View className="bg-orange-100 p-3 rounded-md">
              <Text className="text-orange-500 font-bold">
                BILLING ADDRESS
              </Text>
            </View>

            <TextInput
              placeholder="Address"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-300 p-3 text-lg"
            />

            <TextInput
              placeholder="City"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-300 p-3 text-lg"
            />

            <View className="flex-row space-x-4">
              <TextInput
                placeholder="State"
                placeholderTextColor="#9ca3af"
                className="border-b border-gray-300 p-3 text-lg flex-1"
              />
              <TextInput
                placeholder="Zip Code"
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
                className="border-b border-gray-300 p-3 text-lg flex-1"
              />
            </View>

            <TextInput
              placeholder="Country"
              placeholderTextColor="#9ca3af"
              className="border-b border-gray-300 p-3 text-lg"
            />
          </View>

          {/* ----- 3. Botón de Pago ----- */}
          <View className="space-y-4 mt-4">
            <View className="bg-orange-100 p-4 rounded-lg">
              <TouchableOpacity
                className="bg-orange-500 rounded-lg p-3.5" 
                onPress={handlePayment}
              >
                <Text className="text-white text-xl font-bold text-center">
                  Pay ${priceToPay}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ----- 4. Otros Métodos de Pago ----- */}
            <View className="flex-row space-x-4 justify-center">
              <TouchableOpacity>
                <RNImage
                  source={{
                    uri: 'https://placehold.co/150x50/f40f02/ffffff?text=OXXO&font=raleway',
                  }}
                  alt="OXXO"
                  className="w-[150px] h-[50px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <RNImage
                  source={{
                    uri: 'https://placehold.co/150x50/0070ba/ffffff?text=PayPal&font=raleway',
                  }}
                  alt="PayPal"
                  className="w-[150px] h-[50px]"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

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
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#22c55e" 
                />
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
                Tu reservación para el {params.carName} ha sido confirmada.
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
