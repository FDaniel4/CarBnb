import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';

// --- 1. Importar el PROVEEDOR REAL y la CONFIGURACIÓN ---
import { config } from '@gluestack-ui/config'; // <-- Importar la config por defecto
import { GluestackUIProvider as RealGluestackProvider } from '@gluestack-ui/themed';

// --- 2. NO NECESITAMOS IMPORTAR NADA MÁS ---
// GluestackUIProvider ya incluye OverlayProvider y ToastProvider

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // --- 3. Usar el PROVEEDOR REAL ---
  // Mantenemos tu lógica de 'colorScheme' de nativewind
  // y la usamos para controlar el 'colorMode' de Gluestack.
  return (
    <RealGluestackProvider config={config} colorMode={colorScheme}>
      {/* ¡YA NO NECESITAMOS ENVOLVER NADA! 
        El proveedor principal se encarga de todo.
      */}
      {props.children}
    </RealGluestackProvider>
  );
}