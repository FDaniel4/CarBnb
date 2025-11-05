import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Image, View } from "react-native";

const CustomDrawer = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props} scrollEnabled={false}>
      {/* Encabezado del Drawer con imagen grande */}
      <View
        style={{
          height: 220, 
          backgroundColor: "white", 
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          source={require("../../assets/images/Logo-blanco.jpg")}
          style={{
            width: 180,             
            height: 180,
            resizeMode: "contain",
            borderRadius: 20,
          }}
        />
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
