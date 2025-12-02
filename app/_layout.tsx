import { ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as NavigationBar from 'expo-navigation-bar';

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

  // 🚫 Ocultar barra de navegación de Android SIEMPRE
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

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

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === 'login';

    if (isUserLoggedIn) {
      if (inAuthGroup) router.replace('/drawer/home');
    } else {
      if (!inAuthGroup) router.replace('/login/WelcomeScreen');
    }

    SplashScreen.hideAsync();
  }, [authLoaded, isUserLoggedIn, segments, router]);

  if (!authLoaded) return null;

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
        <AuthLayout />
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
