import { ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
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

SplashScreen.preventAutoHideAsync();

function AuthLayout() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // --- Lógica de Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoaded) return;

    // --- SOLUCIÓN DEL ERROR ---
    // Convertimos 'segments[0]' a string genérico para que TS no se queje
    // de que "(drawer)" no coincide con sus tipos autogenerados.
    const currentSegment = segments[0] as string;

    const inAuthGroup = currentSegment === 'login';
    const isProtectedRoute = currentSegment === '(drawer)';

    if (isUserLoggedIn) {
      // Usuario Logueado: Si trata de entrar a login, lo mandamos al home
      if (inAuthGroup) {
        router.replace('/drawer/home');
      }
    } else {
      // Usuario NO Logueado: Si trata de entrar al drawer, lo mandamos al inicio
      if (!inAuthGroup) {
        router.replace('/login/WelcomeScreen');
      }
    }

    if (authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [authLoaded, isUserLoggedIn, segments, router]);

  if (!authLoaded) {
    return null;
  }

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
  // Clave pública de Stripe (desde .env)
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={stripeKey}
        merchantIdentifier="merchant.com.carbnb.app"
      >
        <AuthLayout />
      </StripeProvider>
    </GestureHandlerRootView>
  );
}