import {
    Box,
    Button,
    ButtonText,
    CheckCircleIcon,
    CloseIcon,
    Heading,
    HStack,
    Icon,
    Image,
    Input,
    InputField,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Pressable,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const router = useRouter();
  
  // 1. Obtenemos los parámetros que 'carDetail.tsx' nos envió
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
    // Por ahora, solo mostramos el modal de éxito.
    setShowSuccessModal(true);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    // Usamos 'navigate' para limpiar el historial y volver a home
    router.navigate('/drawer/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <VStack p="$5" space="lg">
          {/* ----- 1. Detalles de la Tarjeta ----- */}
          <VStack space="md">
            {/* Título de sección "CARD DETAILS" */}
            <Box bg="$orange100" p="$3" borderRadius="$md">
              <Text color="$orange500" fontWeight="$bold">
                CARD DETAILS
              </Text>
            </Box>

            <Input variant="underlined" size="lg">
              <InputField placeholder="Card holder name" />
            </Input>

            <Input variant="underlined" size="lg">
              <InputField placeholder="Card number" keyboardType="numeric" />
            </Input>

            <HStack space="md">
              <Input variant="underlined" size="lg" flex={1}>
                <InputField placeholder="Exp. Date" />
              </Input>
              <Input variant="underlined" size="lg" flex={1}>
                <InputField placeholder="CVV" keyboardType="numeric" />
              </Input>
            </HStack>
          </VStack>

          {/* ----- 2. Dirección de Facturación ----- */}
          <VStack space="md">
            {/* Título de sección "BILLING ADDRESS" */}
            <Box bg="$orange100" p="$3" borderRadius="$md">
              <Text color="$orange500" fontWeight="$bold">
                BILLING ADDRESS
              </Text>
            </Box>

            <Input variant="underlined" size="lg">
              <InputField placeholder="Address" />
            </Input>

            <Input variant="underlined" size="lg">
              <InputField placeholder="City" />
            </Input>

            <HStack space="md">
              <Input variant="underlined" size="lg" flex={1}>
                <InputField placeholder="State" />
              </Input>
              <Input variant="underlined" size="lg" flex={1}>
                <InputField placeholder="Zip Code" keyboardType="numeric" />
              </Input>
            </HStack>

            <Input variant="underlined" size="lg">
              <InputField placeholder="Country" />
            </Input>
          </VStack>

          {/* ----- 3. Botón de Pago ----- */}
          <VStack space="md" mt="$4">
            <Box bg="$orange100" p="$4" borderRadius="$lg">
              <Button
                bg="$orange500"
                borderRadius="$lg"
                size="lg"
                onPress={handlePayment}
              >
                <ButtonText fontSize="$xl" fontWeight="$bold">
                  Pay ${priceToPay}
                </ButtonText>
              </Button>
            </Box>

            {/* ----- 4. Otros Métodos de Pago ----- */}
            <HStack space="md" justifyContent="center">
              {/* Reemplaza estos 'uri' con tus imágenes en assets/images */}
              <Pressable>
                <Image
                  source={{
                    uri: 'https://placehold.co/150x50/f40f02/ffffff?text=OXXO&font=raleway',
                  }}
                  alt="OXXO"
                  style={styles.paymentLogo}
                />
              </Pressable>
              <Pressable>
                <Image
                  source={{
                    uri: 'https://placehold.co/150x50/0070ba/ffffff?text=PayPal&font=raleway',
                  }}
                  alt="PayPal"
                  style={styles.paymentLogo}
                />
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>

      {/* ----- Modal de Pago Exitoso ----- */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoHome}
      >
        <ModalBackdrop />
        <ModalContent borderRadius="$lg">
          <ModalHeader>
            <HStack space="sm" alignItems="center">
              <Icon as={CheckCircleIcon} color="$success500" size="lg" />
              <Heading size="lg">¡Pago Exitoso!</Heading>
            </HStack>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text>
                Tu reservación para el {params.carName} ha sido confirmada.
              </Text>
              <Button bg="$orange500" onPress={handleGoHome}>
                <ButtonText>Volver al Inicio</ButtonText>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  paymentLogo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
});