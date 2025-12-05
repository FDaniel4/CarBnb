import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Firebase y Hooks ---
import { useThemeColor } from "@/hooks/use-theme-color";
import { auth, db, storage } from "@/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// --- Traducciones ---
import { useLanguage } from "../../context/LanguageContext";

export default function PublishCarScreen() {
  const router = useRouter();
  const { t } = useLanguage(); // Hook de idioma

  // --- Tema visual ---
  const scheme = useColorScheme();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const inputBg = scheme === "dark" ? "#2C2C2E" : "#F3F3F3";
  const placeholderColor = "#9CA3AF";

  // --- Estados del formulario ---
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [style, setStyle] = useState("");
  const [price, setPrice] = useState("");
  const [passengers, setPassengers] = useState("4");
  const [transmission, setTransmission] = useState<"Auto" | "Manual">("Auto");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // --- Verificar autenticación ---
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      setIsGuest(true);
    }
  }, []);

  // --- Seleccionar imagen desde la galería ---
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permissionDenied"), t("galleryPermissionMsg"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- Subir imagen y publicar nuevo auto ---
  const handlePublish = async () => {
    if (isGuest) return;

    // Validar datos obligatorios
    if (!name || !price || !imageUri || !style || !city) {
      Alert.alert(t("missingData"), t("missingDataMsg"));
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Subir la imagen a Firebase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `${auth.currentUser!.uid}_${Date.now()}.jpg`;
      const imageRef = ref(
        storage,
        `cars/${auth.currentUser!.uid}/${filename}`
      );

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // 2️⃣ Crear documento en la colección "cars" de Firestore
      await addDoc(collection(db, "cars"), {
        ownerId: auth.currentUser!.uid,
        name,
        city,
        style,
        price,
        passengers: parseInt(passengers) || 4,
        transmission,
        description,
        image: imageUrl,
        blockedDates: [], // Inicializamos array vacío para disponibilidad
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Notificar al usuario y regresar al Home
      Alert.alert(t("successTitle"), t("publishSuccessMsg"), [
        { text: "OK", onPress: () => router.push("/drawer/home") },
      ]);

      // 4️⃣ Limpiar formulario
      setName("");
      setCity("");
      setStyle("");
      setPrice("");
      setImageUri(null);
      setDescription("");
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("publishErrorMsg"));
    } finally {
      setLoading(false);
    }
  };

  // --- Si el usuario es invitado, mostrar bloqueo ---
  if (isGuest) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons
            name="lock-closed-outline"
            size={80}
            color={scheme === "dark" ? "#555" : "#DDD"}
          />
          <Text
            className="text-2xl font-bold mt-6 text-center"
            style={{ color: textColor }}
          >
            {t("accessRestricted")}
          </Text>
          <Text className="text-gray-500 mt-2 text-center mb-10 text-base leading-6">
            {t("guestMessagePublish")}
          </Text>
          <TouchableOpacity
            className="bg-orange-500 py-4 px-10 rounded-full shadow-lg"
            onPress={() => signOut(auth)}
          >
            <Text className="text-white font-bold text-lg">{t("signIn")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Vista principal de publicación ---
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: background }}>
      <ScrollView
        contentContainerClassName="p-5 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold mb-6" style={{ color: textColor }}>
          {t("publishCarTitle")}
        </Text>

        {/* Sección: Imagen del auto */}
        <TouchableOpacity
          onPress={handlePickImage}
          className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6 justify-center items-center overflow-hidden border-2 border-dashed border-gray-400"
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={40} color="gray" />
              <Text className="text-gray-500 mt-2">{t("tapToAddPhoto")}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Campos del formulario */}
        <View className="space-y-4">
          {/* Modelo */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
              {t("modelLabel")}
            </Text>
            <TextInput
              placeholder={t("modelPlaceholder")}
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={setName}
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base"
            />
          </View>

          {/* Ciudad */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
              {t("cityLabel")}
            </Text>

            <TouchableOpacity
              onPress={() => setShowCityPicker(true)}
              style={{ backgroundColor: inputBg }}
              className="p-4 rounded-lg"
            >
              <Text
                className={`text-base ${city ? "text-black" : "text-gray-400"}`}
              >
                {city}
              </Text>
            </TouchableOpacity>

            {/* Modal de selección */}
            <Modal transparent visible={showCityPicker} animationType="fade">
              <TouchableOpacity
                className="flex-1 bg-black/50 justify-center items-center"
                onPress={() => setShowCityPicker(false)}
                activeOpacity={1}
              >
                <View className="bg-white p-4 rounded-xl w-4/5">
                  {[
                    "Aguascalientes",
                    "CDMX",
                    "Guadalajara",
                    "Monterrey",
                    "Cancún",
                    "Puebla",
                  ].map((c) => (
                    <TouchableOpacity
                      key={c}
                      className="p-3 border-b border-gray-200"
                      onPress={() => {
                        setCity(c);
                        setShowCityPicker(false);
                      }}
                    >
                      <Text className="text-base">{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Estilo (SUV, Sedan...) */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
              {t("styleLabel")}
            </Text>
            <TextInput
              placeholderTextColor={placeholderColor}
              value={style}
              onChangeText={setStyle}
              style={{ backgroundColor: inputBg, color: textColor }}
              className="p-4 rounded-lg text-base"
            />
          </View>

          {/* Fila: Pasajeros y Transmisión */}
          <View className="flex-row space-x-4">
            {/* Pasajeros */}
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
                {t("passengersLabel") || "Pasajeros"}
              </Text>
              <TextInput
                keyboardType="numeric"
                value={passengers}
                onChangeText={setPassengers}
                style={{ backgroundColor: inputBg, color: textColor }}
                className="p-4 rounded-lg text-base text-center"
              />
            </View>

            {/* Transmisión (Checkboxes) */}
            <View className="flex-1">
              <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
                {t("transmissionDefault") || "Transmisión"}
              </Text>

              <View
                className="p-3 rounded-lg"
                style={{ backgroundColor: inputBg }}
              >
                {/* Auto */}
                <TouchableOpacity
                  onPress={() => setTransmission("Auto")}
                  className="flex-row items-center mb-2"
                >
                  {/* Checkbox */}
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center 
          ${
            transmission === "Auto"
              ? "bg-black border-black"
              : "border-gray-400"
          }`}
                  >
                    {transmission === "Auto" && (
                      <Text className="text-white text-xs font-bold">✔</Text>
                    )}
                  </View>

                  <Text
                    className={`text-xs font-bold ${
                      transmission === "Auto" ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {t("automatic")}
                  </Text>
                </TouchableOpacity>

                {/* Manual */}
                <TouchableOpacity
                  onPress={() => setTransmission("Manual")}
                  className="flex-row items-center"
                >
                  {/* Checkbox */}
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center 
          ${
            transmission === "Manual"
              ? "bg-black border-black"
              : "border-gray-400"
          }`}
                  >
                    {transmission === "Manual" && (
                      <Text className="text-white text-xs font-bold">✔</Text>
                    )}
                  </View>

                  <Text
                    className={`text-xs font-bold ${
                      transmission === "Manual" ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {t("manual")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Precio */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
              {t("pricePerDayLabel")}
            </Text>
            <View className="relative">
              <Text className="absolute left-4 top-4 text-gray-500 text-base">
                $
              </Text>
              <TextInput
                placeholder={t("pricePlaceholder")}
                placeholderTextColor={placeholderColor}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={{ backgroundColor: inputBg, color: textColor }}
                className="p-4 pl-8 rounded-lg text-base font-bold text-orange-500"
              />
            </View>
          </View>

          {/* Descripción */}
          <View>
            <Text className="mb-1 font-bold text-gray-500 text-xs uppercase">
              {t("descriptionLabel") || "Descripción"}
            </Text>
            <TextInput
              placeholder={t("descriptionPlaceholder")}
              placeholderTextColor={placeholderColor}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: inputBg,
                color: textColor,
                minHeight: 100,
                textAlignVertical: "top",
              }}
              className="p-4 rounded-lg text-base"
            />
          </View>
        </View>

        {/* Botón para publicar */}
        <TouchableOpacity
          onPress={handlePublish}
          disabled={loading}
          className={`mt-8 py-4 rounded-xl items-center shadow-md ${
            loading ? "bg-gray-400" : "bg-orange-500"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              {t("publishCarBtn")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
