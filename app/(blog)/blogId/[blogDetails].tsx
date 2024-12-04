import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { ScrollView } from "react-native-gesture-handler";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { callGetBlogById } from "@/services/api-call";
import ImageWithFallback from "@/components/Image/ImageWithFallback";
import FontSize from "@/constants/FontSize";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const BlogId = () => {
  const route = useRoute();
  const { blogDetails } = route.params;
  const [blogData, setBlogData] = useState(null);
  const [webViewHeight, setWebViewHeight] = useState(0);
  // console.log("blogData: ", blogData?.content);

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
      ${blogData?.content}
    </body>
  </html>
  `;

  const fetchBlogData = async () => {
    try {
      const response = await callGetBlogById(blogDetails || "");

      if (response.status != 200) {
        throw new Error("Request failed with status " + response.status);
      }

      setBlogData(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  return (
    <>
      <View style={{ backgroundColor: Colors.white }}>
        <HeaderPage titlePage="" />
      </View>
      {blogData == null ? (
        <Text>Error</Text>
      ) : (
        <ScrollView style={[styles.container]}>
          <View style={{ marginBottom: Spacing }}>
            <ImageWithFallback
              source={{ uri: blogData.thumbnail }}
              fallbackSource={require("../../../assets/images/avatar-png.png")}
              style={{
                width: "100%",
                height: 240,
                borderRadius: Spacing * 1.6,
              }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={{
              color: Colors.primary,
              fontFamily: "outfit-medium",
              fontSize: FontSize.large,
            }}
          >
            {blogData?.title}
          </Text>
          <View style={{ marginBottom: Spacing }}>
            <Text
              style={[
                styles.title_2_noMargin,
                { color: Colors.darkText, textAlign: "right" },
              ]}
            >
              {blogData.totalComments} comments
            </Text>
          </View>

          <View style={{ marginBottom: Spacing }}>
            <View
              style={[
                styles.flexStart,
                { gap: Spacing, marginBottom: Spacing },
              ]}
            >
              <FontAwesome
                name="user"
                size={Spacing * 2}
                color={Colors.primary}
                style={{ width: Spacing * 2.4 }}
              />
              <Text style={[styles.title_2_noMargin]}>{blogData.author}</Text>
            </View>
            <View
              style={[
                styles.flexStart,
                { gap: Spacing, marginBottom: Spacing },
              ]}
            >
              <AntDesign
                name="calendar"
                size={Spacing * 2}
                color={Colors.primary}
                style={{ width: Spacing * 2.4 }}
              />

              <Text style={[styles.title_2_noMargin]}>
                {new Date(blogData.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          </View>

          {/* <View style={{ flex: 1, minHeight: 600 }}>
            <WebView
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              source={{ html: modifiedHtml }}
              javaScriptEnabled={true} // Kích hoạt JavaScript
              domStorageEnabled={true} // Kích hoạt lưu trữ DOM
            />
          </View> */}

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
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: Spacing,
  },
  title: {
    fontFamily: "outfit-bold",
    marginBottom: Spacing * 0.6,
  },
  title_2_noMargin: {
    fontFamily: "outfit-medium",
    marginBottom: 0,
  },
  flexStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default BlogId;
