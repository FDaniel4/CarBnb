import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// 1. IMPORTAMOS EL SAFEAREADVIEW CORRECTO
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const router = useRouter();

  return (
    // 2. USAMOS SAFEARAEVIEW COMO EL CONTENEDOR PRINCIPAL
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. Área de la Imagen de Perfil */}
        <View style={styles.avatarContainer}>
          {/* Imagen del avatar */}
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/women/44.jpg',
            }}
            style={styles.avatarImage}
          />
        </View>

        {/* 2. Información del Usuario */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>Brendan Moore</Text>
            <Text style={styles.verifiedIcon}>{' \u2713'}</Text>
          </View>
          <Text style={styles.emailText}>brendamoo@gmail.com</Text>
          <Text style={styles.phoneText}>+52 (449) 000 0000</Text>
        </View>

        {/* 3. Métricas (Cars published y Reservations) */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>183</Text>
            <Text style={styles.metricLabel}>Cars published</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValueBold}>2,824</Text>
            <Text style={styles.metricLabel}>Reservations</Text>
          </View>
        </View>

        {/* 4. Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonOrange}
            onPress={() => router.push('/change-password')} // Asumo que esta ruta existe
          >
            <Text style={styles.buttonText}>Change password</Text>
          </TouchableOpacity>

          {/* ----- ¡AQUÍ ESTÁ LA CORRECCIÓN! ----- */}
          <TouchableOpacity
            style={styles.buttonOrange}
            onPress={() => router.push('/drawer/myreservations')} // <-- Ruta a tus reservaciones
          >
            <Text style={styles.buttonText}>Reservations</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---

const styles = StyleSheet.create({
  // 3. AÑADIMOS EL ESTILO PARA SAFEARAEVIEW
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    // backgroundColor: '#fff', // <--- Quitado, ya está en safeArea
    padding: 20,
    alignItems: 'center',
  },

  // Estilos del Avatar
  avatarContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },

  // Estilos de la Información del Usuario
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedIcon: {
    fontSize: 18,
    color: '#1e90ff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 16,
    color: '#666',
  },

  // Estilos de las Métricas
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6700',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },

  // Estilos de los Botones
  buttonContainer: {
    width: '90%',
  },
  buttonOrange: {
    backgroundColor: '#ff6700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Profile;