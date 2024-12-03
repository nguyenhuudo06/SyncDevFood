import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import Colors from "@/constants/Colors";
import { router } from "expo-router";  // Sử dụng router để điều hướng

const { height } = Dimensions.get("window");

const Welcome = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ImageBackground
          style={{ height: height / 2.5, width: "100%" }}
          resizeMode="contain"
          source={require("../../assets/images/pngegg.png")}
        />
      </View>
      <View style={{ paddingHorizontal: Spacing * 4, paddingTop: Spacing * 4 }}>
        <Text
          style={{
            fontSize: FontSize.xLarge,
            color: Colors.primary,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}
        >
          Discover Your Food Dream Here
        </Text>
        <Text
          style={{
            fontSize: FontSize.small,
            color: Colors.text,
            fontFamily: "outfit-regular",
            textAlign: "center",
            marginTop: Spacing * 2,
          }}
        >
          Get ready for a great dining experience that is fast and convenient
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 5,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: Spacing * 2,
            paddingVertical: Spacing * 1.5,
            width: "48%",
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
          onPress={() => router.push("./login")}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              color: Colors.onPrimary,
              fontSize: FontSize.large,
              textAlign: "center",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: Spacing * 2,
            paddingVertical: Spacing * 1.5,
            width: "48%",
            borderRadius: Spacing,
          }}
          onPress={() => router.push("./register")}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              color: Colors.text,
              fontSize: FontSize.large,
              textAlign: "center",
            }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;
