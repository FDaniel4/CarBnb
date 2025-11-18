import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/utils/firebaseConfig";
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@react-navigation/native'; 
import { useThemeColor } from '@/hooks/use-theme-color'; 
import { useColorScheme } from '@/hooks/use-color-scheme'; 
import { StatusBar } from 'react-native'; 
import "../global.css";


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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user); 
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoaded) return;

    const inAuthGroup = segments[0] === 'login';

    if (isUserLoggedIn) {
      if (inAuthGroup) {
        router.replace('/drawer/home');
      }
    } else {
      if (!inAuthGroup) {
        // Si está en CUALQUIER otra pantalla que no sea de login,
        // lo mandamos al login.
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

      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {

  return (
      <AuthLayout />
    );
}
