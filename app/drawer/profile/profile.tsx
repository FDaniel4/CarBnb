import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const Profile = () => {
  return (
    <View style={styles.container}>
      {/* 1. Área de la Imagen de Perfil */}
      <View style={styles.avatarContainer}>
        {/* Usar un componente Image o View para el placeholder del avatar */}
        <View style={styles.avatarPlaceholder} />
      </View>

      {/* 2. Información del Usuario */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>Brendan Moore</Text>
          {/* Símbolo de verificación (puedes usar un Text con un emoji o un icono) */}
          <Text style={styles.verifiedIcon}>{' \u2713'}</Text>
        </View>
        <Text style={styles.emailText}>brendamoo@gmail.com</Text>
        <Text style={styles.phoneText}>+52 449 000 0000</Text>
      </View>

      {/* 3. Métricas (Cars published y Reservations) */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>183</Text>
          <Text style={styles.metricLabel}>Cars published</Text>
        </View>
        {/* Separador vertical si lo necesitas */}
        {/* <View style={styles.metricSeparator} /> */}
        <View style={styles.metricItem}>
          <Text style={styles.metricValueBold}>2,824</Text>
          <Text style={styles.metricLabel}>Reservations</Text>
        </View>
      </View>

      {/* 4. Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOrange}>
          <Text style={styles.buttonText}>Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOrange}>
          <Text style={styles.buttonText}>Reservations</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fondo blanco
    padding: 20,
    alignItems: 'center', // Centra los elementos horizontalmente
  },
  
  // Estilos del Avatar
  avatarContainer: {
    marginTop: 50, // Espacio superior
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0', // Color gris claro para el placeholder
    // En una app real, aquí usarías <Image source={{ uri: '...' }} />
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
    color: '#1e90ff', // Azul para el check
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
    justifyContent: 'space-around', // Espacio entre las métricas
    width: '100%',
    paddingHorizontal: 40, // Padding lateral para centrar el bloque
    marginBottom: 40,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1, // Para que ocupen el mismo espacio
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6700', // Naranja para el valor destacado
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center', // Para "Cars published" se vea bien
  },
  
  // Estilos de los Botones
  buttonContainer: {
    width: '90%', // Ocupa casi todo el ancho
  },
  buttonOrange: {
    backgroundColor: '#ff6700', // Color naranja de la imagen
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Espacio entre botones
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Profile;