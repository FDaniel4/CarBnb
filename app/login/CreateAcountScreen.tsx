import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useThemeColor } from "@/hooks/use-theme-color";

// 1. IMPORTAR CONTEXTO
import { useLanguage } from "../context/LanguageContext";

const CreateAccountScreen: React.FC = () => {
  const router = useRouter();
  
  // 2. USAR HOOK
  const { t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const scheme = useColorScheme();
  const inputBackground = scheme === 'dark' ? '#2C2C2E' : '#F3F3F3';

  const handleCreateAccount = () => {
    if (!fullName || !email || !password) {
      Alert.alert(t('error'), t('fillAllFields')); // <-- Traducido
      return;
    }
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("User created in Auth:", user.uid);

        try {
          const userDocRef = doc(db, "users", user.uid);

          await setDoc(userDocRef, {
            uid: user.uid,
            fullName: fullName,
            email: email.toLowerCase(), 
            profilePictureUrl: "", 
            createdAt: new Date(),
          });

          console.log("User data saved to Firestore");

          router.replace("/drawer/home");
        } catch (dbError) {
          console.error("Firestore Error:", dbError);
          setLoading(false);
          Alert.alert(t('error'), t('saveProfileError')); // <-- Traducido
        }
      })
      .catch((authError) => {
        setLoading(false);
        console.log("Auth Error:", authError.code);

        if (authError.code === "auth/email-already-in-use") {
          Alert.alert(t('error'), t('emailInUse')); // <-- Traducido
        } else if (authError.code === "auth/weak-password") {
          Alert.alert(t('error'), t('weakPassword')); // <-- Traducido
        } else if (authError.code === "auth/invalid-email") {
          Alert.alert(t('error'), t('invalidEmail')); // <-- Traducido
        } else {
          Alert.alert(t('error'), t('unexpectedError')); // <-- Traducido
        }
      });
  };

  const handleSignIn = () => {
    router.push("/login/LoginScreen");
  };

  const handleShowTerms = () => {
    // Si tienes una pantalla real de términos, usa router.push('/drawer/help/support')
    // Por ahora mantenemos la alerta traducida
    Alert.alert(
      t('termsAlertTitle'), // <-- Traducido
      t('termsAlertMsg')    // <-- Traducido
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center" style={{ backgroundColor: background }}>
      <StatusBar barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={background} />

      {/* ---- SECCIÓN LOGO ---- */}
      <View className="mt-[15%] mb-8">
        <Image
          source={require("../../assets/images/Logo-trans.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>

      {/* ---- TÍTULO ---- */}
      <Text className="text-3xl font-bold text-gray-800 mb-8"
        style={{ color: textColor }}>{t('createAccountTitle')}</Text> {/* <-- Traducido */}

      {/* ---- SECCIÓN INPUTS ---- */}
      <View className="w-[85%] space-y-4 mb-8">
        {/* Input Full Name */}
        <View className="flex-row items-center p-3 rounded-3xl mb-2"
          style={{ backgroundColor: inputBackground }}>
          <Ionicons name="person-outline" size={20} color={textColor} />
          <TextInput
            placeholder={t('fullNamePlaceholder')} // <-- Traducido
            placeholderTextColor="#888"
            onChangeText={setFullName}
            value={fullName}
            className="flex-1 ml-3 text-base"
            style={{ color: textColor }}
            editable={!loading}
          />
        </View>

        {/* Input Email */}
        <View className="flex-row items-center p-3 rounded-3xl mb-2"
          style={{ backgroundColor: inputBackground }}>
          <Ionicons name="mail-outline" size={20} color={textColor} />
          <TextInput
            placeholder={t('email')} // <-- Traducido
            placeholderTextColor="#888"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            className="flex-1 ml-3 text-base"
            style={{color:textColor}}
            editable={!loading}
          />
        </View>

        {/* Input Password */}
        <View className="flex-row items-center p-3 rounded-3xl mb-2"
          style={{ backgroundColor: inputBackground }}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            placeholder={t('password')} // <-- Traducido
            placeholderTextColor="#888"
            onChangeText={setPassword}
            value={password}
            secureTextEntry 
            className="flex-1 ml-3 text-base"
            style={{color:textColor}}
            editable={!loading}
          />
        </View>
      </View>

      {/* ---- BOTÓN CREATE ACCOUNT ---- */}
      <TouchableOpacity
        className={`bg-[#F97A4B] py-4 w-[85%] rounded-full mb-6 shadow-md shadow-black/20 items-center ${
          loading ? "bg-gray-400" : "bg-[#F97A4B]"
        }`}
        onPress={handleCreateAccount}
        disabled={loading}
      >
        <Text className="text-white text-lg font-bold">
          {loading ? t('creatingAccountBtn') : t('createAccountBtn')} {/* <-- Traducido */}
        </Text>
      </TouchableOpacity>

      {/* ---- TEXTO DE TÉRMINOS ---- */}
      <View className="w-[85%] flex-row flex-wrap justify-center items-center mb-4">
        <Text className="text-xs text-gray-400">
          {t('termsAgreement')} {/* <-- Traducido */}
        </Text>
        <TouchableOpacity onPress={handleShowTerms}>
          <Text className="text-xs text-gray-600 font-bold underline">
            {t('termsLink')} {/* <-- Traducido */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- TEXTO SIGN IN ---- */}
      <View className="flex-row justify-center items-center">
        <Text className="text-sm text-gray-400">{t('alreadyHaveAccount')} </Text> {/* <-- Traducido */}
        <TouchableOpacity onPress={handleSignIn}>
          <Text className="text-sm text-[#F97A4B] font-bold">{t('signIn')}</Text> {/* <-- Traducido */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;