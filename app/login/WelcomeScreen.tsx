import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar, 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Background } from '@react-navigation/elements';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scheme = useColorScheme();

  // Navega a la pantalla de Login
  const handleSignIn = () => {
    router.push('/login/LoginScreen');
  };

  const handleSignUp = () => {
    router.push('/login/CreateAcountScreen');
  };
  const handleSkip = () => {
    setLoading(true);
    signInAnonymously(auth)
      .then(() => {
        console.log('Signed in anonymously!');
        router.replace('/drawer/home');
      })
      .catch((error) => {
        console.error('Anonymous Sign-In Error:', error);
        Alert.alert('Error', 'Could not sign in as guest.');
        setLoading(false);
        // isAnonymous: true
      });
  };

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: background}}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={background} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ---- SECCIÓN SKIP ---- */}
        <View className="w-full items-end px-7 pt-2.5">
          <TouchableOpacity onPress={handleSkip} disabled={loading}>
            <Text className={`text-base ${
                loading ? 'text-gray-200' : 'text-gray-400'
              }`}
            >
              SKIP
              </Text>
          </TouchableOpacity>
        </View>

        {/* ---- SECCIÓN LOGO ---- */}
        <View className="mt-[10%] mb-10 items-center">
          <Image
            source={require('../../assets/images/Logo-trans.png')}
            className="w-56 h-56"
            resizeMode="contain"
          />
        </View>

        {/* ---- SECCIÓN BIENVENIDA ---- */}
        <Text className="text-3xl font-light mb-16"
        style={{color: textColor}}>
          Welcome
        </Text>

        {/* ---- BOTÓN SIGN IN ---- */}
        <TouchableOpacity
          className={`py-4 px-24 rounded-full mb-10 shadow-md shadow-black/20 ${
            loading ? 'bg-gray-400' : 'bg-[#F97A4B]'
          }`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">Sign in</Text>
        </TouchableOpacity>

        {/* ---- SECCIÓN ÍCONOS SOCIALES ---- */}
        <View className="flex-row justify-evenly w-[70%] mb-10">
          {/* Ícono de Facebook */}
          <TouchableOpacity
            className={`w-12 h-12 rounded-full justify-center items-center ${
              loading ? 'bg-gray-200' : (scheme === 'dark' ? 'bg-white' : 'bg-black')
            }`}
            disabled={loading}
          >
            <Ionicons name="logo-facebook" size={24} color={scheme === 'dark' ? 'black' : 'white'} />
          </TouchableOpacity>

          {/* Ícono de Chrome/Google */}
          <TouchableOpacity
            className={`w-12 h-12 rounded-full justify-center items-center ${
              loading ? 'bg-gray-200' : (scheme === 'dark' ? 'bg-white' : 'bg-black')
            }`}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color={scheme === 'dark' ? 'black' : 'white'} />
          </TouchableOpacity>

          {/* Ícono de Apple */}
          <TouchableOpacity
            className={`w-12 h-12 rounded-full justify-center items-center ${
              loading ? 'bg-gray-200' : (scheme === 'dark' ? 'bg-white' : 'bg-black')
            }`}
            disabled={loading}
          >
            <Ionicons name="logo-apple" size={24} color={scheme === 'dark' ? 'black' : 'white'} />
          </TouchableOpacity>
        </View>

        {/* ---- TEXTO DE ABAJO ---- */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-gray-400">Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp} disabled={loading}>
            <Text
              className={`text-sm font-bold ${
                loading ? 'text-gray-400' : 'text-[#F97A4B]'
              }`}
            >
              Create acount
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 20, 
  },
});

export default WelcomeScreen;