import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import Loading from "@/components/Loading/Loading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalPortal } from "react-native-modals";
import Toast, { BaseToast } from "react-native-toast-message";
import { Provider } from "react-redux";
import Spacing from "@/constants/Spacing";
import store from "@/redux/store";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit-regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          padding: Spacing * 0.6,
          borderLeftWidth: 0,
          backgroundColor: "#0B192C",
          borderRadius: Spacing * 3,
          width: "auto",
          height: "auto",
          maxWidth: 300,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "medium",
          fontFamily: "outfit-regular",
          color: "#fff",
          paddingHorizontal: 0,
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "outfit-regular",
        }}
      />
    ),
    error: (props: any) => (
      <BaseToast
        {...props}
        style={{
          padding: Spacing,
          borderLeftWidth: 0,
          backgroundColor: "#0B192C",
          borderRadius: Spacing * 2,
          maxWidth: 300,
        }}
        contentContainerStyle={{ paddingHorizontal: Spacing }}
        text1Style={{
          fontSize: 16,
          fontWeight: "medium",
          fontFamily: "outfit-regular",
          color: "#fff",
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "outfit-regular",
        }}
      />
    ),
    warning: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "yellow" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          // fontWeight: "bold",
          fontFamily: "outfit-medium",
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "outfit-regular",
        }}
      />
    ),
    customToast: ({ text1, onPress }) => (
      <TouchableOpacity
        style={{
          backgroundColor: "#0B192C",
          maxWidth: 300,
          padding: Spacing * 0.6,
          borderRadius: Spacing * 3,
          top: 30,
        }}
        onPress={() => onPress()}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: "white", fontFamily: "outfit-regular" }}
        >
          {text1}
        </Text>
      </TouchableOpacity>
    ),
  };

  if (!fontsLoaded) {
    <Loading />;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <SafeAreaView style={styles.container}>
            <Stack>
              <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
              <Stack.Screen
                options={{ headerShown: false }}
                name="(test)/test"
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="(test)/dropdown"
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="(test)/imgselect"
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="(test)/swipe"
              />

              <Stack.Screen
                name="(auth)/welcome"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(auth)/login"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(auth)/register"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(auth)/forgotPassword"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(task)/checkout"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(task)/orderSuccess"
                options={{ headerShown: false }}
              />

              <Stack.Screen name="(account)" options={{ headerShown: false }} />

              <Stack.Screen
                name="(product)/product/[productId]"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="(blog)/blogList"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="(blog)/blogId/[blogDetails]"
                options={{ headerShown: false }}
              />

              <Stack.Screen name="(order)" options={{ headerShown: false }} />

              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <ModalPortal />
            <Toast config={toastConfig} />
          </SafeAreaView>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
