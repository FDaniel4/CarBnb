import React, { useState } from 'react';
import {
  View,
  Image,
  Alert,
  useColorScheme, 
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color'; 

import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

const DrawerDivider = () => {
  return <View className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-4" />;
};

export default function CustomDrawer(props: any) { 
  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scheme = useColorScheme();

  const handleLogout = () => {
    if (loading) return; 
    setLoading(true);
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
        props.navigation.closeDrawer();
      })
      .catch((error) => {
        console.error('Logout Error:', error);
        Alert.alert('Error', 'No se pudo cerrar sesión.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const excludedRoutes = [
    'settings', 
    'help/logout', 
    'carDetail',
    'payment',
    'searchResults',
    'autos/editcar',
    'booknow',
  ];

  const visibleRoutes = props.state.routeNames.filter(
    (name: string) => !excludedRoutes.includes(name)
  );

  return (
    <SafeAreaView
      className="flex-1"
      edges={['right', 'bottom', 'left']}
      style={{ backgroundColor: background }} 
    >
      <View
        className="h-[220px] justify-center items-center"
        style={{ backgroundColor: background }} 
      >
        <Image
          source={require('@/assets/images/Logo-trans.png')}
          className="w-[180px] h-[180px] rounded-[20px]"
          resizeMode="contain"
        />
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList
          {...props}
          state={{
            ...props.state,
            routeNames: visibleRoutes,
            index: props.state.index,
          }}
        />

        <DrawerDivider />

        <DrawerItem
          label={loading ? 'Logging out...' : 'Log out'}
          labelStyle={{ color: loading ? textColor : textColor }}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={loading ? color : color} />
          )}
          onPress={handleLogout}
          activeTintColor="orange"
        />
      </DrawerContentScrollView>

    </SafeAreaView>
  );
}