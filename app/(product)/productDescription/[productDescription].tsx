import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "@/components/Material/BackButton";
import Colors from "@/constants/Colors";
import { useRoute } from "@react-navigation/native";
import Spacing from "@/constants/Spacing";
import { DishDetail } from "../product/[productId]";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { callGetAllDishes, callGetDishDetail } from "@/services/api-call";
import WebView from "react-native-webview";
import Loading from "@/components/Loading/Loading";

const ProductDescription = () => {
  const route = useRoute();
  const { productDescription } = route.params;
  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);
  const [webViewHeight, setWebViewHeight] = useState(0);

  const modifiedHtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-size: 16px;
          line-height: 1.6;
          font-family: "outfit-regular";
          margin: 0;
          padding: 0;
          overflow-y: hidden; /* Ngăn cuộn bên trong WebView */
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      </style>
      <script>
        function sendHeight() {
          const height = document.body.scrollHeight;
          window.ReactNativeWebView.postMessage(height);
        }
        window.onload = sendHeight;
        window.onresize = sendHeight;
      </script>
    </head>
    <body>
    ${dishDetail?.longDescription}
    </body>
  </html>
  `;

  useEffect(() => {
    const fetchDishDetail = async () => {
      try {
        const allDishesResponse = await callGetAllDishes("");
        const allDishes = allDishesResponse.data._embedded?.dishResponseList;

        const matchingDish = allDishes.find(
          (dish: DishDetail) => dish.dishId === productDescription
        );
        if (matchingDish) {
          const detailResponse = await callGetDishDetail(matchingDish.dishId);
          setDishDetail(detailResponse.data);
        } else {
          console.error("Dish not found");

          Toast.show({
            type: "customToast",
            text1: "Dish not found",
            onPress: () => Toast.hide(),
          });
          router.replace("../(tabs)/home");
        }
      } catch (error) {
        console.error("Error fetching dish detail:", error);

        Toast.show({
          type: "customToast",
          text1: "Error loading dish details",
          onPress: () => Toast.hide(),
        });
        router.back();
      }
    };

    fetchDishDetail();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <BackButton />
      <View style={{ padding: Spacing }}>
        {/* <WebView
          style={{ width: "100%", height: webViewHeight }}
          originWhitelist={["*"]}
          source={{ html: modifiedHtml }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            const height = parseInt(event.nativeEvent.data, 10);
            setWebViewHeight(height);
          }}
        /> */}
        {dishDetail ? (
          <WebView
            style={{ width: "100%", height: webViewHeight }}
            originWhitelist={["*"]}
            source={{ html: modifiedHtml }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              const height = parseInt(event.nativeEvent.data, 10);
              setWebViewHeight(height);
            }}
          />
        ) : (
          <Loading />
        )}
      </View>
    </ScrollView>
  );
};

export default ProductDescription;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
