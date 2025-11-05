import CustomDrawer from '@/components/shared/CustomDrawer';
import { Ionicons } from '@expo/vector-icons';
import Drawer from 'expo-router/drawer';
import React from 'react';

const DrawerLayout = () => {
  return (
    <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
            overlayColor:'rgba(0,0,0,0.5)',
            drawerActiveTintColor:'orange',
            headerShadowVisible:false,
            sceneStyle:{
                backgroundColor:'white'
            },
            drawerPosition:"right"
        }}
    >
      <Drawer.Screen
        name="home" 
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerIcon:({color,size})=>(
            <Ionicons name='home-outline'
            size={size} color={color}>
            </Ionicons>
          )
        }}
      />
      <Drawer.Screen
        name="profile/profile" 
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon:({color,size})=>(
            <Ionicons name='person-outline'
            size={size} color={color}>
            </Ionicons>
          )
        }}
      />
    </Drawer>
  )
}

export default DrawerLayout