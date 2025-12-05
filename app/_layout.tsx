import { ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// --- Imports usando rutas relativas (../) para evitar errores ---
import { onAuthStateChanged } from 'firebase/auth';
import "../global.css";
import { useColorScheme } from '../hooks/use-color-scheme';
import { useThemeColor } from '../hooks/use-theme-color';
import { auth } from '../utils/firebaseConfig';

// 1. IMPORTAR EL PROVIDER DE IDIOMA
import { LanguageProvider } from './context/LanguageContext';

SplashScreen.preventAutoHideAsync();

function AuthLayout() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    // Configuración opcional de la barra de navegación de Android
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  // --- LÓGICA DE SESIÓN PERSISTENTE ---
  // Esto es lo que mantiene la sesión viva al cerrar y abrir la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user); // Si user existe, true. Si es null, false.
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  // --- LÓGICA DE REDIRECCIÓN AUTOMÁTICA ---
  useEffect(() => {
    if (!authLoaded) return;

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === 'login'; // Asumiendo que tus pantallas de auth están en la carpeta (login) o login/

    if (isUserLoggedIn) {
      // Si está logueado y trata de entrar a login, lo mandamos al Home
      if (inAuthGroup) {
        router.replace('/drawer/home');
      }
    } else {
      // Si NO está logueado y trata de entrar a cualquier lado que no sea login, lo mandamos a Welcome
      if (!inAuthGroup) {
        router.replace('/login/WelcomeScreen');
      }
    }

    SplashScreen.hideAsync();
  }, [authLoaded, isUserLoggedIn, segments, router]);

  if (!authLoaded) return null; // O un Spinner de carga global

  return (
    <ThemeProvider
      value={{
        dark: scheme === 'dark',
        colors: {
          background,
          text: textColor,
          card: background,
          border: background,
          primary: textColor,
          notification: textColor,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? "light-content" : "dark-content"}
        backgroundColor={background}
      />

      {/* Renderiza la pantalla actual (Login, Drawer, etc.) */}
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={stripeKey}
        merchantIdentifier="merchant.com.carbnb.app"
      >
        {/* 2. ENVOLVER LA APLICACIÓN CON EL CONTEXTO DE IDIOMA AQUI */}
        {/* Al envolver AuthLayout, el idioma estará disponible en toda la app */}
        <LanguageProvider>
            <AuthLayout />
        </LanguageProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}